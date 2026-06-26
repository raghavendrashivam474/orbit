/**
 * bookmarkStore.ts
 * Orbit Bookmark Store
 */

import { create } from "zustand";
import { BookmarkRepository, type BookmarkRecord } from "@/repositories/BookmarkRepository";

interface BookmarkState {
  bookmarks:   BookmarkRecord[];
  isLoading:   boolean;
  searchQuery: string;

  load:         ()                             => Promise<void>;
  search:       (query: string)               => Promise<void>;
  add:          (url: string, title: string)  => Promise<void>;
  remove:       (id: string)                  => Promise<void>;
  removeByUrl:  (url: string)                 => Promise<void>;
  isSaved:      (url: string)                 => Promise<boolean>;
  updateTitle:  (id: string, title: string)   => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>()((set, get) => ({
  bookmarks:   [],
  isLoading:   false,
  searchQuery: "",

  load: async (): Promise<void> => {
    set({ isLoading: true });
    try {
      const bookmarks = await BookmarkRepository.all();
      set({ bookmarks, isLoading: false });
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
      const bookmarks = await BookmarkRepository.search(query);
      set({ bookmarks, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  add: async (url: string, title: string): Promise<void> => {
    const bookmark = await BookmarkRepository.add(url, title);
    set((state) => ({ bookmarks: [bookmark, ...state.bookmarks] }));
  },

  remove: async (id: string): Promise<void> => {
    await BookmarkRepository.delete(id);
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== id),
    }));
  },

  removeByUrl: async (url: string): Promise<void> => {
    await BookmarkRepository.deleteByUrl(url);
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.url !== url),
    }));
  },

  isSaved: async (url: string): Promise<boolean> => {
    return BookmarkRepository.isSaved(url);
  },

  updateTitle: async (id: string, title: string): Promise<void> => {
    await BookmarkRepository.updateTitle(id, title);
    set((state) => ({
      bookmarks: state.bookmarks.map((b) =>
        b.id === id ? { ...b, title } : b
      ),
    }));
  },
}));