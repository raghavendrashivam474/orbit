/**
 * useKeyboardShortcuts.ts
 * Orbit Keyboard Shortcuts
 *
 * Uses tauri-plugin-global-shortcut for shortcut delivery because
 * DOM keydown events do not bubble from child webviews to the shell.
 *
 * Known limitations on Windows with child webviews:
 *   - Ctrl+L, Alt+Left, Alt+Right, Ctrl+[, Ctrl+] cannot be reliably
 *     captured due to OS-level or webview-level interception.
 *   - Users can use the toolbar buttons and click the address bar
 *     with the mouse to achieve the same outcomes.
 *
 * Backlog: Sprint 6+ should investigate Windows raw input hooks or
 *          menu accelerators as an alternative delivery mechanism.
 */

import { useEffect } from "react";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { useTabStore } from "@/store/tabStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { WebviewSync } from "@/browser/WebviewSync";

// Only shortcuts that reliably work on Windows with child webviews.
const SHORTCUTS = [
  "CmdOrCtrl+T",
  "CmdOrCtrl+W",
  "CmdOrCtrl+R",
  "CmdOrCtrl+K",
  "F5",
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
        case "CmdOrCtrl+R":
        case "F5":
          WebviewSync.reload().catch(() => {});
          break;
      }
    };

    window.addEventListener(ORBIT_SHORTCUT_EVENT, handler);
    return () => window.removeEventListener(ORBIT_SHORTCUT_EVENT, handler);
  }, []);

  useEffect(() => {
    const setup = async (): Promise<void> => {
      // Clear any stale registrations from previous sessions
      await unregisterAll().catch(() => {});

      for (const shortcut of SHORTCUTS) {
        try {
          await register(shortcut, (event) => {
            if (event.state === "Pressed") {
              window.dispatchEvent(
                new CustomEvent(ORBIT_SHORTCUT_EVENT, { detail: shortcut })
              );
            }
          });
        } catch {
          // Silently skip if OS holds the shortcut. Toolbar buttons work.
        }
      }
    };
    setup();
    return () => { unregisterAll().catch(() => {}); };
  }, []);

  // Escape handled via DOM listener (only fires when inputs blur it correctly)
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") WebviewSync.stop().catch(() => {});
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, []);
}