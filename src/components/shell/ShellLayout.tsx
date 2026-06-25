/**
 * ShellLayout.tsx
 * Orbit Application Shell
 *
 * Sprint 3: Sidebar width is tracked here and passed
 * down to BrowserView so it can compute content bounds.
 * The sidebar width is the only layout input the shell provides.
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
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
import { LAYOUT } from "@/layout/LayoutConstants";

export function ShellLayout(): React.JSX.Element {
  useTheme();
  useKeyboardShortcuts();

  const location = useLocation();
  const { tabs, activeTabId } = useTabStore();
  const { initTabState }      = useBrowserStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarWidth = sidebarCollapsed
    ? LAYOUT.SIDEBAR_COLLAPSED
    : LAYOUT.SIDEBAR_EXPANDED;

  const isShellPage = location.pathname === "/" || location.pathname === "/settings";

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

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <TitleBar />
      <TabBar />
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />

        <main className="flex-1 overflow-hidden bg-[var(--bg)] relative">
          {isShellPage ? (
            <div className="h-full overflow-auto orbit-scrollbar">
              <Outlet />
            </div>
          ) : (
            <BrowserView sidebarWidth={sidebarWidth} />
          )}
        </main>
      </div>
    </div>
  );
}