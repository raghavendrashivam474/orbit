import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tooltip } from "@/components/common/Tooltip";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  path: string;
  collapsed: boolean;
}

export function SidebarItem({
  icon,
  label,
  path,
  collapsed,
}: SidebarItemProps): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;

  // Expanded â€” Rail style matching workspace items
  if (!collapsed) {
    return (
      <button
        onClick={() => navigate(path)}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        className={[
          "relative w-full flex items-center gap-2.5",
          "h-8 pl-3 pr-2",
          "rounded-r-[var(--radius-md)]",
          "text-[var(--text-sm)]",
          "orbit-no-select orbit-focus-ring",
          "transition-all duration-200 ease-out",
          isActive
            ? "bg-[var(--elevated)] text-[var(--text)] font-[var(--weight-medium)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)]",
        ].join(" ")}
      >
        {/* Active accent bar â€” uses primary accent color */}
        {isActive && (
          <span
            className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent-muted)",
            }}
            aria-hidden="true"
          />
        )}

        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {icon}
        </span>

        <span className="flex-1 orbit-truncate text-left">{label}</span>
      </button>
    );
  }

  // Collapsed â€” centered icon
  return (
    <Tooltip content={label} side="right">
      <button
        onClick={() => navigate(path)}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        className={[
          "relative w-full flex items-center justify-center",
          "h-9 mx-auto",
          "rounded-[var(--radius-md)]",
          "orbit-no-select orbit-focus-ring",
          "transition-all duration-200 ease-out",
          isActive
            ? "bg-[var(--elevated)] text-[var(--text)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)]",
        ].join(" ")}
      >
        {isActive && (
          <span
            className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 8px var(--accent-muted)",
            }}
            aria-hidden="true"
          />
        )}

        <span className={[
          "transition-transform duration-200",
          isActive ? "scale-105" : "",
        ].join(" ")}>
          {icon}
        </span>
      </button>
    </Tooltip>
  );
}