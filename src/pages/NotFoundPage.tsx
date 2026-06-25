import { useNavigate } from "react-router-dom";

export function NotFoundPage(): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Page Not Found</h1>
      <button
        onClick={() => navigate("/")}
        className="text-sm underline underline-offset-4"
      >
        Return home
      </button>
    </div>
  );
}
