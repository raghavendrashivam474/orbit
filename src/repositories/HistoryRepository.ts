/**
 * HistoryRepository.ts
 * Orbit - TypeScript History Repository
 *
 * Thin IPC wrapper. All SQL lives in Rust.
 * React components and stores use this â€” never invoke directly.
 */

import { invoke } from "@/core/ipc/bridge";

export interface HistoryRecord {
  id:          string;
  url:         string;
  title:       string;
  visited_at:  string;
  visit_count: number;
}

export const HistoryRepository = {
  record: (url: string, title: string): Promise<void> =>
    invoke("history_record", { url, title }),

  recent: (limit = 50): Promise<HistoryRecord[]> =>
    invoke("history_recent", { limit }),

  search: (query: string): Promise<HistoryRecord[]> =>
    invoke("history_search", { query }),

  delete: (id: string): Promise<void> =>
    invoke("history_delete", { id }),

  clear: (): Promise<void> =>
    invoke("history_clear"),
} as const;