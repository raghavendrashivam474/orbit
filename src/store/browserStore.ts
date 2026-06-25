/**
 * browserStore.ts
 * Orbit Browser Store
 *
 * Manages browser state for all tabs.
 * This store is the source of truth for UI rendering.
 * It is updated exclusively by BrowserFacade.
 *
 * Components must not write to this store directly.
 */

import { create } from "zustand";
import type { TabBrowserState } from "@/browser/BrowserTypes";
import { createTabBrowserState } from "@/browser/BrowserTypes";

interface BrowserStoreState {
  /** Browser state keyed by tab ID. */
  tabStates: Record<string, TabBrowserState>;

  /** Initialize state for a new tab. */
  initTabState: (tabId: string, initialUrl?: string) => void;

  /** Update partial state for a specific tab. */
  updateTabState: (tabId: string, updates: Partial<TabBrowserState>) => void;

  /** Remove state for a closed tab. */
  removeTabState: (tabId: string) => void;

  /** Get state for a specific tab. */
  getTabState: (tabId: string) => TabBrowserState | null;
}

export const useBrowserStore = create<BrowserStoreState>()((set, get) => ({
  tabStates: {},

  initTabState: (tabId: string, initialUrl = ""): void => {
    set((state) => ({
      tabStates: {
        ...state.tabStates,
        [tabId]: createTabBrowserState(initialUrl),
      },
    }));
  },

  updateTabState: (tabId: string, updates: Partial<TabBrowserState>): void => {
    set((state) => {
      const current = state.tabStates[tabId];
      if (!current) return state;
      return {
        tabStates: {
          ...state.tabStates,
          [tabId]: { ...current, ...updates },
        },
      };
    });
  },

  removeTabState: (tabId: string): void => {
    set((state) => {
      const next = { ...state.tabStates };
      delete next[tabId];
      return { tabStates: next };
    });
  },

  getTabState: (tabId: string): TabBrowserState | null => {
    return get().tabStates[tabId] ?? null;
  },
}));