/**
 * PageRepository.ts
 * Sprint 6 — Thin IPC wrapper for Page operations.
 * All SQL lives in Rust (context/repository.rs).
 */

import { invoke } from "@/core/ipc/bridge";
import type { Page } from "@/context/models/Page";

// Rust-side shape (snake_case fields)
interface RustPage {
  id:              string;
  url:             string;
  normalized_url:  string;
  title:           string;
  hostname:        string;
  description:     string | null;
  favicon_url:     string | null;
  first_seen_at:   string;
  last_seen_at:    string;
}

function mapPage(r: RustPage): Page {
  return {
    id:            r.id,
    url:           r.url,
    normalizedUrl: r.normalized_url,
    title:         r.title,
    hostname:      r.hostname,
    description:   r.description,
    faviconUrl:    r.favicon_url,
    firstSeenAt:   r.first_seen_at,
    lastSeenAt:    r.last_seen_at,
  };
}

export const PageRepository = {
  async recentInWorkspace(workspaceId: string, limit = 20): Promise<Page[]> {
    const raw = await invoke<RustPage[]>("context_recent_workspace_pages", {
      workspaceId,
      limit,
    });
    return raw.map(mapPage);
  },

  async inWorkspace(workspaceId: string): Promise<Page[]> {
    const raw = await invoke<RustPage[]>("context_workspace_pages", {
      workspaceId,
    });
    return raw.map(mapPage);
  },

  async search(query: string, workspaceId?: string, limit = 30): Promise<Page[]> {
    const raw = await invoke<RustPage[]>("context_search_pages", {
      query,
      workspaceId: workspaceId ?? null,
      limit,
    });
    return raw.map(mapPage);
  },

  async updateMetadata(
    normalizedUrl: string,
    fields: { title?: string; description?: string | null; faviconUrl?: string | null }
  ): Promise<Page | null> {
    const raw = await invoke<RustPage | null>("context_update_page_metadata", {
      input: {
        normalized_url: normalizedUrl,
        title:          fields.title       ?? null,
        description:    fields.description  ?? null,
        favicon_url:    fields.faviconUrl   ?? null,
      },
    });
    return raw ? mapPage(raw) : null;
  },
};