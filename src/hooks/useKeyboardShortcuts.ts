import { useEffect } from "react";
import { register, isRegistered, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { browserFacade } from "@/browser/BrowserFacade";

const SHORTCUTS = [
  "CmdOrCtrl+T",
  "CmdOrCtrl+W",
  "CmdOrCtrl+L",
  "CmdOrCtrl+R",
  "CmdOrCtrl+K",
  "F5",
  "Alt+Left",
  "Alt+Right",
] as const;

const ORBIT_SHORTCUT_EVENT = "orbit:shortcut";

export function useKeyboardShortcuts(): void {
  useEffect(() => {
    const handler = (e: Event): void => {
      const shortcut = (e as CustomEvent<string>).detail;
      const { useTabStore } = require("@/store/tabStore");
      const store = useTabStore.getState();

      switch (shortcut) {
        case "CmdOrCtrl+T":
        case "new_tab":
          store.addTab();
          break;
        case "CmdOrCtrl+W":
        case "close_tab":
          store.closeTab(store.activeTabId);
          break;
        case "CmdOrCtrl+L":
        case "focus_address": {
          const bar = document.querySelector<HTMLInputElement>(
            "input[aria-label='Address bar']"
          );
          if (bar) { bar.focus(); bar.select(); }
          break;
        }
        case "CmdOrCtrl+R":
        case "reload_page":
        case "F5":
          browserFacade.reload().catch(console.warn);
          break;
        case "Alt+Left":
          browserFacade.back().catch(console.warn);
          break;
        case "Alt+Right":
          browserFacade.forward().catch(console.warn);
          break;
        case "CmdOrCtrl+K":
        case "command_palette":
          // Handled in ShellLayout via the same event
          break;
      }
    };

    window.addEventListener(ORBIT_SHORTCUT_EVENT, handler);
    return () => window.removeEventListener(ORBIT_SHORTCUT_EVENT, handler);
  }, []);

  useEffect(() => {
    const setup = async (): Promise<void> => {
      for (const shortcut of SHORTCUTS) {
        try {
          const already = await isRegistered(shortcut);
          if (already) continue;
          await register(shortcut, (event) => {
            if (event.state === "Pressed") {
              window.dispatchEvent(
                new CustomEvent(ORBIT_SHORTCUT_EVENT, { detail: shortcut })
              );
            }
          });
        } catch {
          // Already registered
        }
      }
    };
    setup();
    return () => { unregisterAll().catch(() => {}); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") browserFacade.stop().catch(console.warn);
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);
}