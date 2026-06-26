import { create } from "zustand";

export interface Tab {
  id:          string;
  workspaceId: string;
  url:         string;
  title:       string;
  isLoading:   boolean;
  canGoBack:   boolean;
  canGoForward:boolean;
}

interface TabState {
  tabs:         Tab[];
  activeTabId:  string;

  addTab:       (workspaceId: string, url?: string) => Tab;
  closeTab:     (id: string) => void;
  setActiveTab: (id: string) => void;
  updateTab:    (id: string, updates: Partial<Tab>) => void;
  getTab:       (id: string) => Tab | undefined;
  getActiveTab: () => Tab | undefined;
  getWorkspaceTabs: (workspaceId: string) => Tab[];
}

function newTab(workspaceId: string, url = ""): Tab {
  return {
    id:           crypto.randomUUID(),
    workspaceId,
    url,
    title:        url ? "Loading..." : "New Tab",
    isLoading:    false,
    canGoBack:    false,
    canGoForward: false,
  };
}

export const useTabStore = create<TabState>()((set, get) => ({
  tabs:        [],
  activeTabId: "",

  addTab: (workspaceId, url = "") => {
    const tab = newTab(workspaceId, url);
    set((s) => ({
      tabs:        [...s.tabs, tab],
      activeTabId: tab.id,
    }));
    return tab;
  },

  closeTab: (id) => {
    const { tabs, activeTabId } = get();
    const tab = tabs.find((t) => t.id === id);
    if (!tab) return;

    const workspaceTabs = tabs.filter((t) => t.workspaceId === tab.workspaceId);
    if (workspaceTabs.length <= 1) return;

    const remaining = tabs.filter((t) => t.id !== id);
    let newActive = activeTabId;

    if (activeTabId === id) {
      const wsRemaining = remaining.filter((t) => t.workspaceId === tab.workspaceId);
      const idx = workspaceTabs.findIndex((t) => t.id === id);
      newActive = wsRemaining[idx === 0 ? 0 : idx - 1]?.id ?? "";
    }

    set({ tabs: remaining, activeTabId: newActive });
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTab: (id, updates) =>
    set((s) => ({ tabs: s.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),

  getTab: (id) => get().tabs.find((t) => t.id === id),

  getActiveTab: () => {
    const { tabs, activeTabId } = get();
    return tabs.find((t) => t.id === activeTabId);
  },

  getWorkspaceTabs: (workspaceId) =>
    get().tabs.filter((t) => t.workspaceId === workspaceId),
}));