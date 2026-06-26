/**
 * tabStore.ts
 * Orbit Tab Store â€” Sprint 5: workspace-aware
 *
 * Tabs now carry a workspaceId.
 * Workspace owns tabs logically.
 * This store is the global index for fast lookup.
 */

import { create } from "zustand";

export interface Tab {
  id:          string;
  workspaceId: string;
  title:       string;
  url:         string;
  isLoading:   boolean;
  rendererId?: string;
}

function createTab(overrides: Partial<Tab> = {}): Tab {
  return {
    id:          crypto.randomUUID(),
    workspaceId: "workspace-personal",
    title:       "New Tab",
    url:         "",
    isLoading:   false,
    ...overrides,
  };
}

interface TabState {
  tabs:         Tab[];
  activeTabId:  string;

  addTab:       (overrides?: Partial<Tab>) => void;
  closeTab:     (id: string) => void;
  removeTab:    (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab:    (id: string, updates: Partial<Tab>) => void;

  /** Return tabs belonging to a specific workspace. */
  getWorkspaceTabs: (workspaceId: string) => Tab[];
}

const initialTab = createTab({ title: "Home", url: "" });

export const useTabStore = create<TabState>()((set, get) => ({
  tabs:        [initialTab],
  activeTabId: initialTab.id,

  addTab: (overrides = {}): void => {
    const tab = createTab(overrides);
    set((state) => ({
      tabs:        [...state.tabs, tab],
      activeTabId: tab.id,
    }));
  },

  closeTab: (id: string): void => {
    const { tabs, activeTabId } = get();
    if (tabs.length === 1) return;
    const index = tabs.findIndex((t) => t.id === id);
    const next  = tabs[index === 0 ? 1 : index - 1];
    set({
      tabs:        tabs.filter((t) => t.id !== id),
      activeTabId: activeTabId === id ? (next?.id ?? "") : activeTabId,
    });
  },

  removeTab: (id: string): void => {
    set((state) => ({
      tabs: state.tabs.filter((t) => t.id !== id),
    }));
  },

  setActiveTab: (id: string): void => {
    set({ activeTabId: id });
  },

  updateTab: (id: string, updates: Partial<Tab>): void => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  getWorkspaceTabs: (workspaceId: string): Tab[] => {
    return get().tabs.filter((t) => t.workspaceId === workspaceId);
  },
}));