# ADR-0008 - Workspace Isolation

Status: Accepted
Date: 2026-06-26
Sprint: 5 - Workspace Engine

## Decision

Workspace is the isolation boundary for all user data.
Nothing leaks between workspaces unless explicitly shared.

## Ownership Model

    Workspace
      owns: Tabs
      owns: History (future)
      owns: Bookmarks (future)
      owns: Collections (future)
      owns: Notes (future)
      owns: AI Memory (future)

## Current Sprint 5 Isolation

Tabs are workspace-scoped via workspaceId field.
Each workspace saves and restores its own tab set independently.
Switching workspaces destroys all renderers and rebuilds from saved state.

## Future Isolation

When history becomes workspace-scoped:
  Add workspace_id to history table via migration.
  History queries filter by active workspace.

When bookmarks become workspace-scoped:
  Add workspace_id to bookmarks table via migration.
  Option to mark a bookmark as global (shared across workspaces).

## Shared Resources

Some resources may remain global by design:
  - Application settings (theme, sidebar state)
  - Global search index (future)

This is a deliberate choice, not an oversight.

## Renderer Isolation

Renderers exist only for the active workspace.
Inactive workspace tabs preserve metadata only (URL, title).
This keeps memory usage proportional to the active workspace.

## Migration Strategy

Every new domain that joins a workspace adds a workspace_id
foreign key to its table via a numbered migration.
No existing tables are modified destructively.

## Review Conditions

Revisit when:
- Workspace sharing is introduced
- Multi-user support is considered
- Cloud sync affects isolation boundaries