import { create } from "zustand";

export type Theme = "dark" | "light" | "system";

interface ThemeState {
  theme:    Theme;
  resolved: "dark" | "light";
  setTheme: (theme: Theme) => void;
}

function resolveTheme(theme: Theme): "dark" | "light" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem("orbit-theme");
    if (stored === "dark" || stored === "light" || stored === "system") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return "dark";
}

const initialTheme = loadTheme();

export const useThemeStore = create<ThemeState>()((set) => ({
  theme:    initialTheme,
  resolved: resolveTheme(initialTheme),

  setTheme: (theme: Theme): void => {
    try {
      localStorage.setItem("orbit-theme", theme);
    } catch {
      // localStorage unavailable
    }
    set({ theme, resolved: resolveTheme(theme) });
  },
}));