import { Search, Clock, Star, Zap } from "lucide-react";

const QUICK_SHORTCUTS = [
  { label: "GitHub",   url: "github.com",   color: "var(--color-text-secondary)" },
  { label: "Notion",   url: "notion.so",    color: "var(--color-text-secondary)" },
  { label: "Linear",   url: "linear.app",   color: "var(--color-primary)" },
  { label: "Figma",    url: "figma.com",    color: "var(--color-purple)" },
] as const;

export function HomePage(): React.JSX.Element {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 py-12 animate-fade-in">

      {/* Logo + greeting */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <div className="flex items-center justify-center w-14 h-14">
          <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
            <circle cx="28" cy="28" r="8" fill="var(--color-primary)" />
            <ellipse cx="28" cy="28" rx="26" ry="12"
              stroke="var(--color-primary)" strokeWidth="1.5" fill="none" opacity="0.7" />
            <ellipse cx="28" cy="28" rx="26" ry="12"
              stroke="var(--color-purple)" strokeWidth="1.5" fill="none" opacity="0.5"
              transform="rotate(60 28 28)" />
            <ellipse cx="28" cy="28" rx="26" ry="12"
              stroke="var(--color-purple)" strokeWidth="1.5" fill="none" opacity="0.5"
              transform="rotate(-60 28 28)" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="text-[var(--text-2xl)] font-[var(--weight-semibold)] text-[var(--text)] leading-tight">
            Good to see you.
          </h1>
          <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-1">
            Where would you like to go?
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="w-full max-w-xl mb-10">
        <div className={[
          "flex items-center gap-3",
          "h-12 px-4",
          "bg-[var(--surface)] border border-[var(--border)]",
          "rounded-[var(--radius-lg)]",
          "hover:border-[var(--accent)]",
          "focus-within:border-[var(--accent)]",
          "shadow-[var(--shadow-sm)]",
          "transition-all duration-[var(--duration-normal)]",
        ].join(" ")}>
          <Search size={16} strokeWidth={2} className="text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search or enter URL..."
            autoFocus
            className={[
              "flex-1 bg-transparent border-none outline-none",
              "text-[var(--text-md)] text-[var(--text)]",
              "placeholder:text-[var(--text-muted)]",
              "caret-[var(--accent)]",
            ].join(" ")}
            aria-label="Home search"
          />
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="w-full max-w-xl mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={13} strokeWidth={2} className="text-[var(--text-muted)]" />
          <span className="text-[var(--text-xs)] font-[var(--weight-medium)] text-[var(--text-muted)] uppercase tracking-wider">
            Quick Access
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_SHORTCUTS.map((s) => (
            <button
              key={s.url}
              aria-label={`Open ${s.label}`}
              className={[
                "orbit-card flex flex-col items-center gap-2 py-4",
                "hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]",
                "cursor-pointer orbit-focus-ring orbit-no-select",
                "transition-all duration-[var(--duration-normal)]",
              ].join(" ")}
            >
              <div
                className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--text-sm)] font-[var(--weight-bold)]"
                style={{ background: "var(--elevated)", color: s.color }}
              >
                {s.label[0]}
              </div>
              <span className="text-[var(--text-xs)] text-[var(--text-secondary)] orbit-truncate w-full text-center">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent placeholder */}
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={13} strokeWidth={2} className="text-[var(--text-muted)]" />
          <span className="text-[var(--text-xs)] font-[var(--weight-medium)] text-[var(--text-muted)] uppercase tracking-wider">
            Recent
          </span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Star size={13} strokeWidth={2} className="text-[var(--text-muted)]" />
          <span className="text-[var(--text-xs)] font-[var(--weight-medium)] text-[var(--text-muted)] uppercase tracking-wider">
            Bookmarks
          </span>
        </div>
        <div className="orbit-panel p-6 flex items-center justify-center">
          <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
            Your recent pages will appear here.
          </p>
        </div>
      </div>

    </div>
  );
}