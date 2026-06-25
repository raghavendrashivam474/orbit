/**
 * BrowserTypes.ts
 * Orbit Browser Layer - Shared Type Definitions
 *
 * All types shared across the browser abstraction layer.
 * No Tauri-specific types should appear here.
 */

/** The state of a single browser tab. */
export interface TabBrowserState {
  /** The currently loaded or loading URL. */
  url: string;

  /** The resolved page title. Empty string while loading. */
  title: string;

  /** Whether the tab is currently loading. */
  isLoading: boolean;

  /** Navigation progress 0.0 to 1.0. */
  progress: number;

  /** Whether backward navigation is available. */
  canGoBack: boolean;

  /** Whether forward navigation is available. */
  canGoForward: boolean;

  /** Error state. Null when no error. */
  error: BrowserError | null;
}

/** Describes a browser-level error. */
export interface BrowserError {
  code: BrowserErrorCode;
  message: string;
  url: string;
}

/** Known browser error categories. */
export type BrowserErrorCode =
  | "INVALID_URL"
  | "CONNECTION_FAILED"
  | "DNS_FAILURE"
  | "TIMEOUT"
  | "UNKNOWN";

/** Result of a URL resolution operation. */
export type ResolvedUrl =
  | { type: "url";    href: string }
  | { type: "search"; href: string; query: string };

/** Browser navigation direction. */
export type NavigationDirection = "back" | "forward";

/** Initial state factory. */
export function createTabBrowserState(url = ""): TabBrowserState {
  return {
    url,
    title:        url ? "Loading..." : "New Tab",
    isLoading:    false,
    progress:     0,
    canGoBack:    false,
    canGoForward: false,
    error:        null,
  };
}