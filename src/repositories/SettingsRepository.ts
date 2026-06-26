/**
 * SettingsRepository.ts
 * Orbit - TypeScript Settings Repository
 */

import { invoke } from "@/core/ipc/bridge";

export const SettingsRepository = {
  get: (key: string): Promise<string | null> =>
    invoke("settings_get", { key }),

  set: (key: string, value: string): Promise<void> =>
    invoke("settings_set", { key, value }),

  all: (): Promise<[string, string][]> =>
    invoke("settings_all"),
} as const;