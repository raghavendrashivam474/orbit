/**
 * HistoryPage.tsx
 * Orbit History - Functional Implementation
 */

import { useEffect, useState } from "react";
import { Clock, Search, Trash2, X } from "lucide-react";
import { useHistoryStore } from "@/store/historyStore";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { useNavigate } from "react-router-dom";

export function HistoryPage(): React.JSX.Element {
  const { entries, isLoading, load, search, deleteEntry, clear } = useHistoryStore();
  const { addTab } = useTabStore();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => { load(); }, [load]);

  const handleSearch = (q: string): void => {
    setQuery(q);
    search(q).catch(console.warn);
  };

  const handleOpen = (url: string, title: string): void => {
    addTab({ url, title });
    navigate("/browse");
    setTimeout(() => {
      browserFacade.navigate(url).catch(console.warn);
    }, 0);
  };

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[var(--text-xl)] font-[var(--weight-semibold)] text-[var(--text)]">
          History
        </h1>
        <button
          onClick={() => clear().catch(console.warn)}
          className={[
            "flex items-center gap-2 px-3 py-1.5",
            "rounded-[var(--radius-md)] border border-[var(--border)]",
            "text-[var(--text-sm)] text-[var(--text-secondary)]",
            "hover:border-[var(--color-danger)] hover:text-[var(--color-danger)]",
            "transition-all duration-[var(--duration-normal)]",
          ].join(" ")}
        >
          <Trash2 size={13} strokeWidth={2} />
          Clear All
        </button>
      </div>

      {/* Search */}
      <div className={[
        "flex items-center gap-2 px-3 h-9 mb-6",
        "bg-[var(--elevated)] border border-[var(--border)]",
        "rounded-[var(--radius-md)]",
        "focus-within:border-[var(--accent)]",
        "transition-all duration-[var(--duration-normal)]",
      ].join(" ")}>
        <Search size={14} strokeWidth={2} className="text-[var(--text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search history..."
          className="flex-1 bg-transparent border-none outline-none text-[var(--text-sm)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
        />
        {query && (
          <button onClick={() => handleSearch("")}>
            <X size={13} strokeWidth={2} className="text-[var(--text-muted)]" />
          </button>
        )}
      </div>

      {/* Results */}
      {isLoading && (
        <div className="text-center py-12 text-[var(--text-sm)] text-[var(--text-muted)]">
          Loading...
        </div>
      )}

      {!isLoading && entries.length === 0 && (
        <div className="text-center py-12">
          <Clock size={32} strokeWidth={1} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
            {query ? "No results found." : "No history yet."}
          </p>
        </div>
      )}

      <div className="space-y-1">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={[
              "group flex items-center gap-3 px-3 py-2.5",
              "rounded-[var(--radius-md)]",
              "hover:bg-[var(--elevated)]",
              "transition-colors duration-[var(--duration-fast)]",
            ].join(" ")}
          >
            <Clock size={13} strokeWidth={2} className="text-[var(--text-muted)] flex-shrink-0" />

            <button
              onClick={() => handleOpen(entry.url, entry.title)}
              className="flex-1 text-left min-w-0"
            >
              <p className="text-[var(--text-sm)] text-[var(--text)] orbit-truncate">
                {entry.title || entry.url}
              </p>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)] orbit-truncate">
                {entry.url}
              </p>
            </button>

            <span className="text-[var(--text-xs)] text-[var(--text-muted)] flex-shrink-0">
              {formatDate(entry.visited_at)}
            </span>

            <button
              onClick={() => deleteEntry(entry.id).catch(console.warn)}
              className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--color-danger)] transition-all"
              aria-label="Delete entry"
            >
              <X size={13} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}