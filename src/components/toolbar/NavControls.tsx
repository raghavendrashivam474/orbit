/**
 * NavControls.tsx
 * Orbit Toolbar - Navigation Controls
 *
 * Sprint 3: Functional back, forward, reload, stop.
 * Button state reflects actual browser history state.
 */

import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import { IconButton } from "@/components/common/IconButton";
import { Tooltip } from "@/components/common/Tooltip";
import { useBrowser } from "@/hooks/useBrowser";

export function NavControls(): React.JSX.Element {
  const { state, back, forward, reload, stop } = useBrowser();

  const canGoBack    = state?.canGoBack    ?? false;
  const canGoForward = state?.canGoForward ?? false;
  const isLoading    = state?.isLoading    ?? false;

  return (
    <div className="flex items-center gap-0.5">
      <Tooltip content="Back (Alt+Left)" side="bottom">
        <IconButton
          label="Go back"
          disabled={!canGoBack}
          onClick={() => back().catch(console.warn)}
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </IconButton>
      </Tooltip>

      <Tooltip content="Forward (Alt+Right)" side="bottom">
        <IconButton
          label="Go forward"
          disabled={!canGoForward}
          onClick={() => forward().catch(console.warn)}
        >
          <ChevronRight size={16} strokeWidth={2} />
        </IconButton>
      </Tooltip>

      <Tooltip content={isLoading ? "Stop (Esc)" : "Reload (Ctrl+R)"} side="bottom">
        <IconButton
          label={isLoading ? "Stop loading" : "Reload page"}
          onClick={() => {
            if (isLoading) {
              stop().catch(console.warn);
            } else {
              reload().catch(console.warn);
            }
          }}
        >
          {isLoading ? (
            <X size={14} strokeWidth={2} />
          ) : (
            <RotateCcw size={14} strokeWidth={2} />
          )}
        </IconButton>
      </Tooltip>
    </div>
  );
}