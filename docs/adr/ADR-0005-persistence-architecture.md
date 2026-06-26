# ADR-0005 - Persistence Architecture

Status: Accepted
Date: 2026-06-26
Sprint: 4 - Persistence Layer

## Decision

Rust owns all persistence. SQLite is accessed exclusively from Rust via sqlx.
The TypeScript layer never executes SQL.

## Architecture Stack

    React Component
        down
    Zustand Store
        down
    TypeScript Repository (IPC wrapper only)
        down
    Tauri IPC
        down
    Rust PersistenceService
        down
    Rust Repository (owns SQL)
        down
    sqlx
        down
    SQLite

## Why Rust-Side SQLite

1. SQL never touches the frontend layer.
2. Compile-time query validation via sqlx macros.
3. Strong typing across the full stack.
4. Better security - queries are not constructable from the frontend.
5. Natural path to future encryption and RaghavOS sync.
6. Consistent with the ownership model established in ADR-0003.

## Repository Trait Principle

Repositories are implemented as structs today.
Future versions may introduce traits to allow:
- SqliteHistoryRepository
- EncryptedHistoryRepository
- CloudHistoryRepository

## Migration Philosophy

Orbit never recreates the database. It only migrates.
Migrations are numbered and applied exactly once.
The _migrations table tracks applied versions.

## Engineering Rules

Rule 1: No SQL in UI components.
Rule 2: No SQL in BrowserFacade.
Rule 3: Repositories own SQL exclusively.
Rule 4: PersistenceService coordinates repositories.
Rule 5: BrowserFacade emits events. PersistenceService listens.

## Consequences

- React never knows SQLite exists.
- All persistence changes require Rust code changes.
- TypeScript repositories are thin IPC wrappers only.
- The persistence layer is independently testable.
- Future workspace and AI features inherit this foundation.