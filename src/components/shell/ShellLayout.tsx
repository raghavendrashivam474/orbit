/**
 * ShellLayout.tsx
 * Orbit Application Shell - Sprint 4
 *
 * Adds:
 * - Settings initialization from SQLite
 * - Persistence service startup
 * - Command palette (Ctrl+K)
 * - Session save on unmount
 */

import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
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
import { browserFacade } from "@/browser/BrowserFacade";
import { PersistenceService } from "@/services/persistence/PersistenceService";
import { SessionRepository } from "@/repositories/SessionRepository";
import { LAYOUT } from "@/layout/LayoutConstants";

const SHELL_ROUTES = [
  "/",
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
  const { tabs, activeTabId } = useTabStore();
  const { initTabState }      = useBrowserStore();
  const {
    initialize:          initSettings,
    sidebarCollapsed,
    setSidebarCollapsed,
    initialized:         settingsReady,
  } = useSettingsStore();

  const [paletteOpen, setPaletteOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed
    ? LAYOUT.SIDEBAR_COLLAPSED
    : LAYOUT.SIDEBAR_EXPANDED;

  const isShellPage = SHELL_ROUTES.includes(location.pathname);

  // Initialize settings from SQLite on first mount
  useEffect(() => {
    initSettings().catch(console.warn);
  }, [initSettings]);

  // Start persistence service
  useEffect(() => {
    PersistenceService.start();
    return () => PersistenceService.stop();
  }, []);

  // Register new tabs with facade
  useEffect(() => {
    tabs.forEach((tab) => {
      const state = browserFacade.getSessionState(tab.id);
      if (!state) {
        browserFacade.registerTab(tab.id);
        initTabState(tab.id);
      }
    });
  }, [tabs, initTabState]);

  // Activate tab on switch
  useEffect(() => {
    if (activeTabId) {
      browserFacade.activateTab(activeTabId).catch(console.warn);
    }
  }, [activeTabId]);

  // Save session on page unload
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

  // Open command palette via CustomEvent from shortcut bridge
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

  if (!settingsReady) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--bg)]">
        <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
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
          {isShellPage && (
            <div className="absolute inset-0 overflow-auto orbit-scrollbar z-10">
              <Outlet />
            </div>
          )}
          <BrowserView sidebarWidth={sidebarWidth} />
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}