/**
 * LayoutConstants.ts
 * Orbit Layout System - Fixed Dimensions
 *
 * These values must match the CSS design tokens exactly.
 * Source of truth: src/styles/tokens.css
 *
 * If a token changes in CSS, update it here too.
 */

export const LAYOUT = {
  TITLEBAR_HEIGHT:   40,
  TABBAR_HEIGHT:     40,
  TOOLBAR_HEIGHT:    48,
  SIDEBAR_EXPANDED:  220,
  SIDEBAR_COLLAPSED: 56,
} as const;

/** Total fixed vertical space above the content area. */
export const CONTENT_Y_OFFSET =
  LAYOUT.TITLEBAR_HEIGHT +
  LAYOUT.TABBAR_HEIGHT +
  LAYOUT.TOOLBAR_HEIGHT;