import { WindowControls } from "./WindowControls";

export function TitleBar(): React.JSX.Element {
  return (
    <div
      className={[
        "flex items-center justify-between",
        "h-[var(--titlebar-height)] min-h-[var(--titlebar-height)]",
        "bg-[var(--surface)] border-b border-[var(--border)]",
        "orbit-drag orbit-no-select",
        "select-none",
      ].join(" ")}
    >
      {/* Left â€” Orbit branding */}
      <div className="flex items-center gap-2 px-4 orbit-no-drag">
        <div className="flex items-center justify-center w-5 h-5">
          <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
            <circle cx="10" cy="10" r="3" fill="var(--color-primary)" />
            <ellipse cx="10" cy="10" rx="9" ry="4.5"
              stroke="var(--color-primary)" strokeWidth="1.2" fill="none" opacity="0.7" />
            <ellipse cx="10" cy="10" rx="9" ry="4.5"
              stroke="var(--color-purple)" strokeWidth="1.2" fill="none" opacity="0.5"
              transform="rotate(60 10 10)" />
            <ellipse cx="10" cy="10" rx="9" ry="4.5"
              stroke="var(--color-purple)" strokeWidth="1.2" fill="none" opacity="0.5"
              transform="rotate(-60 10 10)" />
          </svg>
        </div>
        <span className="text-[var(--text-sm)] font-[var(--weight-semibold)] text-[var(--text)]">
          Orbit
        </span>
      </div>

      {/* Center â€” drag region */}
      <div className="flex-1 h-full orbit-drag" />

      {/* Right â€” window controls */}
      <WindowControls />
    </div>
  );
}