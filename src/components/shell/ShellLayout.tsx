import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TitleBar } from "./TitleBar";
import { TabBar } from "@/components/tabs/TabBar";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { BrowserView } from "@/components/browser/BrowserView";
import { CommandPalette } from "@/components/palette/CommandPalette";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTabStore } from "@/store/tabStore";
import { useBrowserStore } from "@/store/browserStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { workspaceFacade } from "@/workspace/WorkspaceFacade";
import { PersistenceService } from "@/services/persistence/PersistenceService";
import { SessionRepository } from "@/repositories/SessionRepository";
import { LAYOUT } from "@/layout/LayoutConstants";
import { invoke } from "@/core/ipc/bridge";

const PURE_SHELL_ROUTES = [
  "/settings",
  "/workspaces",
  "/history",
  "/bookmarks",
  "/downloads",
];

export function ShellLayout(): React.JSX.Element {
  useTheme();
  useKeyboardShortcuts();

  const location = useLocation();
  const navigate = useNavigate();
  const { tabs, activeTabId } = useTabStore();
  const { tabStates, initTabState } = useBrowserStore();
  const { activeWorkspaceId } = useWorkspaceStore();
  const {
    initialize:          initSettings,
    sidebarCollapsed,
    setSidebarCollapsed,
    initialized:         settingsReady,
  } = useSettingsStore();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [appReady,    setAppReady]    = useState(false);

  const sidebarWidth = sidebarCollapsed
    ? LAYOUT.SIDEBAR_COLLAPSED
    : LAYOUT.SIDEBAR_EXPANDED;

  const activeTabState = activeTabId ? tabStates[activeTabId] : null;
  const tabHasUrl      = !!(activeTabState?.url && activeTabState.url !== "about:blank");

  const isPureShellPage = PURE_SHELL_ROUTES.includes(location.pathname);
  const isHomePage      = location.pathname === "/";

  const showHomePageUI = isHomePage && !tabHasUrl;
  const showShellPage  = isPureShellPage || showHomePageUI;
  const showBrowser    = !showShellPage;

  // Hide ALL webviews when on shell page. Show only the active tab's webview when on browser.
  useEffect(() => {
    if (!activeTabId) return;

    if (showShellPage) {
      // Hide every webview that exists
      tabs.forEach((tab) => {
        const state = tabStates[tab.id];
        if (state?.url) {
          invoke("browser_hide", { id: tab.id }).catch(() => {});
        }
      });
    } else {
      // Hide all OTHER tabs, show only active
      tabs.forEach((tab) => {
        if (tab.id === activeTabId) return;
        const state = tabStates[tab.id];
        if (state?.url) {
          invoke("browser_hide", { id: tab.id }).catch(() => {});
        }
      });

      // Show the active tab if it has a URL
      const activeState = tabStates[activeTabId];
      if (activeState?.url) {
        invoke("browser_show", { id: activeTabId }).catch(() => {});
      }
    }
  }, [location.pathname, activeTabId, showShellPage, tabs, tabStates]);

  // Navigate to Home on workspace switch
  useEffect(() => {
    if (activeWorkspaceId) {
      navigate("/");
    }
  }, [activeWorkspaceId, navigate]);

  // Navigate to Home when Ctrl+T fires
  useEffect(() => {
    const handler = (): void => navigate("/");
    window.addEventListener("orbit:navigate-home", handler);
    return () => window.removeEventListener("orbit:navigate-home", handler);
  }, [navigate]);

  useEffect(() => {
    const init = async (): Promise<void> => {
      await initSettings().catch(console.warn);
      await workspaceFacade.initialize().catch(console.warn);
      useWorkspaceStore.getState().setInitialized(true);
      setAppReady(true);
    };
    init();
  }, [initSettings]);

  useEffect(() => {
    PersistenceService.start();
    return () => PersistenceService.stop();
  }, []);

  useEffect(() => {
    tabs.forEach((tab) => {
      const state = browserFacade.getSessionState(tab.id);
      if (!state) {
        browserFacade.registerTab(tab.id);
        initTabState(tab.id);
      }
    });
  }, [tabs, initTabState]);

  useEffect(() => {
    if (activeTabId) {
      browserFacade.activateTab(activeTabId).catch(console.warn);
    }
  }, [activeTabId]);

  useEffect(() => {
    const handleUnload = (): void => {
      const { tabs: currentTabs, activeTabId: currentActiveTab } = useTabStore.getState();
      const tabsToSave = currentTabs.map((tab, i) => ({
        tab_id:   tab.id,
        url:      tab.url ?? "",
        title:    tab.title ?? "New Tab",
        position: i,
      }));
      SessionRepository.save(currentActiveTab, tabsToSave).catch(console.warn);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  useEffect(() => {
    const handler = (e: Event): void => {
      const shortcut = (e as CustomEvent<string>).detail;
      if (shortcut === "command_palette" || shortcut === "CmdOrCtrl+K") {
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("orbit:shortcut", handler);
    return () => window.removeEventListener("orbit:shortcut", handler);
  }, []);

  if (!appReady || !settingsReady) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10 animate-pulse-subtle">
            <circle cx="28" cy="28" r="8" fill="var(--color-primary)" />
            <ellipse cx="28" cy="28" rx="26" ry="12"
              stroke="var(--color-primary)" strokeWidth="1.5" fill="none" opacity="0.7" />
            <ellipse cx="28" cy="28" rx="26" ry="12"
              stroke="var(--color-purple)" strokeWidth="1.5" fill="none" opacity="0.5"
              transform="rotate(60 28 28)" />
          </svg>
          <p className="text-[var(--text-xs)] text-[var(--text-muted)]">Starting Orbit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <TitleBar />
      <TabBar />
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={(v) => setSidebarCollapsed(v).catch(console.warn)}
        />

        <main className="flex-1 overflow-hidden bg-[var(--bg)] relative">
          {showShellPage && (
            <div
              className="absolute inset-0 overflow-auto orbit-scrollbar bg-[var(--bg)]"
              style={{ zIndex: 20 }}
            >
              <Outlet />
            </div>
          )}

          {showBrowser && (
            <div className="absolute inset-0" style={{ zIndex: 10 }}>
              <BrowserView sidebarWidth={sidebarWidth} />
            </div>
          )}
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}