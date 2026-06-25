import { trace, debug, info, warn, error } from "@tauri-apps/plugin-log";

export const logger = {
  trace: (message: string): Promise<void> => trace(message),
  debug: (message: string): Promise<void> => debug(message),
  info:  (message: string): Promise<void> => info(message),
  warn:  (message: string): Promise<void> => warn(message),
  error: (message: string): Promise<void> => error(message),
} as const;
