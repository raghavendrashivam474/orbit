/**
 * AddressBar.tsx
 * Orbit Toolbar - Address Bar
 *
 * Sprint 3: Functional navigation.
 * Accepts URLs and search queries.
 * Delegates all navigation to useBrowser hook.
 */

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useBrowser } from "@/hooks/useBrowser";

export function AddressBar(): React.JSX.Element {
  const { state, navigate, stop } = useBrowser();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input with current URL when not focused
  useEffect(() => {
    if (!isFocused && state?.url) {
      setInput(state.url === "about:blank" ? "" : state.url);
    }
  }, [state?.url, isFocused]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;
    inputRef.current?.blur();
    await navigate(input.trim());
  };

  const handleFocus = (): void => {
    setIsFocused(true);
    inputRef.current?.select();
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    if (state?.url) {
      setInput(state.url === "about:blank" ? "" : state.url);
    }
  };

  const handleStop = (): void => {
    stop().catch(console.warn);
  };

  return (
    <div className="flex-1 flex items-center max-w-2xl mx-auto w-full">
      <form
        onSubmit={handleSubmit}
        className="w-full"
      >
        <div
          className={[
            "flex items-center gap-2 w-full",
            "h-8 px-3",
            "bg-[var(--elevated)] border",
            isFocused
              ? "border-[var(--accent)] bg-[var(--surface)]"
              : "border-[var(--border)] hover:border-[var(--accent)]",
            "rounded-[var(--radius-full)]",
            "transition-all duration-[var(--duration-normal)]",
            "orbit-no-drag",
          ].join(" ")}
        >
          <Search
            size={13}
            strokeWidth={2}
            className="text-[var(--text-muted)] flex-shrink-0"
          />

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search Orbit or enter URL"
            className={[
              "flex-1 bg-transparent border-none outline-none",
              "text-[var(--text-sm)] text-[var(--text)]",
              "placeholder:text-[var(--text-muted)]",
              "caret-[var(--accent)]",
            ].join(" ")}
            aria-label="Address bar"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />

          {state?.isLoading && (
            <button
              type="button"
              aria-label="Stop loading"
              onClick={handleStop}
              className="text-[var(--text-muted)] hover:text-[var(--text)] flex-shrink-0"
            >
              <X size={13} strokeWidth={2} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}