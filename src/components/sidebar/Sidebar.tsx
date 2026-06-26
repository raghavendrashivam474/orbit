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
import { Tooltip } from "@/components/common/Tooltip";

const NAV_ITEMS = [
  { icon: <Home size={15} strokeWidth={2} />,     label: "Home",      path: "/" },
  { icon: <Clock size={15} strokeWidth={2} />,    label: "History",   path: "/history" },
  { icon: <Bookmark size={15} strokeWidth={2} />, label: "Bookmarks", path: "/bookmarks" },
  { icon: <Download size={15} strokeWidth={2} />, label: "Downloads", path: "/downloads" },
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
        "transition-[width] duration-200 ease-out",
        "overflow-hidden",
      ].join(" ")}
      aria-label="Primary navigation"
    >
      {/* Scrollable middle section */}
      <div className="flex-1 overflow-y-auto orbit-scrollbar pt-2 pb-1">

        {/* Workspaces */}
        <WorkspaceSection collapsed={collapsed} />

        {/* Subtle separator between sections */}
        <div
          className="my-2 mx-3 h-px bg-[var(--border-subtle)]"
          aria-hidden="true"
        />

        {/* Navigation */}
        <nav aria-label="Navigation" className="flex flex-col">

          {!collapsed && (
            <div className="px-3 mb-1.5 h-6 flex items-center">
              <span className="text-[10px] font-[var(--weight-semibold)] text-[var(--text-muted)] uppercase tracking-[0.08em]">
                Navigate
              </span>
            </div>
          )}

          <div className={[
            "flex flex-col",
            collapsed ? "px-1.5 gap-1" : "pr-2 gap-0.5",
          ].join(" ")}>
            {NAV_ITEMS.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                collapsed={collapsed}
              />
            ))}
          </div>
        </nav>
      </div>

      {/* Footer — Settings + Collapse */}
      <div className="border-t border-[var(--border-subtle)] py-2 flex flex-col gap-1">
        <div className={collapsed ? "px-1.5" : "pr-2"}>
          <SidebarItem
            icon={<Settings size={15} strokeWidth={2} />}
            label="Settings"
            path="/settings"
            collapsed={collapsed}
          />
        </div>

        <div className={collapsed ? "px-1.5" : "pr-2"}>
          <Tooltip
            content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            side="right"
          >
            <button
              onClick={() => onCollapsedChange(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={[
                "w-full flex items-center",
                collapsed ? "justify-center h-9" : "gap-2.5 h-8 pl-3",
                "rounded-[var(--radius-md)]",
                collapsed ? "" : "rounded-r-[var(--radius-md)]",
                "text-[var(--text-muted)] hover:text-[var(--text)]",
                "hover:bg-[var(--elevated)]",
                "text-[var(--text-xs)]",
                "orbit-no-select orbit-focus-ring",
                "transition-all duration-200 ease-out",
              ].join(" ")}
            >
              {collapsed ? (
                <ChevronRight size={14} strokeWidth={2} />
              ) : (
                <>
                  <span className="w-5 h-5 flex items-center justify-center">
                    <ChevronLeft size={13} strokeWidth={2} />
                  </span>
                  <span>Collapse</span>
                </>
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}