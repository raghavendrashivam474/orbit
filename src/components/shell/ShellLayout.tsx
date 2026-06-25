import { Outlet } from "react-router-dom";
import { TitleBar } from "./TitleBar";
import { TabBar } from "@/components/tabs/TabBar";
import { Toolbar } from "@/components/toolbar/Toolbar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export function ShellLayout(): React.JSX.Element {
  useTheme();
  useKeyboardShortcuts();

  return (
    <div className="flex flex-col h-full w-full bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      {/* Title Bar */}
      <TitleBar />

      {/* Tab Bar */}
      <TabBar />

      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-[var(--bg)] orbit-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}