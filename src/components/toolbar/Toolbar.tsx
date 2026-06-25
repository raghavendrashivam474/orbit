import { NavControls } from "./NavControls";
import { AddressBar } from "./AddressBar";
import { Sun, Moon } from "lucide-react";
import { IconButton } from "@/components/common/IconButton";
import { Tooltip } from "@/components/common/Tooltip";
import { useThemeStore } from "@/store/themeStore";

export function Toolbar(): React.JSX.Element {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = (): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className={[
        "flex items-center gap-2 px-3",
        "h-[var(--toolbar-height)] min-h-[var(--toolbar-height)]",
        "bg-[var(--surface)] border-b border-[var(--border)]",
        "orbit-drag",
      ].join(" ")}
    >
      <NavControls />

      <div className="orbit-divider-vertical h-5" />

      <AddressBar />

      <div className="orbit-divider-vertical h-5" />

      <Tooltip content="Toggle theme" side="bottom">
        <IconButton
          label="Toggle theme"
          onClick={toggleTheme}
          size="md"
        >
          {theme === "dark" ? (
            <Sun size={15} strokeWidth={2} />
          ) : (
            <Moon size={15} strokeWidth={2} />
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
}