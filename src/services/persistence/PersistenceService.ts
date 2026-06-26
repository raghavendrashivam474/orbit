/**
 * PersistenceService.ts
 * Orbit Frontend Persistence Coordinator
 *
 * Listens to browser events and records them to persistence.
 * BrowserFacade emits events. This service listens and acts.
 * No direct coupling between BrowserFacade and repositories.
 *
 * Sprint 4 Architecture:
 *
 *   BrowserFacade
 *       â†“ events
 *   PersistenceService
 *       â†“
 *   Repositories
 *       â†“ IPC
 *   Rust PersistenceService
 *       â†“
 *   SQLite
 */

import { browserFacade } from "@/browser/BrowserFacade";
import { useHistoryStore } from "@/store/historyStore";

class PersistenceServiceClass {
  private unsubscribers: Array<() => void> = [];
  private initialized = false;

  /**
   * Start listening to browser events.
   * Call once on application startup.
   */
  start(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Listen for completed navigations and record to history
    const unsubTitle = browserFacade.on("title:update", (event) => {
      const state = browserFacade.getSessionState(event.tabId);
      if (!state?.url) return;
      if (state.url === "about:blank") return;

      useHistoryStore
        .getState()
        .record(state.url, event.title)
        .catch(console.warn);
    });

    this.unsubscribers.push(unsubTitle);
    console.warn("[PersistenceService] Started.");
  }

  /** Stop listening to browser events. */
  stop(): void {
    this.unsubscribers.forEach((fn) => fn());
    this.unsubscribers = [];
    this.initialized = false;
  }
}

export const PersistenceService = new PersistenceServiceClass();