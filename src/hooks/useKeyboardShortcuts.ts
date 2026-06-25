/**
 * useKeyboardShortcuts.ts
 * Orbit Keyboard Shortcuts
 *
 * Sprint 3: Navigation shortcuts fully functional.
 */

import { useEffect } from "react";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { logger } from "@/services/logger/logger";

export function useKeyboardShortcuts(): void {
  const { addTab, closeTab, activeTabId } = useTabStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      const ctrl = e.ctrlKey || e.metaKey;
      const alt  = e.altKey;

      // Ctrl+T - New tab
      if (ctrl && !e.shiftKey && e.key === "t") {
        e.preventDefault();
        addTab();
        logger.info("[Shortcut] Ctrl+T - New tab").catch(console.warn);
      }

      // Ctrl+W - Close tab
      if (ctrl && e.key === "w") {
        e.preventDefault();
        closeTab(activeTabId);
        logger.info("[Shortcut] Ctrl+W - Close tab").catch(console.warn);
      }

      // Ctrl+L - Focus address bar
      if (ctrl && e.key === "l") {
        e.preventDefault();
        const bar = document.querySelector<HTMLInputElement>(
          "input[aria-label='Address bar']"
        );
        if (bar) { bar.focus(); bar.select(); }
        logger.info("[Shortcut] Ctrl+L - Address bar").catch(console.warn);
      }

      // F5 or Ctrl+R - Reload
      if (e.key === "F5" || (ctrl && e.key === "r")) {
        e.preventDefault();
        browserFacade.reload().catch(console.warn);
        logger.info("[Shortcut] Reload").catch(console.warn);
      }

      // Alt+Left - Back
      if (alt && e.key === "ArrowLeft") {
        e.preventDefault();
        browserFacade.back().catch(console.warn);
        logger.info("[Shortcut] Alt+Left - Back").catch(console.warn);
      }

      // Alt+Right - Forward
      if (alt && e.key === "ArrowRight") {
        e.preventDefault();
        browserFacade.forward().catch(console.warn);
        logger.info("[Shortcut] Alt+Right - Forward").catch(console.warn);
      }

      // Escape - Stop loading
      if (e.key === "Escape") {
        browserFacade.stop().catch(console.warn);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [addTab, closeTab, activeTabId]);
}