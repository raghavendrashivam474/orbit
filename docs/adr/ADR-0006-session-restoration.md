# ADR-0006 - Session Restoration

Status: Accepted
Date: 2026-06-26
Sprint: 4 - Persistence Layer

## Decision

Orbit saves the current session on application close
and restores it on next startup when the user preference is enabled.

## What Constitutes a Session

A session captures:
- All open tabs (tab_id, url, title, position)
- The active tab ID
- The save timestamp

A session does not capture:
- Browser history within tabs (forward/back stack)
- Page scroll position
- Form state
- Authentication cookies

## Save Behavior

Session is saved:
- On window beforeunload event
- One session record is kept at a time (previous is replaced)

## Restore Behavior

On startup:
1. Check the restore_session setting (default: true)
2. Load the latest session from SQLite
3. If session exists and restore is enabled, open tabs from saved state
4. If session is empty or restore is disabled, open a single new tab

## Failure Handling

If session restore fails for any reason:
- Log the error
- Open a single new tab
- Do not crash the application
- Session errors are non-fatal

## Future Workspace Integration

Sprint 5 will introduce workspaces.
A workspace may own multiple sessions.
The session model is designed to be extended:
- Add workspace_id foreign key to sessions table
- No breaking changes to existing session logic

## Review Conditions

Revisit when:
- Workspaces are introduced (Sprint 5)
- Cloud sync is introduced
- Multi-profile support is added