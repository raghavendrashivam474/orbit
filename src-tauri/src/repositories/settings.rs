//! repositories/settings.rs
//! SQLite Settings Repository

use crate::database::DbPool;

pub struct SqliteSettingsRepository<'a> {
    pool: &'a DbPool,
}

impl<'a> SqliteSettingsRepository<'a> {
    pub fn new(pool: &'a DbPool) -> Self {
        Self { pool }
    }

    /// Get a settings value by key.
    pub async fn get(&self, key: &str) -> Result<Option<String>, String> {
        let row: Option<(String,)> = sqlx::query_as(
            "SELECT value FROM settings WHERE key = ?"
        )
        .bind(key)
        .fetch_optional(self.pool)
        .await
        .map_err(|e| e.to_string())?;
        Ok(row.map(|(v,)| v))
    }

    /// Set a settings value.
    pub async fn set(&self, key: &str, value: &str) -> Result<(), String> {
        sqlx::query(
            "INSERT INTO settings (key, value, updated_at)
             VALUES (?, ?, datetime('now'))
             ON CONFLICT(key) DO UPDATE SET
                value      = excluded.value,
                updated_at = datetime('now')"
        )
        .bind(key)
        .bind(value)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;
        Ok(())
    }

    /// Get all settings as key-value pairs.
    pub async fn all(&self) -> Result<Vec<(String, String)>, String> {
        let rows: Vec<(String, String)> = sqlx::query_as(
            "SELECT key, value FROM settings"
        )
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())?;
        Ok(rows)
    }
}