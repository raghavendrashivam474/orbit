export function formatVersion(version: {
  major: number;
  minor: number;
  patch: number;
}): string {
  return `${version.major}.${version.minor}.${version.patch}`;
}

export function isTauriEnvironment(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}
