import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTabStore } from "@/store/tabStore";
import { IconButton } from "@/components/common/IconButton";

export function NewTabButton(): React.JSX.Element {
  const { addTab } = useTabStore();
  const navigate   = useNavigate();

  const handleClick = (): void => {
    addTab();
    navigate("/");
  };

  return (
    <IconButton
      label="New Tab (Ctrl+T)"
      size="sm"
      onClick={handleClick}
      className="mx-1 text-[var(--text-muted)] hover:text-[var(--text)]"
    >
      <Plus size={14} strokeWidth={2} />
    </IconButton>
  );
}