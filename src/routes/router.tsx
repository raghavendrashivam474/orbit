/**
 * routes/router.tsx
 * Orbit Client-Side Router
 *
 * Sprint 5.4.x:
 * "/" is no longer a shell page. It is the browser view.
 * NewTabPage (rendered inside BrowserView) is the home experience
 * for tabs with no URL. This eliminates the duplicate-home problem
 * that caused first-interaction loss on newly created tabs.
 */

import { createBrowserRouter } from "react-router-dom";
import { ShellLayout } from "@/components/shell/ShellLayout";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { WorkspacesPage } from "@/pages/workspaces/WorkspacesPage";
import { HistoryPage } from "@/pages/history/HistoryPage";
import { BookmarksPage } from "@/pages/bookmarks/BookmarksPage";
import { DownloadsPage } from "@/pages/downloads/DownloadsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Empty component for browser routes.
// The actual browser content is rendered by ShellLayout's BrowserView.
function BrowserRoute(): React.JSX.Element {
  return <div className="h-full w-full" />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellLayout />,
    children: [
      // The root path IS the browser. NewTabPage renders when the
      // active tab has no URL. No separate HomePage anymore.
      { index: true,       element: <BrowserRoute /> },
      { path: "browse",    element: <BrowserRoute /> },
      { path: "settings",  element: <SettingsPage /> },
      { path: "workspaces",element: <WorkspacesPage /> },
      { path: "history",   element: <HistoryPage /> },
      { path: "bookmarks", element: <BookmarksPage /> },
      { path: "downloads", element: <DownloadsPage /> },
      { path: "*",         element: <NotFoundPage /> },
    ],
  },
]);