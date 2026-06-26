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
      <div className="px-2 pb-2">
        {!collapsed && (
          <div className="flex items-center justify-between px-2 mb-2 mt-1">
            <span className="text-[10px] font-[var(--weight-semibold)] text-[var(--text-muted)] uppercase tracking-wider">
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
                  "transition-all duration-[var(--duration-fast)]",
                ].join(" ")}
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </Tooltip>
          </div>
        )}

        <div className="space-y-1">
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

        {collapsed && (
          <Tooltip content="New workspace" side="right">
            <button
              onClick={() => setDialogOpen(true)}
              aria-label="Create workspace"
              className={[
                "w-full flex items-center justify-center mt-1",
                "h-8 rounded-[var(--radius-md)]",
                "text-[var(--text-muted)] hover:text-[var(--accent)]",
                "hover:bg-[var(--elevated)]",
                "transition-all duration-[var(--duration-fast)]",
              ].join(" ")}
            >
              <Plus size={14} strokeWidth={2} />
            </button>
          </Tooltip>
        )}
      </div>

      <CreateWorkspaceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}