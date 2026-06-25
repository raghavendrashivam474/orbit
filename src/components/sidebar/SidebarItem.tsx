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

  const button = (
    <button
      onClick={() => navigate(path)}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      className={[
        "w-full flex items-center gap-3 px-3 py-2",
        "rounded-[var(--radius-md)]",
        "text-[var(--text-sm)] font-[var(--weight-medium)]",
        "orbit-no-select orbit-focus-ring",
        "transition-all duration-[var(--duration-fast)]",
        isActive
          ? "bg-[var(--accent-muted)] text-[var(--accent)]"
          : "text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)]",
      ].join(" ")}
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {icon}
      </span>
      {!collapsed && (
        <span className="animate-fade-in orbit-truncate">{label}</span>
      )}
      {isActive && !collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip content={label} side="right">
        {button}
      </Tooltip>
    );
  }

  return button;
}