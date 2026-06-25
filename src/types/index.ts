export interface AppVersion {
  major: number;
  minor: number;
  patch: number;
}

export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };
