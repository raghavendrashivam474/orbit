/**
 * normalizeUrl.ts
 * Sprint 6 — Conservative URL normalization for Page identity.
 *
 * Design rules (per Sprint 6 brief Section 8):
 *   - Lowercase protocol and hostname
 *   - Remove default ports (80 for http, 443 for https)
 *   - Strip trailing slash on root path only (empty path -> "/")
 *   - PRESERVE query parameters (they change page content)
 *   - PRESERVE fragments (they may address different content)
 *   - PRESERVE path case (case-sensitive on many servers)
 *
 * Do NOT be aggressive. Better to have two Pages for two variants
 * than to conflate two genuinely different pages into one identity.
 */

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    // Not a parseable URL — return the trimmed input lowercased for
    // best-effort dedup. Callers should generally pass valid URLs.
    return trimmed.toLowerCase();
  }

  // Protocol lowercased (URL parser does this already but be explicit)
  const protocol = url.protocol.toLowerCase();

  // Hostname lowercased (URL parser does this, be explicit)
  const hostname = url.hostname.toLowerCase();

  // Strip default ports
  let port = url.port;
  if (
    (protocol === "http:"  && port === "80") ||
    (protocol === "https:" && port === "443")
  ) {
    port = "";
  }

  // Normalize root path: empty path becomes "/"
  let pathname = url.pathname || "/";
  if (pathname === "") pathname = "/";

  const authority = port ? `${hostname}:${port}` : hostname;
  const search    = url.search   ?? "";
  const hash      = url.hash     ?? "";

  return `${protocol}//${authority}${pathname}${search}${hash}`;
}

/**
 * Extract the hostname from a URL. Returns empty string on parse failure.
 */
export function extractHostname(input: string): string {
  try {
    return new URL(input).hostname.toLowerCase();
  } catch {
    return "";
  }
}