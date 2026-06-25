/**
 * BrowserView.tsx
 * Orbit Browser Component - WebView Host
 *
 * Renders the browser content area for the active tab.
 * Blank tabs now render NewTabPage instead of a plain placeholder.
 */

import { useEffect, useRef } from "react";
import { useBrowserStore } from "@/store/browserStore";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { useContentBounds } from "@/hooks/useContentBounds";
import { LayoutManager } from "@/layout/LayoutManager";
import { BrowserLoading } from "./BrowserLoading";
import { BrowserError } from "./BrowserError";
import { NewTabPage } from "./NewTabPage";

interface BrowserViewProps {
  sidebarWidth: number;
}

export function BrowserView({ sidebarWidth }: BrowserViewProps): React.JSX.Element {
  const { activeTabId } = useTabStore();
  const { tabStates } = useBrowserStore();
  const prevBoundsRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const bounds = useContentBounds({ sidebarWidth });
  const tabState = activeTabId ? tabStates[activeTabId] : null;

  useEffect(() => {
    if (LayoutManager.boundsEqual(prevBoundsRef.current, bounds)) return;
    prevBoundsRef.current = bounds;
    browserFacade.updateBounds(bounds).catch(console.warn);
  }, [bounds]);

  useEffect(() => {
    if (!activeTabId) return;
    browserFacade.activateTab(activeTabId).catch(console.warn);
  }, [activeTabId]);

  useEffect(() => {
    return () => {
      browserFacade.stopPolling();
    };
  }, []);

  const showNewTabPage = !tabState?.url && !tabState?.isLoading && !tabState?.error;

  return (
    <div
      className="relative flex flex-col h-full w-full bg-[var(--bg)]"
      aria-label="Browser content"
    >
      {tabState?.isLoading && (
        <BrowserLoading progress={tabState.progress} />
      )}

      {tabState?.error && !tabState.isLoading && (
        <BrowserError error={tabState.error} />
      )}

      {showNewTabPage && <NewTabPage />}

      {/* WebView anchor */}
      <div
        id="orbit-webview-host"
        className={showNewTabPage ? "hidden" : "flex-1 w-full"}
        aria-hidden="true"
      />
    </div>
  );
}