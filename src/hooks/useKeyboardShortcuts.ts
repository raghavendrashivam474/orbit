import { useEffect } from "react";
import { useTabStore } from "@/store/tabStore";
import { logger } from "@/services/logger/logger";

/**
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
        logger.info("[Shortcut] Ctrl+T — New tab").catch(console.warn);
      }

      // Ctrl+W — Close tab
      if (ctrl && e.key === "w") {
        e.preventDefault();
        closeTab(activeTabId);
        logger.info("[Shortcut] Ctrl+W — Close tab").catch(console.warn);
      }

      // Ctrl+L — Focus address bar
      if (ctrl && e.key === "l") {
        e.preventDefault();
        const addressBar = document.querySelector<HTMLInputElement>(
          "input[aria-label=