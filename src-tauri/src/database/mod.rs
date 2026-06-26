//! database/mod.rs
//! Orbit Database Connection Manager
//!
//! Owns the SQLite connection pool.
//! Runs migrations on startup.
//! All repositories receive a pool reference.

use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::path::PathBuf;

pub type DbPool = SqlitePool;

/// Initialize the database.
/// Creates the database file if it does not exist.
/// Runs all pending migrations.
pub async fn initialize(db_path: PathBuf) -> Result<DbPool, String> {
    // Ensure parent directory exists
    if let Some(parent) = db_path.parent() {
        std::fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create db directory: {e}"))?;
    }

    let db_url = format!(
        "sqlite://{}?mode=rwc",
        db_path.to_str().unwrap_or("orbit.db")
    );

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .map_err(|e| format!("Failed to connect to database: {e}"))?;

    // Run migrations
    run_migrations(&pool).await?;

    println!("[Orbit] Database initialized at {}", db_path.display());

    Ok(pool)
}

/// Run SQL migration files in order.
async fn run_migrations(pool: &DbPool) -> Result<(), String> {
    // Create migrations table if not exists
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS _migrations (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            version    INTEGER NOT NULL UNIQUE,
            name       TEXT    NOT NULL,
            applied_at TEXT    NOT NULL DEFAULT (datetime('now'))
        )"
    )
    .execute(pool)
    .await
    .map_err(|e| format!("Failed to create migrations table: {e}"))?;

    let migrations: &[(&str, i64, &str)] = &[
        (include_str!("../../migrations/0001_initial.sql"),   1, "initial"),
        (include_str!("../../migrations/0002_history.sql"),   2, "history"),
        (include_str!("../../migrations/0003_bookmarks.sql"), 3, "bookmarks"),
        (include_str!("../../migrations/0004_sessions.sql"),  4, "sessions"),
        (include_str!("../../migrations/0005_settings.sql"),  5, "settings"),
    ];

    for (sql, version, name) in migrations {
        let already_applied: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM _migrations WHERE version = ?)"
        )
        .bind(version)
        .fetch_one(pool)
        .await
        .map_err(|e| format!("Migration check failed: {e}"))?;

        if already_applied {
            continue;
        }

        // Execute migration SQL
        for statement in sql.split(';') {
            let stmt = statement.trim();
            if stmt.is_empty() { continue; }
            sqlx::query(stmt)
                .execute(pool)
                .await
                .map_err(|e| format!("Migration {version} ({name}) failed: {e}"))?;
        }

        sqlx::query(
            "INSERT INTO _migrations (version, name) VALUES (?, ?)"
        )
        .bind(version)
        .bind(name)
        .execute(pool)
        .await
        .map_err(|e| format!("Failed to record migration {version}: {e}"))?;

        println!("[Orbit] Migration {version} ({name}) applied.");
    }

    Ok(())
}