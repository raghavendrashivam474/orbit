/**
 * context/index.ts
 * Sprint 6 -- Context Engine public API.
 *
 * Usage:
 *   import { ContextCaptureService, ContextQueryService } from "@/context";
 */

export { ContextCaptureService } from "./services/ContextCaptureService";
export { ContextQueryService } from "./services/ContextQueryService";

export type { Page } from "./models/Page";
export type { PageVisit, NavigationSource } from "./models/PageVisit";
export type { PageMetadata, MetadataExtractor } from "./models/PageMetadata";
export type { ContextTimelineGroup, ContextTimelineItem } from "./services/ContextQueryService";

export { normalizeUrl, extractHostname } from "./url/normalizeUrl";