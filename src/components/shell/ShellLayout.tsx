import { Outlet } from "react-router-dom";

export function ShellLayout(): React.JSX.Element {
  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
