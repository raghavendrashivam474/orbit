/**
 * ShellLayout.tsx
 * Orbit Application Shell
 *
 * Sprint 3: BrowserView integrated into content area.
 * Shell remains presentation only.
 * All browser operations flow through BrowserFacade.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TitleBar } from "./TitleBar";
import { TabBar } from "@/components/tabs/TabBar";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { BrowserView } from "@/components/browser/BrowserView";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTabStore } from "@/store/tabStore";
import { useBrowserStore } from "@/store/browserStore";
import { browserFacade } from "@/browser/BrowserFacade";

export function ShellLayout(): React.JSX.Element {
  useTheme();
  useKeyboardShortcuts();

  const location = useLocation();
  const { tabs, activeTabId } = useTabStore();
  const { initTabState } = useBrowserStore();

  const isHomePage     = location.pathname === "/";
  const isSettingsPage = location.pathname === "/settings";
  const showBrowser    = !isHomePage && !isSettingsPage;

  // Register new tabs with the browser facade
  useEffect(() => {
    tabs.forEach((tab) => {
      const state = browserFacade.getSessionState(tab.id);
      if (!state) {
        browserFacade.registerTab(tab.id);
        initTabState(tab.id);
      }
    });
  }, [tabs, initTabState]);

  // Activate tab when active tab changes
  useEffect(() => {
    if (activeTabId) {
      browserFacade.activateTab(activeTabId).catch(console.warn);
    }
  }, [activeTabId]);

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <TitleBar />
      <TabBar />
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-auto bg-[var(--bg)] orbit-scrollbar relative">
          {showBrowser ? (
            <BrowserView />
          ) : (
            // Home and Settings render via React Router
            <div className="h-full" />
          )}
        </main>
      </div>
    </div>
  );
}