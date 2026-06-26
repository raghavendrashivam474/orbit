/**
 * SessionRepository.ts
 * Orbit - TypeScript Session Repository
 */

import { invoke } from "@/core/ipc/bridge";

export interface SessionTabRecord {
  id:         string;
  session_id: string;
  tab_id:     string;
  url:        string;
  title:      string;
  position:   number;
}

export interface SessionRecord {
  id:         string;
  saved_at:   string;
  active_tab: string;
  tab_count:  number;
}

export interface FullSessionRecord {
  session: SessionRecord;
  tabs:    SessionTabRecord[];
}

export interface TabToSave {
  tab_id:   string;
  url:      string;
  title:    string;
  position: number;
}

export const SessionRepository = {
  save: (activeTab: string, tabs: TabToSave[]): Promise<string> =>
    invoke("session_save", { active_tab: activeTab, tabs }),

  loadLatest: (): Promise<FullSessionRecord | null> =>
    invoke("session_load"),
} as const;