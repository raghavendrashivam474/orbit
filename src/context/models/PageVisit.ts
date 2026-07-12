/**
 * PageVisit.ts
 * Sprint 6 — A workspace-scoped act of visiting a Page.
 *
 * PageVisit is where workspace context lives. Page itself is global.
 */

export type NavigationSource =
  | "address_bar"
  | "shortcut"
  | "history"
  | "bookmark"
  | "restored"
  | "unknown";

export interface PageVisit {
  id:           string;
  pageId:       string;
  workspaceId:  string;
  tabId:        string | null;
  visitedAt:    string;
  source:       NavigationSource;
}