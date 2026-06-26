/**
 * BookmarksPage.tsx
 * Orbit Bookmarks - Functional Implementation
 */

import { useEffect, useState } from "react";
import { Bookmark, Search, Trash2, X } from "lucide-react";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { useNavigate } from "react-router-dom";

export function BookmarksPage(): React.JSX.Element {
  const { bookmarks, isLoading, load, search, remove } = useBookmarkStore();
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

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[var(--text-xl)] font-[var(--weight-semibold)] text-[var(--text)]">
          Bookmarks
        </h1>
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
          placeholder="Search bookmarks..."
          className="flex-1 bg-transparent border-none outline-none text-[var(--text-sm)] text-[var(--text)] placeholder:text-[var(--text-muted)]"
        />
        {query && (
          <button onClick={() => handleSearch("")}>
            <X size={13} strokeWidth={2} className="text-[var(--text-muted)]" />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-12 text-[var(--text-sm)] text-[var(--text-muted)]">
          Loading...
        </div>
      )}

      {!isLoading && bookmarks.length === 0 && (
        <div className="text-center py-12">
          <Bookmark size={32} strokeWidth={1} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
            {query ? "No bookmarks found." : "No bookmarks yet."}
          </p>
          <p className="text-[var(--text-xs)] text-[var(--text-muted)] mt-1">
            Press Ctrl+D while browsing to save a page.
          </p>
        </div>
      )}

      <div className="space-y-1">
        {bookmarks.map((entry) => (
          <div
            key={entry.id}
            className={[
              "group flex items-center gap-3 px-3 py-2.5",
              "rounded-[var(--radius-md)]",
              "hover:bg-[var(--elevated)]",
              "transition-colors duration-[var(--duration-fast)]",
            ].join(" ")}
          >
            <Bookmark size={13} strokeWidth={2} className="text-[var(--color-primary)] flex-shrink-0" />

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

            <button
              onClick={() => remove(entry.id).catch(console.warn)}
              className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-[var(--color-danger)] transition-all"
              aria-label="Remove bookmark"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}