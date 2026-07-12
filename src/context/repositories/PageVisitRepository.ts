/**
 * PageVisitRepository.ts
 * Sprint 6 — Thin IPC wrapper for PageVisit operations.
 */

import { invoke } from "@/core/ipc/bridge";
import type { PageVisit, NavigationSource } from "@/context/models/PageVisit";

interface RustPageVisit {
  id:            string;
  page_id:       string;
  workspace_id:  string;
  tab_id:        string | null;
  visited_at:    string;
  source:        string;
}

function mapVisit(r: RustPageVisit): PageVisit {
  return {
    id:          r.id,
    pageId:      r.page_id,
    workspaceId: r.workspace_id,
    tabId:       r.tab_id,
    visitedAt:   r.visited_at,
    source:      (r.source as NavigationSource) ?? "unknown",
  };
}

export interface RecordNavigationRequest {
  url:            string;
  normalizedUrl:  string;
  title:          string;
  hostname:       string;
  workspaceId:    string;
  tabId:          string | null;
  source:         NavigationSource;
}

export const PageVisitRepository = {
  /**
   * Records a navigation. Returns the Page id (created or existing).
   */
  async record(req: RecordNavigationRequest): Promise<string> {
    return invoke<string>("context_record_navigation", {
      input: {
        url:            req.url,
        normalized_url: req.normalizedUrl,
        title:          req.title,
        hostname:       req.hostname,
        workspace_id:   req.workspaceId,
        tab_id:         req.tabId,
        source:         req.source,
      },
    });
  },

  async forPage(pageId: string): Promise<PageVisit[]> {
    const raw = await invoke<RustPageVisit[]>("context_page_visits", { pageId });
    return raw.map(mapVisit);
  },

  async forWorkspace(workspaceId: string, limit = 200): Promise<PageVisit[]> {
    const raw = await invoke<RustPageVisit[]>("context_workspace_visits", {
      workspaceId,
      limit,
    });
    return raw.map(mapVisit);
  },
};