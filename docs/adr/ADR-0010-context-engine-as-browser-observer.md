# ADR-0010 - Context Engine as Browser Observer

Status: Accepted
Date: 2026-07-12
Sprint: 6 - Context Engine Foundation

## Context

The Context Engine must capture browsing activity to build
structured context. This requires access to navigation events.

The existing NavigationObserver contract (Sprint 5.3) provides
exactly this access without coupling the Context Engine to
the browser lifecycle.

## Decision

The Context Engine observes the Browser. It does not control it.

Dependency direction:

    Browser Layer
          |
          v
    NavigationObserver contract
          |
          v
    ContextCaptureService
          |
          v
    Context persistence (Pages + PageVisits)

The Context Engine NEVER:
  - Initiates navigation
  - Controls WebView lifecycle
  - Modifies tab state
  - Blocks browser rendering

## Integration

ContextCaptureService implements NavigationObserver.
It subscribes to WebviewSync via WebviewSync.subscribe().
It is started in ShellLayout alongside PersistenceService.

Flow on every navigation:
  1. WebviewSync notifies all observers
  2. PersistenceService records to history (existing)
  3. ContextCaptureService:
     a. Normalizes URL
     b. Resolves or creates Page
     c. Records PageVisit with workspace context

## Non-blocking guarantee

Context capture uses fire-and-forget Promises.
Failures are logged but never thrown.
Navigation speed is unaffected by context persistence.

## Future consumers

    ContextQueryService
      read by:
        - Command palette
        - Timeline UI
        - Workspace history projection
        - Future AI memory
        - RaghavOS integration

All consumers go through ContextQueryService.
None bypass it to access repositories directly.

## Consequences

- Context Engine has no way to break browser functionality
- Context Engine can be disabled without affecting browsing
- Multiple observers can coexist on the same NavigationObserver
- Future metadata extraction (Sprint 5.3B) will update Pages
  through ContextCaptureService without creating new PageVisits