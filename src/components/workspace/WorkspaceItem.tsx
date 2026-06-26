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
  const button = (
    <button
      onClick={() => onSelect(workspace.id)}
      aria-label={workspace.name}
      aria-current={isActive ? "true" : undefined}
      className={[
        "w-full flex items-center gap-2.5 px-2 py-1.5",
        "rounded-[var(--radius-md)]",
        "text-[var(--text-sm)] font-[var(--weight-medium)]",
        "orbit-no-select orbit-focus-ring",
        "transition-all duration-[var(--duration-fast)]",
        isActive
          ? "text-[var(--text)] bg-[var(--elevated)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)]",
      ].join(" ")}
    >
      {/* Icon container with emoji */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-[var(--radius-sm)] transition-all"
        style={{
          width:      "28px",
          height:     "28px",
          background: isActive ? workspace.color : `${workspace.color}30`,
          fontSize:   "16px",
          lineHeight: "1",
        }}
      >
        <span style={{ filter: isActive ? "none" : "grayscale(0.2)" }}>
          {workspace.icon}
        </span>
      </div>

      {!collapsed && (
        <>
          <span className="flex-1 orbit-truncate text-left">{workspace.name}</span>
          {isActive && (
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: workspace.color }}
            />
          )}
        </>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip content={workspace.name} side="right">
        {button}
      </Tooltip>
    );
  }

  return button;
}