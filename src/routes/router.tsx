import { createBrowserRouter } from "react-router-dom";
import { ShellLayout } from "@/components/shell/ShellLayout";
import { HomePage } from "@/pages/home/HomePage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { WorkspacesPage } from "@/pages/workspaces/WorkspacesPage";
import { HistoryPage } from "@/pages/history/HistoryPage";
import { BookmarksPage } from "@/pages/bookmarks/BookmarksPage";
import { DownloadsPage } from "@/pages/downloads/DownloadsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function EmptyBrowserPage(): React.JSX.Element {
  return <div className="h-full w-full" />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "browse", element: <EmptyBrowserPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "workspaces", element: <WorkspacesPage /> },
      { path: "history", element: <HistoryPage /> },
      { path: "bookmarks", element: <BookmarksPage /> },
      { path: "downloads", element: <DownloadsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);