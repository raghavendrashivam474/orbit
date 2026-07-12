/**
 * ContextQueryService.ts
 * Sprint 6 -- Primary read interface for Context Engine consumers.
 *
 * All context reads go through this service.
 * React components, command palette, future AI features -- all
 * consume context through ContextQueryService, never via direct
 * repository access.
 *
 * Timeline is derived from PageVisits (no timeline table).
 */

import { PageRepository } from "@/context/repositories/PageRepository";
import { PageVisitRepository } from "@/context/repositories/PageVisitRepository";
import type { Page } from "@/context/models/Page";
import type { PageVisit } from "@/context/models/PageVisit";

export interface ContextTimelineItem {
  visit: PageVisit;
  page:  Page | null;
}

export interface ContextTimelineGroup {
  date:   string;
  visits: ContextTimelineItem[];
}

/**
 * Build a map of pageId -> Page for fast lookup.
 */
async function buildPageMap(
  pages: Page[],
): Map<string, Page> {
  const map = new Map<string, Page>();
  for (const p of pages) {
    map.set(p.id, p);
  }
  return map;
}

export const ContextQueryService = {
  /**
   * Recent pages visited in a workspace, deduplicated.
   * Most recent visit first.
   */
  async getRecentPages(workspaceId: string, limit = 20): Promise<Page[]> {
    return PageRepository.recentInWorkspace(workspaceId, limit);
  },

  /**
   * All pages associated with a workspace via at least one visit.
   */
  async getWorkspacePages(workspaceId: string): Promise<Page[]> {
    return PageRepository.inWorkspace(workspaceId);
  },

  /**
   * All visits for a specific page.
   */
  async getPageVisits(pageId: string): Promise<PageVisit[]> {
    return PageVisitRepository.forPage(pageId);
  },

  /**
   * Build a context timeline for a workspace.
   * Groups visits by date, most recent first.
   * Each visit is paired with its Page for display.
   */
  async getWorkspaceTimeline(
    workspaceId: string,
    limit = 200,
  ): Promise<ContextTimelineGroup[]> {
    const visits = await PageVisitRepository.forWorkspace(workspaceId, limit);
    const pages  = await PageRepository.inWorkspace(workspaceId);
    const pageMap = await buildPageMap(pages);

    const groups = new Map<string, ContextTimelineItem[]>();

    for (const visit of visits) {
      const date = visit.visitedAt.split("T")[0] ?? visit.visitedAt.split(" ")[0] ?? "Unknown";
      const page = pageMap.get(visit.pageId) ?? null;

      if (!groups.has(date)) {
        groups.set(date, []);
      }
      groups.get(date)!.push({ visit, page });
    }

    const result: ContextTimelineGroup[] = [];
    for (const [date, items] of groups) {
      result.push({ date, visits: items });
    }

    // Sort groups by date descending (most recent first)
    result.sort((a, b) => b.date.localeCompare(a.date));

    return result;
  },

  /**
   * Lexical search across pages.
   * Optional workspace filter.
   * Ranking: exact title > title contains > hostname > url > description.
   */
  async searchPages(
    query: string,
    workspaceId?: string,
    limit = 30,
  ): Promise<Page[]> {
    return PageRepository.search(query, workspaceId, limit);
  },
};