import { useEffect } from "react";
import { useThemeStore } from "@/store/themeStore";

/**
 * Applies the current theme to the document root.
 * Must be called once at the shell level.
 */
export function useTheme(): void {
  const { resolved } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolved);
  }, [resolved]);

  // Listen for system theme changes
  useEffect(() => {
    const { theme, setTheme } = useThemeStore.getState();
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (): void => { setTheme("system"); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
}