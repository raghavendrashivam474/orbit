/**
 * PersistenceService.ts
 * Orbit Frontend Persistence Coordinator
 *
 * Sprint 5.3:
 * Subscribes to WebviewSync as a NavigationObserver.
 * When a navigation event fires, records a history entry.
 *
 * No direct coupling between WebviewSync and the persistence layer.
 * WebviewSync only emits navigation events; this service decides
 * what to persist.
 *
 * Architecture:
 *   WebviewSync
 *       |
 *       v  (NavigationObserver contract)
 *   PersistenceService
 *       |
 *       v
 *   useHistoryStore.record()
 *       |
 *       v
 *   HistoryRepository -> IPC -> Rust -> SQLite
 */

import { WebviewSync } from "@/browser/WebviewSync";
import type {
  NavigationEvent,
  NavigationObserver,
} from "@/browser/NavigationObserver";
import { useHistoryStore } from "@/store/historyStore";

class PersistenceServiceClass implements NavigationObserver {
  private unsubscribe: (() => void) | null = null;
  private initialized = false;

  /**
   * Start listening to navigation events.
   * Idempotent â€” safe to call multiple times.
   */
  start(): void {
    if (this.initialized) return;
    this.initialized = true;

    this.unsubscribe = WebviewSync.subscribe(this);
    console.warn("[PersistenceService] Subscribed to WebviewSync.");
  }

  /**
   * Stop listening.
   */
  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.initialized = false;
  }

  /**
   * NavigationObserver implementation.
   * Records the navigation to history.
   */
  onNavigate(event: NavigationEvent): void {
    // Skip internal/blank URLs
    if (!event.url) return;
    if (event.url === "about:blank") return;
    if (event.url.startsWith("data:")) return;
    if (event.url.startsWith("javascript:")) return;

    useHistoryStore
      .getState()
      .record(event.url, event.title)
      .catch((err) => {
        console.warn("[PersistenceService] history record failed", err);
      });
  }
}

export const PersistenceService = new PersistenceServiceClass();