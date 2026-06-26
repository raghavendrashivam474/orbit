/**
 * TabBar.tsx
 * Orbit Tab Bar - Sprint 5: Workspace-aware
 *
 * Only renders tabs belonging to the active workspace.
 */

import { TabComponent } from "./Tab";
import { NewTabButton } from "./NewTabButton";
import { useTabStore } from "@/store/tabStore";
import { useWorkspaceStore } from "@/store/workspaceStore";

export function TabBar(): React.JSX.Element {
  const { tabs } = useTabStore();
  const { activeWorkspaceId } = useWorkspaceStore();

  // Filter to only show tabs from active workspace
  const visibleTabs = activeWorkspaceId
    ? tabs.filter((t) => t.workspaceId === activeWorkspaceId)
    : tabs;

  return (
    <div
      role="tablist"
      aria-label="Browser tabs"
      className={[
        "flex items-center",
        "h-[var(--tabbar-height)] min-h-[var(--tabbar-height)]",
        "bg-[var(--surface)] border-b border-[var(--border)]",
        "orbit-no-select overflow-x-auto orbit-scrollbar",
      ].join(" ")}
    >
      {visibleTabs.map((tab) => (
        <TabComponent key={tab.id} tab={tab} />
      ))}
      <NewTabButton />
    </div>
  );
}