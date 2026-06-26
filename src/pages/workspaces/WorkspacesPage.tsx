/**
 * WorkspacesPage.tsx
 * Orbit Workspaces Management Page
 */

import { useState } from "react";
import { Layers, Pencil, Trash2, Plus } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { CreateWorkspaceDialog } from "@/components/workspace/CreateWorkspaceDialog";

export function WorkspacesPage(): React.JSX.Element {
  const { workspaces, activeWorkspaceId, switchTo, remove } = useWorkspace();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleting,   setDeleting]   = useState<string | null>(null);

  const handleDelete = async (id: string): Promise<void> => {
    if (workspaces.length <= 1) return;
    setDeleting(id);
    try {
      await remove(id);
    } catch (err) {
      console.warn(err);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[var(--text-xl)] font-[var(--weight-semibold)] text-[var(--text)]">
            Workspaces
          </h1>
          <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mt-0.5">
            Organize your browsing into focused workspaces.
          </p>
        </div>

        <button
          onClick={() => setDialogOpen(true)}
          className={[
            "flex items-center gap-2 px-3 py-2",
            "rounded-[var(--radius-md)]",
            "bg-[var(--accent)] text-white",
            "text-[var(--text-sm)] font-[var(--weight-medium)]",
            "hover:bg-[var(--accent-hover)]",
            "transition-all duration-[var(--duration-normal)]",
          ].join(" ")}
        >
          <Plus size={14} strokeWidth={2} />
          New
        </button>
      </div>

      <div className="space-y-2">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={[
              "group flex items-center gap-4 px-4 py-3",
              "rounded-[var(--radius-md)] border",
              "transition-all duration-[var(--duration-normal)]",
              workspace.id === activeWorkspaceId
                ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                : "border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--accent)]",
            ].join(" ")}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: workspace.color }}
            >
              {workspace.icon}
            </div>

            {/* Info */}
            <button
              onClick={() => switchTo(workspace.id)}
              className="flex-1 text-left"
            >
              <p className="text-[var(--text-sm)] font-[var(--weight-medium)] text-[var(--text)]">
                {workspace.name}
              </p>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)]">
                {workspace.isDefault ? "Default workspace" : ""}
              </p>
            </button>

            {/* Active badge */}
            {workspace.id === activeWorkspaceId && (
              <span className="text-[var(--text-xs)] text-[var(--accent)] font-[var(--weight-medium)]">
                Active
              </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                aria-label="Edit workspace"
                className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
              >
                <Pencil size={13} strokeWidth={2} />
              </button>

              {!workspace.isDefault && workspaces.length > 1 && (
                <button
                  onClick={() => handleDelete(workspace.id)}
                  disabled={deleting === workspace.id}
                  aria-label="Delete workspace"
                  className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--color-danger)] hover:bg-[rgba(239,68,68,0.1)] disabled:opacity-50"
                >
                  <Trash2 size={13} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {workspaces.length === 0 && (
        <div className="text-center py-16">
          <Layers size={32} strokeWidth={1} className="text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-sm)] text-[var(--text-muted)]">
            No workspaces yet.
          </p>
        </div>
      )}

      <CreateWorkspaceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}