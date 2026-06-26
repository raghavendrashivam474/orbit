/**
 * CreateWorkspaceDialog.tsx
 * Dialog for creating a new workspace.
 */

import { useState } from "react";
import { X } from "lucide-react";
import { WORKSPACE_COLORS, WORKSPACE_EMOJIS } from "@/workspace/WorkspaceTypes";
import { useWorkspace } from "@/hooks/useWorkspace";

interface CreateWorkspaceDialogProps {
  open:    boolean;
  onClose: () => void;
}

export function CreateWorkspaceDialog({
  open,
  onClose,
}: CreateWorkspaceDialogProps): React.JSX.Element | null {
  const { create } = useWorkspace();

  const [name,  setName]  = useState("");
  const [icon,  setIcon]  = useState("ðŸ ");
  const [color, setColor] = useState("#3B82F6");
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!name.trim()) { setError("Workspace name is required."); return; }

    setBusy(true);
    setError("");

    try {
      await create({ name: name.trim(), icon, iconType: "emoji", color });
      setName(""); setIcon("ðŸ "); setColor("#3B82F6");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workspace.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      <div className={[
        "fixed top-[25%] left-1/2 -translate-x-1/2 z-50",
        "w-full max-w-md",
        "bg-[var(--elevated)] border border-[var(--border)]",
        "rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]",
        "animate-scale-in overflow-hidden",
      ].join(" ")}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-[var(--text-base)] font-[var(--weight-semibold)] text-[var(--text)]">
            New Workspace
          </h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Preview */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-xl"
              style={{ background: color }}
            >
              {icon}
            </div>
            <div>
              <p className="text-[var(--text-sm)] font-[var(--weight-medium)] text-[var(--text)]">
                {name || "Workspace name"}
              </p>
              <p className="text-[var(--text-xs)] text-[var(--text-muted)]">Preview</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[var(--text-sm)] text-[var(--text-secondary)] mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. College, Startup, Research"
              autoFocus
              maxLength={32}
              className={[
                "w-full px-3 py-2",
                "bg-[var(--surface)] border border-[var(--border)]",
                "rounded-[var(--radius-md)]",
                "text-[var(--text-sm)] text-[var(--text)]",
                "placeholder:text-[var(--text-muted)]",
                "outline-none focus:border-[var(--accent)]",
                "transition-colors duration-[var(--duration-fast)]",
              ].join(" ")}
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-[var(--text-sm)] text-[var(--text-secondary)] mb-1.5">
              Icon
            </label>
            <div className="grid grid-cols-8 gap-1.5">
              {WORKSPACE_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={[
                    "w-8 h-8 rounded-[var(--radius-sm)] text-base",
                    "flex items-center justify-center",
                    "transition-all duration-[var(--duration-fast)]",
                    icon === emoji
                      ? "ring-2 ring-[var(--accent)] bg-[var(--accent-muted)]"
                      : "hover:bg-[var(--elevated)]",
                  ].join(" ")}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-[var(--text-sm)] text-[var(--text-secondary)] mb-1.5">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {WORKSPACE_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className={[
                    "w-7 h-7 rounded-full",
                    "transition-all duration-[var(--duration-fast)]",
                    color === c.value ? "ring-2 ring-offset-2 ring-[var(--border)] scale-110" : "",
                  ].join(" ")}
                  style={{ background: c.value }}
                />
              ))}
            </div>
          </div>

          {error && (
            <p className="text-[var(--text-sm)] text-[var(--color-danger)]">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className={[
                "flex-1 py-2 rounded-[var(--radius-md)]",
                "border border-[var(--border)]",
                "text-[var(--text-sm)] text-[var(--text-secondary)]",
                "hover:text-[var(--text)] hover:border-[var(--text-muted)]",
                "transition-all duration-[var(--duration-fast)]",
              ].join(" ")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy || !name.trim()}
              className={[
                "flex-1 py-2 rounded-[var(--radius-md)]",
                "bg-[var(--accent)] text-white",
                "text-[var(--text-sm)] font-[var(--weight-medium)]",
                "hover:bg-[var(--accent-hover)]",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-[var(--duration-fast)]",
              ].join(" ")}
            >
              {busy ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}