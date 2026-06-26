import { useState, useEffect } from "react";
import { Search, Clock, Star, Zap, Globe } from "lucide-react";
import { WebviewSync } from "@/browser/WebviewSync";
import { useHistoryStore } from "@/store/historyStore";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { resolveUrl } from "@/services/navigation/urlResolver";

const QUICK_SHORTCUTS = [
  { label: "GitHub", url: "github.com", color: "var(--color-text-secondary)" },
  { label: "Notion", url: "notion.so", color: "var(--color-text-secondary)" },
  { label: "Linear", url: "linear.app", color: "var(--color-primary)" },
  { label: "Figma", url: "figma.com", color: "var(--color-purple)" },
] as const;

function OrbitLogo({ size = 56 }: { size?: number }): React.JSX.Element {
  return (
    <svg viewBox="0 0 56 56" fill="none" width={size} height={size}>
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
  );
}

function formatHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function NewTabPage(): React.JSX.Element {
  const [query, setQuery] = useState("");
  const { entries: history, load: loadHistory } = useHistoryStore();
  const { bookmarks, load: loadBookmarks } = useBookmarkStore();

  useEffect(() => {
    loadHistory(6).catch(console.warn);
    loadBookmarks().catch(console.warn);
  }, [loadHistory, loadBookmarks]);

  const recent = history.slice(0, 6);
  const topBookmarks = bookmarks.slice(0, 6);

  const navigate = async (input: string): Promise<void> => {
    const resolved = resolveUrl(input).href;
    await WebviewSync.navigate(resolved);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const value = query.trim();
    if (!value) return;
    await navigate(value);
  };

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-12 animate-fade-in overflow-auto orbit-scrollbar">
      <div className="flex flex-col items-center gap-4 mb-8">
        <OrbitLogo />
        <div className="text-center">
          <h1 className="text-[var(--text-2xl)] font-[var(--weight-semibold)] text-[var(--text)] leading-tight">
            Good to see you.
          </h1>
          <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-1">
            Where would you like to go?
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
        <div className={[
          "flex items-center gap-3 h-12 px-4",
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or enter URL..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-[var(--text-md)] text-[var(--text)] placeholder:text-[var(--text-muted)] caret-[var(--accent)]"
            aria-label="Home search"
          />
        </div>
      </form>

      <div className="w-full max-w-2xl mb-8">
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
              onClick={() => navigate(s.url)}
              className="orbit-card flex flex-col items-center gap-2 py-4 hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)] cursor-pointer orbit-focus-ring orbit-no-select transition-all duration-[var(--duration-normal)]"
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

      <div className="w-full max-w-2xl grid grid-cols-2 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={13} strokeWidth={2} className="text-[var(--text-muted)]" />
            <span className="text-[var(--text-xs)] font-[var(--weight-medium)] text-[var(--text-muted)] uppercase tracking-wider">
              Recent
            </span>
          </div>
          <div className="orbit-panel p-2 space-y-0.5 min-h-[180px]">
            {recent.length === 0 ? (
              <div className="flex items-center justify-center h-full py-8">
                <p className="text-[var(--text-xs)] text-[var(--text-muted)] text-center px-2">
                  Your recent pages will appear here.
                </p>
              </div>
            ) : (
              recent.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => navigate(entry.url)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] text-left hover:bg-[var(--elevated)] transition-colors"
                >
                  <Globe size={12} strokeWidth={2} className="text-[var(--text-muted)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-xs)] text-[var(--text)] orbit-truncate">
                      {entry.title || formatHost(entry.url)}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] orbit-truncate">
                      {formatHost(entry.url)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star size={13} strokeWidth={2} className="text-[var(--text-muted)]" />
            <span className="text-[var(--text-xs)] font-[var(--weight-medium)] text-[var(--text-muted)] uppercase tracking-wider">
              Bookmarks
            </span>
          </div>
          <div className="orbit-panel p-2 space-y-0.5 min-h-[180px]">
            {topBookmarks.length === 0 ? (
              <div className="flex items-center justify-center h-full py-8">
                <p className="text-[var(--text-xs)] text-[var(--text-muted)] text-center px-2">
                  Saved bookmarks will appear here.
                </p>
              </div>
            ) : (
              topBookmarks.map((bm) => (
                <button
                  key={bm.id}
                  onClick={() => navigate(bm.url)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-sm)] text-left hover:bg-[var(--elevated)] transition-colors"
                >
                  <Star size={12} strokeWidth={2} className="text-[var(--color-primary)] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-xs)] text-[var(--text)] orbit-truncate">
                      {bm.title || formatHost(bm.url)}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] orbit-truncate">
                      {formatHost(bm.url)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}