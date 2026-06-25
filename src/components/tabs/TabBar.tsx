import { TabComponent } from "./Tab";
import { NewTabButton } from "./NewTabButton";
import { useTabStore } from "@/store/tabStore";

export function TabBar(): React.JSX.Element {
  const { tabs } = useTabStore();

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
      {tabs.map((tab) => (
        <TabComponent key={tab.id} tab={tab} />
      ))}
      <NewTabButton />
    </div>
  );
}