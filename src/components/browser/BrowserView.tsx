import { useTabStore } from "@/store/tabStore";
import { BrowserLoading } from "./BrowserLoading";
import { NewTabPage } from "./NewTabPage";

interface BrowserViewProps {
  sidebarWidth: number;
}

export function BrowserView({ sidebarWidth }: BrowserViewProps): React.JSX.Element {
  const { getActiveTab } = useTabStore();
  const tab = getActiveTab();

  void sidebarWidth; // bounds handled by WebviewSync

  return (
    <div className="relative flex flex-col h-full w-full bg-[var(--bg)]">
      {tab?.isLoading && <BrowserLoading progress={0.5} />}

      {(!tab || !tab.url) && <NewTabPage />}
    </div>
  );
}