import { type ReactNode, useState } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({
  content,
  children,
  side = "bottom",
}: TooltipProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left:   "right-full top-1/2 -translate-y-1/2 mr-2",
    right:  "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={[
            "absolute z-50 pointer-events-none",
            "px-2 py-1 rounded-[var(--radius-sm)]",
            "bg-[var(--elevated)] border border-[var(--border)]",
            "text-[var(--text)] text-[var(--text-xs)]",
            "whitespace-nowrap shadow-[var(--shadow-md)]",
            "animate-fade-in",
            positionClasses[side],
          ].join(" ")}
        >
          {content}
        </div>
      )}
    </div>
  );
}