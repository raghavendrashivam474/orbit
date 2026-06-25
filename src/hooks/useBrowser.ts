/**
 * useBrowser.ts
 * Orbit Browser Hook
 *
 * Provides browser operations and state to React components.
 * Components must use this hook instead of calling
 * BrowserFacade directly.
 */

import { useCallback } from "react";
import { useTabStore } from "@/store/tabStore";
import { useBrowserStore } from "@/store/browserStore";
import { browserFacade } from "@/browser/BrowserFacade";
import type { TabBrowserState } from "@/browser/BrowserTypes";

interface UseBrowserReturn {
  /** Current tab browser state. Null if no active tab. */
  state: TabBrowserState | null;

  /** Navigate to a URL or search query. */
  navigate: (input: string) => Promise<void>;

  /** Reload the current page. */
  reload: () => Promise<void>;

  /** Stop the current page load. */
  stop: () => Promise<void>;

  /** Go back in history. */
  back: () => Promise<void>;

  /** Go forward in history. */
  forward: () => Promise<void>;
}

export function useBrowser(): UseBrowserReturn {
  const { activeTabId } = useTabStore();
  const { tabStates } = useBrowserStore();

  const state = activeTabId ? (tabStates[activeTabId] ?? null) : null;

  const navigate = useCallback(
    async (input: string): Promise<void> => {
      await browserFacade.navigate(input);
    },
    [],
  );

  const reload = useCallback(async (): Promise<void> => {
    await browserFacade.reload();
  }, []);

  const stop = useCallback(async (): Promise<void> => {
    await browserFacade.stop();
  }, []);

  const back = useCallback(async (): Promise<void> => {
    await browserFacade.back();
  }, []);

  const forward = useCallback(async (): Promise<void> => {
    await browserFacade.forward();
  }, []);

  return { state, navigate, reload, stop, back, forward };
}