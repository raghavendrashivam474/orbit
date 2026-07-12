/**
 * ContextCaptureService.ts
 * Sprint 6 — Converts browser navigation into structured Context.
 *
 * Architecture:
 *   NavigationObserver → ContextCaptureService → PageVisitRepository
 *                                              → PageRepository
 *
 * Rules (see ADR-0010):
 *   - Observer only. Never controls navigation.
 *   - Must not block browser navigation.
 *   - Failures are logged, never thrown.
 *   - Uses existing NavigationObserver contract — no new event bus.
 */

import { WebviewSync } from "@/browser/WebviewSync";
import type {
  NavigationObserver,
  NavigationEvent,
} from "@/browser/NavigationObserver";
import { PageVisitRepository } from "@/context/repositories/PageVisitRepository";
import { normalizeUrl, extractHostname } from "@/context/url/normalizeUrl";
import type { NavigationSource } from "@/context/models/PageVisit";

/**
 * Should this URL be excluded from context capture?
 * Blank, about:, data:, javascript: URLs are internal-only and
 * should not create Pages.
 */
function shouldSkip(url: string): boolean {
  if (!url) return true;
  if (url === "about:blank") return true;
  if (url.startsWith("about:")) return true;
  if (url.startsWith("data:")) return true;
  if (url.startsWith("javascript:")) return true;
  if (url.startsWith("chrome:")) return true;
  return false;
}

class ContextCaptureServiceClass implements NavigationObserver {
  private unsubscribe: (() => void) | null = null;
  private started = false;

  start(): void {
    if (this.started) return;
    this.started = true;
    this.unsubscribe = WebviewSync.subscribe(this);
    console.info("[ContextCapture] Started, subscribed to WebviewSync.");
  }

  stop(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
    this.started = false;
  }

  /**
   * NavigationObserver implementation.
   * Fires for every successful navigation.
   */
  onNavigate(event: NavigationEvent): void {
    if (shouldSkip(event.url)) return;

    // Sprint 6 has no navigation source metadata yet — always "unknown".
    // Future sprints may plumb source through NavigationObserver.
    const source: NavigationSource = "unknown";

    const normalized = normalizeUrl(event.url);
    const hostname   = extractHostname(event.url);

    // Fire-and-forget. Never block navigation.
    PageVisitRepository.record({
      url:           event.url,
      normalizedUrl: normalized,
      title:         event.title,
      hostname,
      workspaceId:   event.workspaceId,
      tabId:         event.tabId,
      source,
    })
      .then((pageId) => {
        console.info(
          `[ContextCapture] Visit recorded page=${pageId.slice(0, 12)} url=${event.url}`
        );
      })
      .catch((err) => {
        // Non-fatal. Context capture failure must not affect browsing.
        console.warn("[ContextCapture] record failed:", err);
      });
  }
}

export const ContextCaptureService = new ContextCaptureServiceClass();