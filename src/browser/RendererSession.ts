/**
 * RendererSession.ts
 * Orbit Browser Layer - Tab to Renderer Mapping
 *
 * A RendererSession represents the relationship between
 * a Tab and the renderer resources it may currently hold.
 *
 * Sprint 3: One active renderer shared across all tabs.
 * Future: One RendererSession per tab with dedicated renderer.
 *
 * See ADR-0003 for the ownership model.
 */

import type { TabBrowserState } from "./BrowserTypes";
import { createTabBrowserState } from "./BrowserTypes";

export interface RendererSession {
  /** The tab this session belongs to. */
  tabId: string;

  /**
   * Whether this session currently holds an active renderer.
   * Sprint 3: Only one session is active at a time.
   */
  isActive: boolean;

  /**
   * Cached browser state for this tab.
   * Preserved when the tab is inactive.
   * Represents the last known state of this tab.
   */
  state: TabBrowserState;
}

/** Create a new renderer session for a tab. */
export function createRendererSession(
  tabId: string,
  initialUrl = "",
): RendererSession {
  return {
    tabId,
    isActive: false,
    state:    createTabBrowserState(initialUrl),
  };
}