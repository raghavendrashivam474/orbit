/**
 * PageMetadata.ts
 * Sprint 6 — Page metadata contract.
 *
 * Note: real WebView-based metadata extraction is DEFERRED to a future
 * sprint (same platform limitation as Sprint 5.3B title resolution).
 * Sprint 6 ships the interface only; extraction updates Pages when
 * a MetadataExtractor implementation becomes available.
 */

export interface PageMetadata {
  url:          string;
  title:        string;
  hostname:     string;
  description:  string | null;
  faviconUrl:   string | null;
}

/**
 * Contract for future metadata extractors.
 * Not implemented in Sprint 6. Present for architectural clarity.
 */
export interface MetadataExtractor {
  /**
   * Extract metadata for a loaded page.
   * Implementations should not block or throw for missing metadata.
   */
  extract(tabId: string, url: string): Promise<PageMetadata | null>;
}