import { Clock } from "lucide-react";

export function HistoryPage(): React.JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 animate-fade-in">
      <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[var(--elevated)] flex items-center justify-center">
        <Clock size={24} strokeWidth={1.5} className="text-[var(--text-muted)]" />
      </div>
      <h1 className="text-[var(--text-xl)] font-[var(--weight-semibold)] text-[var(--text)]">
        History
      </h1>
      <p className="text-[var(--text-sm)] text-[var(--text-secondary)]">
        Coming in a future sprint.
      </p>
    </div>
  );
}