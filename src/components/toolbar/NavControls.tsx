import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import { IconButton } from "@/components/common/IconButton";
import { Tooltip } from "@/components/common/Tooltip";
import { useTabStore } from "@/store/tabStore";
import { WebviewSync } from "@/browser/WebviewSync";

export function NavControls(): React.JSX.Element {
  const { getActiveTab } = useTabStore();
  const tab = getActiveTab();

  const canGoBack    = tab?.canGoBack    ?? false;
  const canGoForward = tab?.canGoForward ?? false;
  const isLoading    = tab?.isLoading    ?? false;

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip content="Back (Alt+Left)" side="bottom">
        <IconButton label="Go back" disabled={!canGoBack} onClick={() => WebviewSync.back()}>
          <ChevronLeft size={16} strokeWidth={2} />
        </IconButton>
      </Tooltip>

      <Tooltip content="Forward (Alt+Right)" side="bottom">
        <IconButton label="Go forward" disabled={!canGoForward} onClick={() => WebviewSync.forward()}>
          <ChevronRight size={16} strokeWidth={2} />
        </IconButton>
      </Tooltip>

      <Tooltip content={isLoading ? "Stop (Esc)" : "Reload (Ctrl+R)"} side="bottom">
        <IconButton
          label={isLoading ? "Stop loading" : "Reload page"}
          onClick={() => isLoading ? WebviewSync.stop() : WebviewSync.reload()}
        >
          {isLoading ? <X size={14} strokeWidth={2} /> : <RotateCcw size={14} strokeWidth={2} />}
        </IconButton>
      </Tooltip>
    </div>
  );
}