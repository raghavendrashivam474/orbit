/**
 * historyStore.ts
 * Orbit History Store
 */

import { create } from "zustand";
import { HistoryRepository, type HistoryRecord } from "@/repositories/HistoryRepository";

interface HistoryState {
  entries:    HistoryRecord[];
  isLoading:  boolean;
  searchQuery:string;

  load:        (limit?: number) => Promise<void>;
  search:      (query: string)  => Promise<void>;
  record:      (url: string, title: string) => Promise<void>;
  deleteEntry: (id: string)     => Promise<void>;
  clear:       ()               => Promise<void>;
}

export const useHistoryStore = create<HistoryState>()((set, get) => ({
  entries:     [],
  isLoading:   false,
  searchQuery: "",

  load: async (limit = 50): Promise<void> => {
    set({ isLoading: true });
    try {
      const entries = await HistoryRepository.recent(limit);
      set({ entries, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  search: async (query: string): Promise<void> => {
    set({ searchQuery: query, isLoading: true });
    try {
      if (!query.trim()) {
        await get().load();
        return;
      }
      const entries = await HistoryRepository.search(query);
      set({ entries, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  record: async (url: string, title: string): Promise<void> => {
    try {
      await HistoryRepository.record(url, title);
    } catch {
      // Non-fatal â€” history recording should never block navigation
    }
  },

  deleteEntry: async (id: string): Promise<void> => {
    await HistoryRepository.delete(id);
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    }));
  },

  clear: async (): Promise<void> => {
    await HistoryRepository.clear();
    set({ entries: [] });
  },
}));