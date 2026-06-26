import { useState } from "react";
import { Plus } from "lucide-react";
import { WorkspaceItem } from "./WorkspaceItem";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Tooltip } from "@/components/common/Tooltip";

interface WorkspaceSectionProps {
  collapsed: boolean;
}

export function WorkspaceSection({ collapsed }: WorkspaceSectionProps): React.JSX.Element {
  const { workspaces, activeWorkspaceId, switchTo } = useWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <div className="py-1">
        {/* Section header — expanded only */}
        {!collapsed && (
          <div className="flex items-center justify-between px-3 mb-1.5 h-6">
            <span className="text-[10px] font-[var(--weight-semibold)] text-[var(--text-muted)] uppercase tracking-[0.08em]">
              Workspaces
            </span>
            <Tooltip content="New workspace" side="right">
              <button
                onClick={() => setDialogOpen(true)}
                aria-label="Create workspace"
                className={[
                  "w-5 h-5 rounded-[var(--radius-sm)]",
                  "flex items-center justify-center",
                  "text-[var(--text-muted)] hover:text-[var(--accent)]",
                  "hover:bg-[var(--elevated)]",
                  "transition-all duration-200 ease-out",
                ].join(" ")}
              >
                <Plus size={12} strokeWidth={2.5} />
              </button>
            </Tooltip>
          </div>
        )}

        {/* Workspace items — flex column with explicit gap */}
        <div className={[
          "flex flex-col",
          collapsed ? "px-1.5 gap-1" : "pr-2 gap-0.5",
        ].join(" ")}>
          {workspaces.map((workspace) => (
            <WorkspaceItem
              key={workspace.id}
              workspace={workspace}
              isActive={workspace.id === activeWorkspaceId}
              collapsed={collapsed}
              onSelect={switchTo}
            />
          ))}
        </div>

        {/* Add button — collapsed only */}
        {collapsed && (
          <div className="px-1.5 mt-1">
            <Tooltip content="New workspace" side="right">
              <button
                onClick={() => setDialogOpen(true)}
                aria-label="Create workspace"
                className={[
                  "w-full flex items-center justify-center",
                  "h-9 rounded-[var(--radius-md)]",
                  "text-[var(--text-muted)] hover:text-[var(--accent)]",
                  "hover:bg-[var(--elevated)]",
                  "transition-all duration-200 ease-out",
                ].join(" ")}
              >
                <Plus size={15} strokeWidth={2} />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      <CreateWorkspaceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}