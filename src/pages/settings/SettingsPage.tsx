/**
 * SettingsPage.tsx
 * Orbit Settings - Sprint 4: Persistent settings via SQLite.
 */

import { Sun, Moon, Monitor } from "lucide-react";
import { useSettingsStore, type Theme } from "@/store/settingsStore";

const THEME_OPTIONS: { value: Theme; label: string; icon: React.JSX.Element }[] = [
  { value: "dark",   label: "Dark",   icon: <Moon size={15} strokeWidth={2} /> },
  { value: "light",  label: "Light",  icon: <Sun size={15} strokeWidth={2} /> },
  { value: "system", label: "System", icon: <Monitor size={15} strokeWidth={2} /> },
];

export function SettingsPage(): React.JSX.Element {
  const { theme, setTheme, restoreSession, setRestoreSession } = useSettingsStore();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fade-in">
      <h1 className="text-[var(--text-xl)] font-[var(--weight-semibold)] text-[var(--text)] mb-1">
        Settings
      </h1>
      <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mb-8">
        Manage your Orbit preferences.
      </p>

      {/* Appearance */}
      <section className="mb-8">
        <h2 className="text-[var(--text-base)] font-[var(--weight-semibold)] text-[var(--text)] mb-1">
          Appearance
        </h2>
        <p className="text-[var(--text-sm)] text-[var(--text-secondary)] mb-4">
          Choose how Orbit looks on your device.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setTheme(option.value).catch(console.warn)}
              aria-pressed={theme === option.value}
              className={[
                "flex flex-col items-center gap-3 p-4",
                "rounded-[var(--radius-md)] border",
                "orbit-no-select orbit-focus-ring",
                "transition-all duration-[var(--duration-normal)]",
                theme === option.value
                  ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--elevated)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text)]",
              ].join(" ")}
            >
              {option.icon}
              <span className="text-[var(--text-sm)] font-[var(--weight-medium)]">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Session */}
      <section className="mb-8">
        <h2 className="text-[var(--text-base)] font-[var(--weight-semibold)] text-[var(--text)] mb-4">
          Session
        </h2>
        <div className="orbit-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-sm)] text-[var(--text)] font-[var(--weight-medium)]">
                Restore previous session
              </p>
              <p className="text-[var(--text-xs)] text-[var(--text-secondary)] mt-0.5">
                Reopen tabs from your last session on startup.
              </p>
            </div>
            <button
              onClick={() => setRestoreSession(!restoreSession).catch(console.warn)}
              aria-pressed={restoreSession}
              className={[
                "relative w-10 h-5 rounded-full transition-colors duration-[var(--duration-normal)]",
                restoreSession ? "bg-[var(--accent)]" : "bg-[var(--border)]",
              ].join(" ")}
            >
              <span className={[
                "absolute top-0.5 w-4 h-4 rounded-full bg-white",
                "transition-transform duration-[var(--duration-normal)]",
                restoreSession ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")} />
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="text-[var(--text-base)] font-[var(--weight-semibold)] text-[var(--text)] mb-4">
          About
        </h2>
        <div className="orbit-panel p-4 space-y-2">
          {[
            ["Version",     "0.4.0"],
            ["Sprint",      "4 - Persistence Layer"],
            ["Platform",    "Windows"],
            ["Engine",      "Tauri v2 + Rust"],
            ["Storage",     "SQLite via sqlx"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[var(--text-sm)] text-[var(--text-secondary)]">{label}</span>
              <span className="text-[var(--text-sm)] text-[var(--text)] font-[var(--weight-medium)]">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}