/**
 * LayoutManager.ts
 * Orbit Layout System - Bounds Computation
 *
 * Single source of truth for content area geometry.
 * All consumers call getContentBounds() to learn
 * where the browser content area is located.
 *
 * The renderer receives only the resulting rectangle.
 * It is unaware of why the bounds are what they are.
 */

import type { ContentBounds, LayoutState } from "./LayoutTypes";
import { CONTENT_Y_OFFSET } from "./LayoutConstants";

export class LayoutManager {
  /**
   * Compute the content area bounds from the current layout state.
   *
   * @example
   *   LayoutManager.getContentBounds({
   *     windowWidth:    1280,
   *     windowHeight:   800,
   *     sidebarWidth:   220,
   *     titlebarHeight: 40,
   *     tabbarHeight:   40,
   *     toolbarHeight:  48,
   *   })
   *   // => { x: 220, y: 128, width: 1060, height: 672 }
   */
  static getContentBounds(state: LayoutState): ContentBounds {
    const x      = state.sidebarWidth;
    const y      = CONTENT_Y_OFFSET;
    const width  = Math.max(0, state.windowWidth - state.sidebarWidth);
    const height = Math.max(0, state.windowHeight - CONTENT_Y_OFFSET);

    return { x, y, width, height };
  }

  /**
   * Returns true if two ContentBounds rectangles are equal.
   * Used to avoid unnecessary renderer resize calls.
   */
  static boundsEqual(a: ContentBounds, b: ContentBounds): boolean {
    return (
      a.x === b.x &&
      a.y === b.y &&
      a.width === b.width &&
      a.height === b.height
    );
  }
}