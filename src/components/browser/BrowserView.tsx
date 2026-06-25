/**
 * BrowserView.tsx
 * Orbit Browser Component - WebView Host
 *
 * Sprint 3: Reports content bounds to BrowserFacade.
 * BrowserView knows the bounds changed.
 * It does not know why they changed.
 * It simply passes the new rectangle to the facade.
 */

import { useEffect, useRef } from "react";
import { useBrowserStore } from "@/store/browserStore";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { useContentBounds } from "@/hooks/useContentBounds";
import { LayoutManager } from "@/layout/LayoutManager";
import { BrowserLoading } from "./BrowserLoading";
import { BrowserError } from "./BrowserError";

interface BrowserViewProps {
  sidebarWidth: number;
}

export function BrowserView({ sidebarWidth }: BrowserViewProps): React.JSX.Element {
  const { activeTabId } = useTabStore();
  const { tabStates }   = useBrowserStore();
  const prevBoundsRef   = useRef({ x: 0, y: 0, width: 0, height: 0 });

  const bounds = useContentBounds({ sidebarWidth });
  const tabState = activeTabId ? tabStates[activeTabId] : null;

  // Report bounds changes to the facade
  useEffect(() => {
    if (LayoutManager.boundsEqual(prevBoundsRef.current, bounds)) return;
    prevBoundsRef.current = bounds;
    browserFacade.updateBounds(bounds).catch(console.warn);
  }, [bounds]);

  // Activate tab when active tab changes
  useEffect(() => {
    if (!activeTabId) return;
    browserFacade.activateTab(activeTabId).catch(console.warn);
  }, [activeTabId]);

  // Stop polling on unmount
  useEffect(() => {
    return () => { browserFacade.stopPolling(); };
  }, []);

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

      {!tabState?.url && !tabState?.isLoading && !tabState?.error && (
        <div className="flex flex-col items-center justify-center h-full gap-3 animate-fade-in">
          <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
            Enter a URL or search above to browse.
          </p>
        </div>
      )}

      {/* Layout anchor for the child webview */}
      <div
        id="orbit-webview-host"
        className="flex-1 w-full"
        aria-hidden="true"
      />
    </div>
  );
}