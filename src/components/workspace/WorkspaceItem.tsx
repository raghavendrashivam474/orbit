import type { Workspace } from "@/workspace/WorkspaceTypes";
import { Tooltip } from "@/components/common/Tooltip";

interface WorkspaceItemProps {
  workspace:   Workspace;
  isActive:    boolean;
  collapsed:   boolean;
  onSelect:    (id: string) => void;
}

export function WorkspaceItem({
  workspace,
  isActive,
  collapsed,
  onSelect,
}: WorkspaceItemProps): React.JSX.Element {

  // Expanded â€” Rail style
  if (!collapsed) {
    return (
      <button
        onClick={() => onSelect(workspace.id)}
        aria-label={workspace.name}
        aria-current={isActive ? "true" : undefined}
        className={[
          "relative w-full flex items-center gap-2.5",
          "h-8 pl-3 pr-2",
          "rounded-r-[var(--radius-md)]",
          "text-[var(--text-sm)]",
          "orbit-no-select orbit-focus-ring",
          "transition-all duration-200 ease-out",
          isActive
            ? "bg-[var(--elevated)] text-[var(--text)] font-[var(--weight-medium)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)]",
        ].join(" ")}
      >
        {/* Active accent bar */}
        {isActive && (
          <span
            className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full transition-all duration-200"
            style={{
              background: workspace.color,
              boxShadow: `0 0 8px ${workspace.color}66`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Emoji icon */}
        <span
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
          style={{ fontSize: "15px", lineHeight: "1" }}
        >
          {workspace.icon}
        </span>

        {/* Label */}
        <span className="flex-1 orbit-truncate text-left">
          {workspace.name}
        </span>
      </button>
    );
  }

  // Collapsed â€” centered icon with subtle hover
  return (
    <Tooltip content={workspace.name} side="right">
      <button
        onClick={() => onSelect(workspace.id)}
        aria-label={workspace.name}
        aria-current={isActive ? "true" : undefined}
        className={[
          "relative w-full flex items-center justify-center",
          "h-9 mx-auto",
          "rounded-[var(--radius-md)]",
          "orbit-no-select orbit-focus-ring",
          "transition-all duration-200 ease-out",
          isActive
            ? "bg-[var(--elevated)]"
            : "hover:bg-[var(--elevated)]",
        ].join(" ")}
      >
        {/* Active accent bar on the left edge of sidebar */}
        {isActive && (
          <span
            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
            style={{
              background: workspace.color,
              boxShadow: `0 0 8px ${workspace.color}66`,
            }}
            aria-hidden="true"
          />
        )}

        <span
          style={{ fontSize: "17px", lineHeight: "1" }}
          className={[
            "transition-transform duration-200",
            isActive ? "scale-110" : "",
          ].join(" ")}
        >
          {workspace.icon}
        </span>
      </button>
    </Tooltip>
  );
}