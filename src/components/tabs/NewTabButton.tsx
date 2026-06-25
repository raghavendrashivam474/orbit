import { Plus } from "lucide-react";
import { useTabStore } from "@/store/tabStore";
import { IconButton } from "@/components/common/IconButton";

export function NewTabButton(): React.JSX.Element {
  const { addTab } = useTabStore();

  return (
    <IconButton
      label="New Tab (Ctrl+T)"
      size="sm"
      onClick={() => addTab()}
      className="mx-1 text-[var(--text-muted)] hover:text-[var(--text)]"
    >
      <Plus size={14} strokeWidth={2} />
    </IconButton>
  );
}