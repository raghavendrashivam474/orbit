import { useEffect, useState } from "react";
import { invoke } from "@/core/ipc/bridge";
import { IconButton } from "@/components/common/IconButton";

export function WindowControls(): React.JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    invoke<boolean>("is_window_maximized")
      .then(setIsMaximized)
      .catch(() => setIsMaximized(false));
  }, []);

  const handleMinimize = (): void => {
    invoke("minimize_window").catch(console.warn);
  };

  const handleMaximize = (): void => {
    invoke("maximize_window")
      .then(() => setIsMaximized((prev) => !prev))
      .catch(console.warn);
  };

  const handleClose = (): void => {
    invoke("close_window").catch(console.warn);
  };

  return (
    <div className="flex items-center gap-1 orbit-no-drag px-2">
      <IconButton
        label="Minimize"
        size="sm"
        onClick={handleMinimize}
        className="hover:bg-[var(--elevated)]"
      >
        <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
          <rect width="10" height="1" rx="0.5" />
        </svg>
      </IconButton>

      <IconButton
        label={isMaximized ? "Restore" : "Maximize"}
        size="sm"
        onClick={handleMaximize}
        className="hover:bg-[var(--elevated)]"
      >
        {isMaximized ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="0" width="8" height="8" rx="1" />
            <rect x="0" y="2" width="8" height="8" rx="1" fill="var(--surface)" />
            <rect x="0" y="2" width="8" height="8" rx="1" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="0.5" y="0.5" width="9" height="9" rx="1" />
          </svg>
        )}
      </IconButton>

      <IconButton
        label="Close"
        size="sm"
        variant="danger"
        onClick={handleClose}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="1" y1="1" x2="9" y2="9" />
          <line x1="9" y1="1" x2="1" y2="9" />
        </svg>
      </IconButton>
    </div>
  );
}