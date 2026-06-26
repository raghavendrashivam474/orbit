import { useEffect } from "react";
import { register, isRegistered, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { useTabStore } from "@/store/tabStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { WebviewSync } from "@/browser/WebviewSync";

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
      const tabStore = useTabStore.getState();
      const wsStore  = useWorkspaceStore.getState();

      switch (shortcut) {
        case "CmdOrCtrl+T": {
          const ws = wsStore.activeWorkspaceId;
          if (ws) {
            tabStore.addTab(ws);
            window.dispatchEvent(new CustomEvent("orbit:navigate-home"));
          }
          break;
        }
        case "CmdOrCtrl+W": {
          const activeId = tabStore.activeTabId;
          if (activeId) {
            WebviewSync.destroyWebview(activeId).catch(() => {});
            tabStore.closeTab(activeId);
          }
          break;
        }
        case "CmdOrCtrl+L": {
          const bar = document.querySelector<HTMLInputElement>(
            "input[aria-label='Address bar']"
          );
          if (bar) { bar.focus(); bar.select(); }
          break;
        }
        case "CmdOrCtrl+R":
        case "F5":
          WebviewSync.reload().catch(() => {});
          break;
        case "Alt+Left":
          WebviewSync.back().catch(() => {});
          break;
        case "Alt+Right":
          WebviewSync.forward().catch(() => {});
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
        } catch {}
      }
    };
    setup();
    return () => { unregisterAll().catch(() => {}); };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") WebviewSync.stop().catch(() => {});
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);
}