/**
 * useContentBounds.ts
 * Orbit Layout Hook
 *
 * Computes and tracks the content area bounds reactively.
 * Re-computes whenever the window resizes or sidebar state changes.
 *
 * This is the single hook all layout-aware components use.
 * The renderer receives bounds from this hook via BrowserView.
 */

import { useState, useEffect, useCallback } from "react";
import type { ContentBounds } from "@/layout/LayoutTypes";
import { LayoutManager } from "@/layout/LayoutManager";
import { LAYOUT } from "@/layout/LayoutConstants";

interface UseContentBoundsOptions {
  /** Current sidebar width in logical pixels. */
  sidebarWidth: number;
}

export function useContentBounds(
  options: UseContentBoundsOptions,
): ContentBounds {
  const { sidebarWidth } = options;

  const compute = useCallback((): ContentBounds => {
    return LayoutManager.getContentBounds({
      windowWidth:    window.innerWidth,
      windowHeight:   window.innerHeight,
      sidebarWidth,
      titlebarHeight: LAYOUT.TITLEBAR_HEIGHT,
      tabbarHeight:   LAYOUT.TABBAR_HEIGHT,
      toolbarHeight:  LAYOUT.TOOLBAR_HEIGHT,
    });
  }, [sidebarWidth]);

  const [bounds, setBounds] = useState<ContentBounds>(compute);

  useEffect(() => {
    setBounds(compute());
  }, [compute]);

  useEffect(() => {
    let animFrame: number;

    const handleResize = (): void => {
      cancelAnimationFrame(animFrame);
      animFrame = requestAnimationFrame(() => {
        setBounds(compute());
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, [compute]);

  return bounds;
}