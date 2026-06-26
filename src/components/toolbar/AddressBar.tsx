import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTabStore } from "@/store/tabStore";
import { WebviewSync } from "@/browser/WebviewSync";
import { resolveUrl } from "@/services/navigation/urlResolver";

export function AddressBar(): React.JSX.Element {
  const { activeTabId, getActiveTab } = useTabStore();
  const activeTab = getActiveTab();
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input to active tab's URL whenever active tab changes
  useEffect(() => {
    if (isFocused) return;
    setInput(activeTab?.url ?? "");
  }, [activeTabId, activeTab?.url, isFocused]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    inputRef.current?.blur();
    const resolved = resolveUrl(value).href;
    await WebviewSync.navigate(resolved);
  };

  const handleFocus = (): void => {
    setIsFocused(true);
    inputRef.current?.select();
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    setInput(activeTab?.url ?? "");
  };

  return (
    <div className="flex-1 flex items-center max-w-2xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={[
            "flex items-center gap-2 w-full h-8 px-3",
            "bg-[var(--elevated)] border",
            isFocused
              ? "border-[var(--accent)] bg-[var(--surface)]"
              : "border-[var(--border)] hover:border-[var(--accent)]",
            "rounded-[var(--radius-full)]",
            "transition-all duration-[var(--duration-normal)]",
            "orbit-no-drag",
          ].join(" ")}
        >
          <Search size={13} strokeWidth={2} className="text-[var(--text-muted)] flex-shrink-0" />

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
          />

          {activeTab?.isLoading && (
            <button
              type="button"
              aria-label="Stop loading"
              onClick={() => WebviewSync.stop()}
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