/**
 * BrowserError.tsx
 * Friendly error page shown when navigation fails.
 */

import type { BrowserError as BrowserErrorType } from "@/browser/BrowserTypes";
import { WifiOff, RefreshCw } from "lucide-react";
import { browserFacade } from "@/browser/BrowserFacade";

interface BrowserErrorProps {
  error: BrowserErrorType;
}

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  INVALID_URL: {
    title:       "Invalid Address",
    description: "The address you entered is not valid. Check for typos and try again.",
  },
  CONNECTION_FAILED: {
    title:       "Cannot Connect",
    description: "Orbit could not connect to this site. Check your internet connection.",
  },
  DNS_FAILURE: {
    title:       "Site Not Found",
    description: "The domain could not be resolved. The site may not exist.",
  },
  TIMEOUT: {
    title:       "Connection Timed Out",
    description: "The site took too long to respond. Try again in a moment.",
  },
  UNKNOWN: {
    title:       "Something Went Wrong",
    description: "An unexpected error occurred while loading this page.",
  },
};

export function BrowserError({ error }: BrowserErrorProps): React.JSX.Element {
  const info = ERROR_MESSAGES[error.code] ?? ERROR_MESSAGES["UNKNOWN"]!;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-8 animate-fade-in">
      <div className="w-16 h-16 rounded-[var(--radius-xl)] bg-[var(--elevated)] flex items-center justify-center">
        <WifiOff size={28} strokeWidth={1.5} className="text-[var(--text-muted)]" />
      </div>

      <div className="text-center max-w-md">
        <h1 className="text-[var(--text-xl)] font-[var(--weight-semibold)] text-[var(--text)] mb-2">
          {info.title}
        </h1>
        <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mb-1">
          {info.description}
        </p>
        <p className="text-[var(--text-xs)] text-[var(--text-muted)] font-mono">
          {error.url}
        </p>
      </div>

      <button
        onClick={() => browserFacade.reload()}
        className={[
          "flex items-center gap-2 px-4 py-2",
          "rounded-[var(--radius-md)]",
          "bg-[var(--elevated)] border border-[var(--border)]",
          "text-[var(--text-sm)] text-[var(--text-secondary)]",
          "hover:border-[var(--accent)] hover:text-[var(--text)]",
          "transition-all duration-[var(--duration-normal)]",
          "orbit-focus-ring",
        ].join(" ")}
      >
        <RefreshCw size={14} strokeWidth={2} />
        Try Again
      </button>
    </div>
  );
}