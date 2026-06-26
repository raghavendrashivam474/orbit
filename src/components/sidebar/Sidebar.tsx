/**
 * Sidebar.tsx
 * Orbit Sidebar - Sprint 5
 */

import {
  Home,
  Clock,
  Bookmark,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { WorkspaceSection } from "@/components/workspace/WorkspaceSection";
import { SidebarItem } from "./SidebarItem";
import { Divider } from "@/components/common/Divider";
import { Tooltip } from "@/components/common/Tooltip";

const NAV_ITEMS = [
  { icon: <Home size={16} strokeWidth={2} />,     label: "Home",      path: "/" },
  { icon: <Clock size={16} strokeWidth={2} />,    label: "History",   path: "/history" },
  { icon: <Bookmark size={16} strokeWidth={2} />, label: "Bookmarks", path: "/bookmarks" },
  { icon: <Download size={16} strokeWidth={2} />, label: "Downloads", path: "/downloads" },
] as const;

interface SidebarProps {
  collapsed:         boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps): React.JSX.Element {
  return (
    <aside
      style={{
        width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
      }}
      className={[
        "flex flex-col flex-shrink-0",
        "bg-[var(--surface)] border-r border-[var(--border)]",
        "transition-[width] duration-[var(--duration-slow)] ease-[var(--ease-default)]",
        "overflow-hidden",
      ].join(" ")}
      aria-label="Primary navigation"
    >
      <div className="flex-1 overflow-y-auto orbit-scrollbar pt-2">
        <WorkspaceSection collapsed={collapsed} />

        <Divider className="mx-2 my-2" />

        <nav className="px-2 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      <Divider />

      <div className="p-2">
        <SidebarItem
          icon={<Settings size={16} strokeWidth={2} />}
          label="Settings"
          path="/settings"
          collapsed={collapsed}
        />
      </div>

      <Divider />

      <div className="p-2">
        <Tooltip
          content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          side="right"
        >
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={[
              "w-full flex items-center justify-center gap-2 py-2 px-3",
              "rounded-[var(--radius-md)]",
              "text-[var(--text-muted)] hover:text-[var(--text)]",
              "hover:bg-[var(--elevated)]",
              "text-[var(--text-sm)]",
              "orbit-no-select orbit-focus-ring",
              "transition-all duration-[var(--duration-fast)]",
            ].join(" ")}
          >
            {collapsed ? (
              <ChevronRight size={14} strokeWidth={2} />
            ) : (
              <>
                <ChevronLeft size={14} strokeWidth={2} />
                <span className="animate-fade-in">Collapse</span>
              </>
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}