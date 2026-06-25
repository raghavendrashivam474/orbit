import { createBrowserRouter } from "react-router-dom";
import { ShellLayout } from "@/components/shell/ShellLayout";
import { HomePage } from "@/pages/home/HomePage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ShellLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
