/**
 * ShellLayout.tsx
 * Orbit Application Shell
 *
 * Sprint 5.4.x:
 * Removed the "HomePage as shell route" logic that duplicated
 * NewTabPage and caused first-interaction loss on new tabs.
 *
 * Now:
 *   - Shell pages (Settings, History, Bookmarks, Downloads, Workspaces)
 *     render inside <Outlet /> above the hidden webview
 *   - Everything else (including "/" and "/browse") shows BrowserView
 *   - BrowserView shows either the webview OR NewTabPage
 */

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
import { useSettingsStore } from "@/store/settingsStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { workspaceFacade } from "@/workspace/WorkspaceFacade";
import { PersistenceService } from "@/services/persistence/PersistenceService";
import { WebviewSync } from "@/browser/WebviewSync";
import { LAYOUT } from "@/layout/LayoutConstants";

// Routes that show a shell page instead of the browser
const SHELL_ROUTES = [
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
  const { activeTabId } = useTabStore();
  const { activeWorkspaceId } = useWorkspaceStore();
  const {
    initialize:       initSettings,
    sidebarCollapsed,
    setSidebarCollapsed,
    initialized:      settingsReady,
  } = useSettingsStore();

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [appReady,    setAppReady]    = useState(false);

  const sidebarWidth = sidebarCollapsed
    ? LAYOUT.SIDEBAR_COLLAPSED
    : LAYOUT.SIDEBAR_EXPANDED;

  // Only the explicit shell routes cover the browser.
  // "/" and "/browse" are browser routes — BrowserView + NewTabPage handle them.
  const showShellPage = SHELL_ROUTES.includes(location.pathname);

  // Hide webview when on shell page, show when leaving
  useEffect(() => {
    if (showShellPage) {
      WebviewSync.hideAll();
    } else {
      WebviewSync.resume();
    }
  }, [showShellPage]);

  // Sync webview visibility when active tab changes
  useEffect(() => {
    if (!showShellPage) {
      WebviewSync.sync();
    }
  }, [activeTabId, showShellPage]);

  // Sync when workspace changes
  useEffect(() => {
    if (!showShellPage) {
      WebviewSync.sync();
    }
  }, [activeWorkspaceId, showShellPage]);

  // Update bounds when sidebar changes
  useEffect(() => {
    WebviewSync.computeBoundsFromSidebar();
  }, [sidebarCollapsed]);

  // Update bounds on window resize
  useEffect(() => {
    const handler = (): void => WebviewSync.computeBoundsFromSidebar();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // App startup
  useEffect(() => {
    const init = async (): Promise<void> => {
      await initSettings().catch(console.warn);
      await workspaceFacade.initialize().catch(console.warn);
      useWorkspaceStore.getState().setInitialized(true);

      const ws = useWorkspaceStore.getState().activeWorkspaceId;
      if (ws) {
        const wsTabs = useTabStore.getState().getWorkspaceTabs(ws);
        if (wsTabs.length === 0) {
          useTabStore.getState().addTab(ws);
        }
      }

      WebviewSync.computeBoundsFromSidebar();
      setAppReady(true);
    };
    init();
  }, [initSettings]);

  useEffect(() => {
    PersistenceService.start();
    return () => PersistenceService.stop();
  }, []);

  // Navigate to "/" (browser view) when workspace switches
  useEffect(() => {
    if (activeWorkspaceId && appReady) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkspaceId]);

  // Ctrl+T dispatches this event — go to browser view for the new tab
  useEffect(() => {
    const handler = (): void => navigate("/");
    window.addEventListener("orbit:navigate-home", handler);
    return () => window.removeEventListener("orbit:navigate-home", handler);
  }, [navigate]);

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

  // Save all workspace snapshots on shutdown
  useEffect(() => {
    const handleBeforeUnload = (): void => {
      workspaceFacade.saveAllSnapshots().catch(console.warn);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  if (!appReady || !settingsReady) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 56 56" fill="none" className="w-10 h-10 animate-pulse-subtle">
            <circle cx="28" cy="28" r="8" fill="var(--color-primary)" />
            <ellipse cx="28" cy="28" rx="26" ry="12"
              stroke="var(--color-primary)" strokeWidth="1.5" fill="none" opacity="0.7" />
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
          {/* BrowserView is always mounted — it shows either the webview
              or NewTabPage depending on whether the active tab has a URL.
              This is the single source of truth for the "home" experience. */}
          <div className="absolute inset-0" style={{ zIndex: 10 }}>
            <BrowserView sidebarWidth={sidebarWidth} />
          </div>

          {/* Shell pages render on top of the (hidden) webview */}
          {showShellPage && (
            <div
              className="absolute inset-0 overflow-auto orbit-scrollbar bg-[var(--bg)]"
              style={{ zIndex: 20 }}
            >
              <Outlet />
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