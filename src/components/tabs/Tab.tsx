import { X } from "lucide-react";
import { useTabStore, type Tab } from "@/store/tabStore";

interface TabProps {
  tab: Tab;
}

export function TabComponent({ tab }: TabProps): React.JSX.Element {
  const { activeTabId, setActiveTab, closeTab } = useTabStore();
  const isActive = tab.id === activeTabId;

  return (
    <div
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(tab.id)}
      className={[
        "group relative flex items-center gap-2",
        "h-full px-3 min-w-[140px] max-w-[220px]",
        "cursor-pointer orbit-no-select animate-tab-open",
        "border-r border-[var(--border)]",
        "transition-colors duration-[var(--duration-fast)]",
        isActive
          ? "bg-[var(--bg)] text-[var(--text)]"
          : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)]",
      ].join(" ")}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent)] rounded-t-full" />
      )}

      {/* Favicon placeholder */}
      <div className="w-4 h-4 rounded-[var(--radius-sm)] bg-[var(--elevated)] flex-shrink-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
      </div>

      {/* Title */}
      <span className="flex-1 text-[var(--text-sm)] orbit-truncate">
        {tab.title}
      </span>

      {/* Close button */}
      <button
        aria-label={`Close ${tab.title}`}
        onClick={(e) => {
          e.stopPropagation();
          closeTab(tab.id);
        }}
        className={[
          "flex-shrink-0 w-4 h-4 rounded-[var(--radius-sm)]",
          "flex items-center justify-center",
          "text-[var(--text-muted)] hover:text-[var(--color-danger)]",
          "hover:bg-[rgba(239,68,68,0.1)]",
          "opacity-0 group-hover:opacity-100",
          isActive ? "opacity-100" : "",
          "transition-all duration-[var(--duration-fast)]",
        ].join(" ")}
      >
        <X size={10} strokeWidth={2.5} />
      </button>
    </div>
  );
}