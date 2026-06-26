/**
 * CommandPalette.tsx
 * Orbit Command Palette - Sprint 4 Foundation
 *
 * Triggered by Ctrl+K.
 * Sprint 4: Navigation commands only.
 * Sprint 5+: AI commands, workspace commands, search.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Bookmark, Settings, Plus } from "lucide-react";
import { useTabStore } from "@/store/tabStore";
import { useHistoryStore } from "@/store/historyStore";

interface Command {
  id:       string;
  label:    string;
  category: string;
  icon:     React.ReactNode;
  action:   () => void;
}

interface CommandPaletteProps {
  open:    boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps): React.JSX.Element | null {
  const [query, setQuery]           = useState("");
  const [selected, setSelected]     = useState(0);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const navigate                    = useNavigate();
  const { addTab }                  = useTabStore();
  const { entries: history, search: searchHistory } = useHistoryStore();

  const staticCommands: Command[] = [
    {
      id:       "new-tab",
      label:    "New Tab",
      category: "Actions",
      icon:     <Plus size={14} strokeWidth={2} />,
      action:   () => { addTab(); onClose(); },
    },
    {
      id:       "history",
      label:    "Open History",
      category: "Navigate",
      icon:     <Clock size={14} strokeWidth={2} />,
      action:   () => { navigate("/history"); onClose(); },
    },
    {
      id:       "bookmarks",
      label:    "Open Bookmarks",
      category: "Navigate",
      icon:     <Bookmark size={14} strokeWidth={2} />,
      action:   () => { navigate("/bookmarks"); onClose(); },
    },
    {
      id:       "settings",
      label:    "Open Settings",
      category: "Navigate",
      icon:     <Settings size={14} strokeWidth={2} />,
      action:   () => { navigate("/settings"); onClose(); },
    },
  ];

  const historyCommands: Command[] = history.slice(0, 5).map((entry) => ({
    id:       `history-${entry.id}`,
    label:    entry.title || entry.url,
    category: "Recent",
    icon:     <Clock size={14} strokeWidth={2} />,
    action:   () => {
      addTab({ url: entry.url, title: entry.title });
      onClose();
    },
  }));

  const allCommands = query.trim()
    ? [...staticCommands, ...historyCommands].filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : [...staticCommands, ...historyCommands];

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (query) {
      searchHistory(query).catch(console.warn);
    }
  }, [query, searchHistory]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, allCommands.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        allCommands[selected]?.action();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, allCommands, selected, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Palette */}
      <div className={[
        "fixed top-[20%] left-1/2 -translate-x-1/2 z-50",
        "w-full max-w-lg",
        "bg-[var(--elevated)] border border-[var(--border)]",
        "rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]",
        "overflow-hidden animate-scale-in",
      ].join(" ")}>
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={16} strokeWidth={2} className="text-[var(--text-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, history, bookmarks..."
            className={[
              "flex-1 bg-transparent border-none outline-none",
              "text-[var(--text-base)] text-[var(--text)]",
              "placeholder:text-[var(--text-muted)]",
              "caret-[var(--accent)]",
            ].join(" ")}
          />
          <kbd className="text-[var(--text-xs)] text-[var(--text-muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto orbit-scrollbar py-2">
          {allCommands.length === 0 && (
            <div className="px-4 py-8 text-center text-[var(--text-sm)] text-[var(--text-muted)]">
              No results found.
            </div>
          )}

          {allCommands.map((cmd, i) => (
            <button
              key={cmd.id}
              onClick={cmd.action}
              className={[
                "w-full flex items-center gap-3 px-4 py-2.5",
                "text-left text-[var(--text-sm)]",
                "transition-colors duration-[var(--duration-fast)]",
                i === selected
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text)]",
              ].join(" ")}
              onMouseEnter={() => setSelected(i)}
            >
              <span className="flex-shrink-0">{cmd.icon}</span>
              <span className="flex-1 orbit-truncate">{cmd.label}</span>
              <span className="text-[var(--text-xs)] text-[var(--text-muted)] flex-shrink-0">
                {cmd.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}