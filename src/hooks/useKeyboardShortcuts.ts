/**
 * useKeyboardShortcuts.ts
 * Orbit Keyboard Shortcuts
 *
 * Sprint 3: Uses BOTH native Tauri menu accelerators AND DOM listeners.
 *
 * Native accelerators handle shortcuts even when focus is inside
 * a child webview (where DOM events do not bubble to the shell).
 *
 * DOM listeners provide a fallback and handle shortcuts that
 * are not registered as menu accelerators (e.g., Escape).
 */

import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { logger } from "@/services/logger/logger";

export function useKeyboardShortcuts(): void {
  const { addTab, closeTab, activeTabId } = useTabStore();

  // ── Native shortcut listener (works inside child webviews) ──
  useEffect(() => {
    const unlisten = listen<string>("orbit-shortcut", (event) => {
      const id = event.payload;

      switch (id) {
        case "new_tab":
          addTab();
          logger.info("[Native] Ctrl+T - New tab").catch(console.warn);
          break;

        case "close_tab":
          closeTab(activeTabId);
          logger.info("[Native] Ctrl+W - Close tab").catch(console.warn);
          break;

        case "focus_address": {
          const bar = document.querySelector<HTMLInputElement>(
            "input[aria-label='Address bar']"
          );
          if (bar) {
            bar.focus();
            bar.select();
          }
          logger.info("[Native] Ctrl+L - Address bar").catch(console.warn);
          break;
        }

        case "reload_page":
        case "reload_f5":
          browserFacade.reload().catch(console.warn);
          logger.info("[Native] Reload").catch(console.warn);
          break;

        case "nav_back":
          browserFacade.back().catch(console.warn);
          logger.info("[Native] Alt+Left - Back").catch(console.warn);
          break;

        case "nav_forward":
          browserFacade.forward().catch(console.warn);
          logger.info("[Native] Alt+Right - Forward").catch(console.warn);
          break;
      }
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [addTab, closeTab, activeTabId]);

  // ── DOM listener (fallback for non-accelerator keys) ────────
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      // Escape — stop loading
      if (e.key === "Escape") {
        browserFacade.stop().catch(console.warn);
      }
    };

    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);
}