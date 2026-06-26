/**
 * settingsStore.ts
 * Orbit Settings Store - Persistent
 *
 * Replaces the Sprint 2 themeStore.
 * All settings now persist to SQLite.
 */

import { create } from "zustand";
import { SettingsRepository } from "@/repositories/SettingsRepository";

export type Theme = "dark" | "light" | "system";

interface SettingsState {
  theme:           Theme;
  sidebarCollapsed:boolean;
  restoreSession:  boolean;
  initialized:     boolean;

  initialize:          ()              => Promise<void>;
  setTheme:            (t: Theme)      => Promise<void>;
  setSidebarCollapsed: (v: boolean)    => Promise<void>;
  setRestoreSession:   (v: boolean)    => Promise<void>;
}

function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark" : "light";
  }
  return theme;
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", resolveTheme(theme));
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  theme:            "dark",
  sidebarCollapsed: false,
  restoreSession:   true,
  initialized:      false,

  initialize: async (): Promise<void> => {
    try {
      const all = await SettingsRepository.all();
      const map = Object.fromEntries(all);

      const theme = (JSON.parse(map["theme"] ?? '"dark"') as Theme) ?? "dark";
      const sidebarCollapsed = JSON.parse(map["sidebar_collapsed"] ?? "false") as boolean;
      const restoreSession   = JSON.parse(map["restore_session"]   ?? "true")  as boolean;

      set({ theme, sidebarCollapsed, restoreSession, initialized: true });
      applyTheme(theme);
    } catch {
      set({ initialized: true });
      applyTheme(get().theme);
    }
  },

  setTheme: async (theme: Theme): Promise<void> => {
    set({ theme });
    applyTheme(theme);
    await SettingsRepository.set("theme", JSON.stringify(theme)).catch(console.warn);
  },

  setSidebarCollapsed: async (value: boolean): Promise<void> => {
    set({ sidebarCollapsed: value });
    await SettingsRepository.set("sidebar_collapsed", JSON.stringify(value)).catch(console.warn);
  },

  setRestoreSession: async (value: boolean): Promise<void> => {
    set({ restoreSession: value });
    await SettingsRepository.set("restore_session", JSON.stringify(value)).catch(console.warn);
  },
}));