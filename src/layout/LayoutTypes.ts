/**
 * LayoutTypes.ts
 * Orbit Layout System - Type Definitions
 *
 * ContentBounds is the single type passed to the renderer.
 * The renderer never receives sidebar state, toolbar height,
 * or any shell-specific information. Only a rectangle.
 */

/**
 * A rectangle describing the available content area.
 * Passed to the renderer whenever the layout changes.
 * All values are in logical pixels.
 */
export interface ContentBounds {
  x:      number;
  y:      number;
  width:  number;
  height: number;
}

/**
 * Current state of all layout panels.
 * Used by LayoutManager to compute ContentBounds.
 */
export interface LayoutState {
  windowWidth:     number;
  windowHeight:    number;
  sidebarWidth:    number;
  titlebarHeight:  number;
  tabbarHeight:    number;
  toolbarHeight:   number;
}