import { useEffect } from "react";
import { register, isRegistered, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { logger } from "@/services/logger/logger";

const SHORTCUTS = [
  "CmdOrCtrl+T",
  "CmdOrCtrl+W",
  "CmdOrCtrl+L",
  "CmdOrCtrl+R",
  "F5",
  "Alt+Left",
  "Alt+Right",
] as const;

const ORBIT_SHORTCUT_EVENT = "orbit:shortcut";

export function useKeyboardShortcuts(): void {
  // Handle shortcut actions inside React event loop
  useEffect(() => {
    const handler = (e: Event): void => {
      const shortcut = (e as CustomEvent<string>).detail;
      const store = useTabStore.getState();

      switch (shortcut) {
        case "CmdOrCtrl+T":
          store.addTab();
          logger.info("[Shortcut] Ctrl+T - New tab").catch(console.warn);
          break;

        case "CmdOrCtrl+W":
          store.closeTab(store.activeTabId);
          logger.info("[Shortcut] Ctrl+W - Close tab").catch(console.warn);
          break;

        case "CmdOrCtrl+L": {
          const bar = document.querySelector<HTMLInputElement>(
            "input[aria-label='Address bar']"
          );
          if (bar) { bar.focus(); bar.select(); }
          logger.info("[Shortcut] Ctrl+L - Address bar").catch(console.warn);
          break;
        }

        case "CmdOrCtrl+R":
        case "F5":
          browserFacade.reload().catch(console.warn);
          logger.info("[Shortcut] Reload").catch(console.warn);
          break;

        case "Alt+Left":
          browserFacade.back().catch(console.warn);
          logger.info("[Shortcut] Back").catch(console.warn);
          break;

        case "Alt+Right":
          browserFacade.forward().catch(console.warn);
          logger.info("[Shortcut] Forward").catch(console.warn);
          break;
      }
    };

    window.addEventListener(ORBIT_SHORTCUT_EVENT, handler);
    return () => window.removeEventListener(ORBIT_SHORTCUT_EVENT, handler);
  }, []);

  // Register global shortcuts — dispatch into browser event loop
  useEffect(() => {
    const setup = async (): Promise<void> => {
      for (const shortcut of SHORTCUTS) {
        try {
          const already = await isRegistered(shortcut);
          if (already) continue;

          await register(shortcut, (event) => {
            if (event.state === "Pressed") {
              // Push back into browser event loop via CustomEvent
              window.dispatchEvent(
                new CustomEvent(ORBIT_SHORTCUT_EVENT, { detail: shortcut })
              );
            }
          });
        } catch {
          // Already registered — safe to ignore
        }
      }
    };

    setup();

    return () => {
      unregisterAll().catch(() => {});
    };
  }, []);

  // Escape via DOM
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