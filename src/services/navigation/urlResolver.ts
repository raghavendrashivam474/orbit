/**
 * urlResolver.ts
 * Orbit Navigation Service - URL Resolution
 *
 * Resolves user input (text typed in the address bar)
 * into either a fully qualified URL or a search query URL.
 *
 * Rules:
 *   - If input looks like a URL, prepend https:// if needed
 *   - If input is a valid URL already, use it directly
 *   - Otherwise, treat as a Google search query
 */

import type { ResolvedUrl } from "@/browser/BrowserTypes";

const SEARCH_ENGINE = "https://www.google.com/search?q=";

/**
 * Returns true if the string looks like a hostname.
 * Examples: google.com, localhost, 192.168.1.1
 */
function looksLikeHostname(input: string): boolean {
  if (input.includes(" ")) return false;

  // Has a dot and a valid TLD-like segment
  const dotIndex = input.lastIndexOf(".");
  if (dotIndex > 0 && dotIndex < input.length - 1) return true;

  // localhost
  if (input === "localhost" || input.startsWith("localhost:")) return true;

  return false;
}

/**
 * Resolves user input to a navigable URL.
 *
 * @example
 *   resolveUrl("google.com")         -> { type: "url", href: "https://google.com" }
 *   resolveUrl("https://orbit.dev")  -> { type: "url", href: "https://orbit.dev" }
 *   resolveUrl("what is orbit")      -> { type: "search", href: "https://www.google.com/search?q=what+is+orbit" }
 */
export function resolveUrl(input: string): ResolvedUrl {
  const trimmed = input.trim();

  if (!trimmed) {
    return { type: "url", href: "about:blank" };
  }

  // Already a valid URL with protocol
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return { type: "url", href: trimmed };
    }
  } catch {
    // Not a valid URL â€” continue resolution
  }

  // Looks like a hostname â€” prepend https://
  if (looksLikeHostname(trimmed)) {
    return { type: "url", href: `https://${trimmed}` };
  }

  // Treat as search query
  const query = encodeURIComponent(trimmed);
  return {
    type:  "search",
    href:  `${SEARCH_ENGINE}${query}`,
    query: trimmed,
  };
}