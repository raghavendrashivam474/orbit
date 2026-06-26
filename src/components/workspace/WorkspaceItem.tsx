/**
 * WorkspaceItem.tsx
 * Individual workspace entry in the sidebar.
 */

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
        "w-full flex items-center gap-3 px-3 py-2",
        "rounded-[var(--radius-md)]",
        "text-[var(--text-sm)] font-[var(--weight-medium)]",
        "orbit-no-select orbit-focus-ring",
        "transition-all duration-[var(--duration-fast)]",
        isActive
          ? "text-[var(--text)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)]",
      ].join(" ")}
      style={isActive ? { background: `${workspace.color}20` } : undefined}
    >
      {/* Color indicator + icon */}
      <div
        className="flex-shrink-0 w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center text-sm"
        style={{
          background: isActive ? workspace.color : "var(--elevated)",
          boxShadow:  isActive ? `0 0 0 2px ${workspace.color}40` : "none",
        }}
      >
        {workspace.icon}
      </div>

      {!collapsed && (
        <span className="flex-1 orbit-truncate">{workspace.name}</span>
      )}

      {isActive && !collapsed && (
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: workspace.color }}
        />
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