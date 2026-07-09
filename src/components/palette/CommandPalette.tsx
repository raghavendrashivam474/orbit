/**
 * CommandPalette.tsx
 * Orbit Command Palette
 *
 * Triggered by Ctrl+K.
 * Provides navigation shortcuts and history access.
 *
 * Sprint 5.4.z fix:
 *   - Uses new tabStore.addTab(workspaceId, url?) signature
 *   - Uses WebviewSync.navigate for actual page loads
 *   - Escape only closes palette when palette is open (does not
 *     interfere with the shell's global Escape handler)
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Clock, Bookmark, Settings, Plus } from "lucide-react";
import { useTabStore } from "@/store/tabStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useHistoryStore } from "@/store/historyStore";
import { WebviewSync } from "@/browser/WebviewSync";

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
  const [query, setQuery]       = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef                = useRef<HTMLInputElement>(null);
  const navigate                = useNavigate();

  const { entries: history, search: searchHistory } = useHistoryStore();

  // ── Command builders ────────────────────────────────────

  /** Open a URL in a fresh tab within the active workspace. */
  const openInNewTab = (url: string): void => {
    const ws = useWorkspaceStore.getState().activeWorkspaceId;
    if (!ws) return;

    // Create the tab, then navigate its (yet-to-be-created) webview.
    // WebviewSync.navigate reads the active tab from the store, so we
    // must let the state settle before calling it.
    useTabStore.getState().addTab(ws);
    navigate("/");

    // Defer navigation until after the tab is registered as active
    setTimeout(() => {
      WebviewSync.navigate(url).catch(console.warn);
    }, 0);
  };

  const staticCommands: Command[] = [
    {
      id:       "new-tab",
      label:    "New Tab",
      category: "Actions",
      icon:     <Plus size={14} strokeWidth={2} />,
      action:   () => {
        const ws = useWorkspaceStore.getState().activeWorkspaceId;
        if (ws) {
          useTabStore.getState().addTab(ws);
          navigate("/");
        }
        onClose();
      },
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
      openInNewTab(entry.url);
      onClose();
    },
  }));

  const allCommands = query.trim()
    ? [...staticCommands, ...historyCommands].filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase())
      )
    : [...staticCommands, ...historyCommands];

  // ── Effects ─────────────────────────────────────────────

  // Reset state and focus input when palette opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search history as the user types
  useEffect(() => {
    if (query) {
      searchHistory(query).catch(console.warn);
    }
  }, [query, searchHistory]);

  // Reset selection when query changes
  useEffect(() => {
    setSelected(0);
  }, [query]);

  // Keyboard navigation within the palette
  //
  // Note: Escape stops propagation so the shell's global Escape
  // (which calls WebviewSync.stop) does not also fire.
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
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

    // Capture phase so palette handles Escape before shell does
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
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