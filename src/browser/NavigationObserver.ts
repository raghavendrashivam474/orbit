/**
 * NavigationObserver.ts
 *
 * Contract for observers that want to react to browser navigation events.
 * Implemented by PersistenceService, and in the future by AI Memory,
 * Timeline, Analytics, etc.
 *
 * WebviewSync is the producer. Consumers register via WebviewSync.subscribe().
 *
 * The contract is intentionally minimal:
 *   - onNavigate fires immediately when navigation begins
 *   - Future events (onTitleResolved, onLoadComplete) will be added when
 *     the underlying platform supports them cleanly
 *
 * See: Sprint 5.3 brief for rationale.
 */

export interface NavigationEvent {
  tabId:       string;
  workspaceId: string;
  url:         string;
  /**
   * A best-effort title. In Sprint 5.3 this is the URL hostname.
   * Real page titles will be resolved in Sprint 5.3B when child WebView
   * title APIs are investigated.
   */
  title:       string;
  /** ISO timestamp when navigation occurred. */
  at:          string;
}

export interface NavigationObserver {
  /**
   * Called immediately after a successful navigation begins.
   * Must not throw. Must not block â€” fire and forget.
   */
  onNavigate(event: NavigationEvent): void;
}

/**
 * Derive a best-effort title from a URL.
 * Used until real page titles can be resolved.
 */
export function deriveTitleFromUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "") || url;
  } catch {
    return url;
  }
}