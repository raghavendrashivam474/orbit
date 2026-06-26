# ADR-0007 - Workspace Architecture

Status: Accepted
Date: 2026-06-26
Sprint: 5 - Workspace Engine

## Decision

Workspace becomes the root aggregate in Orbit.
The shell no longer manages tabs directly.
WorkspaceFacade sits between the shell and BrowserFacade.

## Hierarchy

    Shell
      down
    WorkspaceFacade
      down
    BrowserFacade
      down
    Renderer

## Tab Ownership (Option C Refined)

Tabs carry a workspaceId field.
The global tab store indexes all tabs for fast lookup.
Workspace owns tabs logically.
Renderers exist only for the active workspace's tabs.

On workspace switch:
1. Save current workspace tabs to SQLite
2. Destroy all active renderers
3. Load new workspace tabs from SQLite
4. Create renderers for the new workspace
5. Continue browsing

## Default Workspace

On first launch with no workspaces in the database,
Orbit automatically creates:

    name:  Personal
    icon:  home emoji
    color: #3B82F6

This is Orbit's equivalent of the default desktop.

## Workspace Metadata

    id             - UUID with workspace- prefix
    name           - User-defined display name
    icon           - Emoji character
    iconType       - 'emoji' (future: lucide, svg, image)
    color          - Hex color from Orbit palette
    createdAt      - Creation timestamp
    updatedAt      - Last modification timestamp
    lastOpenedAt   - Last activation timestamp
    position       - Order in sidebar (for future drag-and-drop)
    isDefault      - True for the initial Personal workspace

## Consequences

- WorkspaceFacade is the only entry point for workspace operations
- BrowserFacade is never called directly by workspace-aware code
- Tab store carries workspaceId on every tab
- Inactive workspace tabs have no active renderer (memory efficiency)