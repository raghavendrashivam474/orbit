/**
 * BrowserView.tsx
 * Orbit Browser Component - WebView Host
 *
 * Renders the browser content area for the active tab.
 * Communicates exclusively through BrowserFacade.
 *
 * This component is intentionally thin.
 * All browser logic lives in the browser/ layer.
 */

import { useEffect, useRef } from "react";
import { useBrowserStore } from "@/store/browserStore";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { BrowserLoading } from "./BrowserLoading";
import { BrowserError } from "./BrowserError";

export function BrowserView(): React.JSX.Element {
  const { activeTabId } = useTabStore();
  const { tabStates } = useBrowserStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const tabState = activeTabId ? tabStates[activeTabId] : null;

  // Activate the facade session when the active tab changes
  useEffect(() => {
    if (!activeTabId) return;
    browserFacade.activateTab(activeTabId).catch(console.warn);
  }, [activeTabId]);

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      browserFacade.stopPolling();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col h-full w-full bg-[var(--bg)]"
      aria-label="Browser content"
    >
      {/* Loading progress bar */}
      {tabState?.isLoading && (
        <BrowserLoading progress={tabState.progress} />
      )}

      {/* Error page */}
      {tabState?.error && !tabState.isLoading && (
        <BrowserError error={tabState.error} />
      )}

      {/* New tab / empty state */}
      {!tabState?.url && !tabState?.isLoading && !tabState?.error && (
        <div className="flex flex-col items-center justify-center h-full gap-3 animate-fade-in">
          <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
            Enter a URL or search above to browse.
          </p>
        </div>
      )}

      {/* WebView is managed by Rust/Tauri backend */}
      {/* This div serves as the layout anchor */}
      <div
        id="orbit-webview-host"
        className="flex-1 w-full"
        aria-hidden="true"
      />
    </div>
  );
}