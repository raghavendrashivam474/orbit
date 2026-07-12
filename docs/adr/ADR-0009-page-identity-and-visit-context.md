# ADR-0009 - Page Identity and Visit Context

Status: Accepted
Date: 2026-07-12
Sprint: 6 - Context Engine Foundation

## Context

Orbit needs to structure browsing activity into queryable context.
The same web page may be opened multiple times across multiple
workspaces and sessions. The system must distinguish between
a page (a durable identity) and a visit (a contextual event).

## Decision

Page is global. PageVisit owns workspace context.

    Page
      - id (UUID with page- prefix)
      - url (original URL)
      - normalized_url (UNIQUE, used for identity resolution)
      - title, hostname, description, favicon_url
      - first_seen_at, last_seen_at

    PageVisit
      - id (UUID with visit- prefix)
      - page_id (references pages.id)
      - workspace_id (the workspace where the visit occurred)
      - tab_id (optional)
      - visited_at
      - source (address_bar, shortcut, history, bookmark, restored, unknown)

Relationship:

    Workspace --1..* -- PageVisit --*..1-- Page

A Page is never owned by a single workspace.
A PageVisit is always scoped to exactly one workspace.

## URL Normalization

Page identity is resolved via normalized_url:
  - Protocol and hostname lowercased
  - Default ports removed
  - Root path normalized to /
  - Query parameters and fragments PRESERVED

Conservative normalization prevents conflating different content.

## Consequences

- Opening github.com 5 times creates 1 Page and 5 PageVisits
- Same page in 3 workspaces creates 1 Page and 3 PageVisits
- Timeline is derived from PageVisits (no separate timeline table)
- Workspace-scoped history is a query over PageVisits
- Search operates on Pages, optionally filtered by workspace via PageVisits
- Metadata updates affect the Page, not PageVisits
- Future AI memory, collections, and tags can reference Page IDs