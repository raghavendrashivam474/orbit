import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { IconButton } from "@/components/common/IconButton";
import { Tooltip } from "@/components/common/Tooltip";

export function NavControls(): React.JSX.Element {
  return (
    <div className="flex items-center gap-0.5">
      <Tooltip content="Back (Alt+Left)" side="bottom">
        <IconButton label="Go back" disabled>
          <ChevronLeft size={16} strokeWidth={2} />
        </IconButton>
      </Tooltip>

      <Tooltip content="Forward (Alt+Right)" side="bottom">
        <IconButton label="Go forward" disabled>
          <ChevronRight size={16} strokeWidth={2} />
        </IconButton>
      </Tooltip>

      <Tooltip content="Reload (Ctrl+R)" side="bottom">
        <IconButton label="Reload page" disabled>
          <RotateCcw size={14} strokeWidth={2} />
        </IconButton>
      </Tooltip>
    </div>
  );
}