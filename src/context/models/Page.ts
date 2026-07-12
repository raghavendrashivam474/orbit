/**
 * Page.ts
 * Sprint 6 — Global identity for a web resource.
 *
 * A Page is uniquely identified by its normalized URL.
 * The same page opened many times across many workspaces still
 * corresponds to ONE Page entity.
 *
 * See ADR-0009 for the identity model.
 */

export interface Page {
  id:             string;
  url:            string;
  normalizedUrl:  string;
  title:          string;
  hostname:       string;
  description:    string | null;
  faviconUrl:     string | null;
  firstSeenAt:    string;
  lastSeenAt:     string;
}