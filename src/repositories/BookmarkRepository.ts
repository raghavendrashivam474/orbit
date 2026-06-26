/**
 * BookmarkRepository.ts
 * Orbit - TypeScript Bookmark Repository
 */

import { invoke } from "@/core/ipc/bridge";

export interface BookmarkRecord {
  id:         string;
  url:        string;
  title:      string;
  created_at: string;
  updated_at: string;
}

export const BookmarkRepository = {
  add: (url: string, title: string): Promise<BookmarkRecord> =>
    invoke("bookmark_add", { url, title }),

  all: (): Promise<BookmarkRecord[]> =>
    invoke("bookmark_all"),

  search: (query: string): Promise<BookmarkRecord[]> =>
    invoke("bookmark_search", { query }),

  isSaved: (url: string): Promise<boolean> =>
    invoke("bookmark_is_saved", { url }),

  updateTitle: (id: string, title: string): Promise<void> =>
    invoke("bookmark_update_title", { id, title }),

  delete: (id: string): Promise<void> =>
    invoke("bookmark_delete", { id }),

  deleteByUrl: (url: string): Promise<void> =>
    invoke("bookmark_delete_by_url", { url }),
} as const;