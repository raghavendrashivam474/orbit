import { Search } from "lucide-react";

export function AddressBar(): React.JSX.Element {
  return (
    <div className="flex-1 flex items-center max-w-2xl mx-auto w-full">
      <div
        className={[
          "flex items-center gap-2 w-full",
          "h-8 px-3",
          "bg-[var(--elevated)] border border-[var(--border)]",
          "rounded-[var(--radius-full)]",
          "hover:border-[var(--accent)] hover:bg-[var(--surface)]",
          "focus-within:border-[var(--accent)] focus-within:bg-[var(--surface)]",
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
          type="text"
          placeholder="Search Orbit or enter URL"
          className={[
            "flex-1 bg-transparent border-none outline-none",
            "text-[var(--text-sm)] text-[var(--text)]",
            "placeholder:text-[var(--text-muted)]",
            "caret-[var(--accent)]",
          ].join(" ")}
          aria-label="Address bar"
        />
      </div>
    </div>
  );
}