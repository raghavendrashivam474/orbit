/**
 * useKeyboardShortcuts.ts
 * Orbit Keyboard Shortcuts
 *
 * Sprint 3: Uses Tauri global shortcut plugin.
 * Global shortcuts work regardless of which webview has focus.
 */

import { useEffect } from "react";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { logger } from "@/services/logger/logger";

export function useKeyboardShortcuts(): void {
  const { addTab, closeTab, activeTabId } = useTabStore();

  useEffect(() => {
    let mounted = true;

    const setup = async (): Promise<void> => {
      try {
        // Unregister any previous shortcuts first
        await unregisterAll();

        // Ctrl+T — New tab
        await register("CmdOrCtrl+T", (event) => {
          if (event.state === "Pressed" && mounted) {
            addTab();
            logger.info("[Shortcut] Ctrl+T - New tab").catch(console.warn);
          }
        });

        // Ctrl+W — Close tab
        await register("CmdOrCtrl+W", (event) => {
          if (event.state === "Pressed" && mounted) {
            closeTab(useTabStore.getState().activeTabId);
            logger.info("[Shortcut] Ctrl+W - Close tab").catch(console.warn);
          }
        });

        // Ctrl+L — Focus address bar
        await register("CmdOrCtrl+L", (event) => {
          if (event.state === "Pressed" && mounted) {
            const bar = document.querySelector<HTMLInputElement>(
              "input[aria-label='Address bar']"
            );
            if (bar) {
              bar.focus();
              bar.select();
            }
            logger.info("[Shortcut] Ctrl+L - Address bar").catch(console.warn);
          }
        });

        // Ctrl+R — Reload
        await register("CmdOrCtrl+R", (event) => {
          if (event.state === "Pressed" && mounted) {
            browserFacade.reload().catch(console.warn);
            logger.info("[Shortcut] Ctrl+R - Reload").catch(console.warn);
          }
        });

        // F5 — Reload
        await register("F5", (event) => {
          if (event.state === "Pressed" && mounted) {
            browserFacade.reload().catch(console.warn);
            logger.info("[Shortcut] F5 - Reload").catch(console.warn);
          }
        });

        // Alt+Left — Back
        await register("Alt+Left", (event) => {
          if (event.state === "Pressed" && mounted) {
            browserFacade.back().catch(console.warn);
            logger.info("[Shortcut] Alt+Left - Back").catch(console.warn);
          }
        });

        // Alt+Right — Forward
        await register("Alt+Right", (event) => {
          if (event.state === "Pressed" && mounted) {
            browserFacade.forward().catch(console.warn);
            logger.info("[Shortcut] Alt+Right - Forward").catch(console.warn);
          }
        });

        console.warn("[Shortcuts] All global shortcuts registered.");
      } catch (err) {
        console.warn("[Shortcuts] Registration failed:", err);
      }
    };

    setup();

    return () => {
      mounted = false;
      unregisterAll().catch(console.warn);
    };
  }, [addTab, closeTab, activeTabId]);

  // Escape — DOM only (not a global shortcut)
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        browserFacade.stop().catch(console.warn);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);
}