/**
 * RendererInterface.ts
 * Orbit Browser Layer - Renderer Contract
 *
 * Every rendering engine must implement this interface.
 * Updated in Sprint 3 to include bounds management.
 *
 * The renderer receives a ContentBounds rectangle.
 * It does not know why the bounds are what they are.
 */

import type { ContentBounds } from "@/layout/LayoutTypes";

export interface RendererInterface {
  /** Navigate to the given fully-resolved URL. */
  navigate(url: string): Promise<void>;

  /** Reload the current page. */
  reload(): Promise<void>;

  /** Stop the current page load. */
  stop(): Promise<void>;

  /** Navigate backward in history. */
  back(): Promise<void>;

  /** Navigate forward in history. */
  forward(): Promise<void>;

  /** Returns the current page title. */
  getTitle(): Promise<string>;

  /** Returns the current URL. */
  getUrl(): Promise<string>;

  /** Returns true if backward navigation is available. */
  canGoBack(): Promise<boolean>;

  /** Returns true if forward navigation is available. */
  canGoForward(): Promise<boolean>;

  /**
   * Update the renderer bounds.
   * Called whenever the content area rectangle changes.
   * The renderer does not know why the bounds changed.
   */
  updateBounds(bounds: ContentBounds): Promise<void>;

  /**
   * Show the renderer.
   * Called when switching to this tab.
   */
  show(): Promise<void>;

  /**
   * Hide the renderer.
   * Called when switching away from this tab.
   */
  hide(): Promise<void>;

  /**
   * Destroy the renderer and release all resources.
   * Called when a tab is permanently closed.
   */
  destroy(): Promise<void>;
}