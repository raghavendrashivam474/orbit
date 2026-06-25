import { useEffect } from "react";
import { useTabStore } from "@/store/tabStore";
import { logger } from "@/services/logger/logger";

/**
 * useKeyboardShortcuts
 * Registers global keyboard shortcuts.
 * Sprint 2: Foundation only. No browser actions yet.
 */
export function useKeyboardShortcuts(): void {
  const { addTab, closeTab, activeTabId } = useTabStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      const ctrl = e.ctrlKey || e.metaKey;

      // Ctrl+T — New tab
      if (ctrl && e.key === "t") {
        e.preventDefault();
        addTab();
        logger.info("[Shortcut] Ctrl+T - New tab").catch(console.warn);
      }

      // Ctrl+W — Close tab
      if (ctrl && e.key === "w") {
        e.preventDefault();
        closeTab(activeTabId);
        logger.info("[Shortcut] Ctrl+W - Close tab").catch(console.warn);
      }

      // Ctrl+L — Focus address bar
      if (ctrl && e.key === "l") {
        e.preventDefault();
        const addressBar = document.querySelector<HTMLInputElement>(
          "input[aria-label='Address bar']"
        );
        if (addressBar) {
          addressBar.focus();
          addressBar.select();
        }
        logger.info("[Shortcut] Ctrl+L - Address bar focused").catch(console.warn);
      }

      // Ctrl+Shift+T — Placeholder
      if (ctrl && e.shiftKey && e.key === "T") {
        e.preventDefault();
        logger.info("[Shortcut] Ctrl+Shift+T - Restore tab (not yet implemented)").catch(console.warn);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [addTab, closeTab, activeTabId]);
}