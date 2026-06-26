//! repositories/history.rs
//! SQLite History Repository

use crate::database::DbPool;
use crate::models::history::HistoryEntry;
use uuid::Uuid;

pub struct SqliteHistoryRepository<'a> {
    pool: &'a DbPool,
}

impl<'a> SqliteHistoryRepository<'a> {
    pub fn new(pool: &'a DbPool) -> Self {
        Self { pool }
    }

    /// Add or update a history entry.
    /// If URL exists, increments visit count and updates timestamp.
    pub async fn upsert(&self, url: &str, title: &str) -> Result<(), String> {
        let existing: Option<String> = sqlx::query_scalar(
            "SELECT id FROM history WHERE url = ?"
        )
        .bind(url)
        .fetch_optional(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        if let Some(id) = existing {
            sqlx::query(
                "UPDATE history SET
                    title       = ?,
                    visited_at  = datetime('now'),
                    visit_count = visit_count + 1
                WHERE id = ?"
            )
            .bind(title)
            .bind(id)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        } else {
            let id = Uuid::new_v4().to_string();
            sqlx::query(
                "INSERT INTO history (id, url, title) VALUES (?, ?, ?)"
            )
            .bind(id)
            .bind(url)
            .bind(title)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        }

        Ok(())
    }

    /// Return recent history entries.
    pub async fn recent(&self, limit: i64) -> Result<Vec<HistoryEntry>, String> {
        sqlx::query_as::<_, HistoryEntry>(
            "SELECT * FROM history ORDER BY visited_at DESC LIMIT ?"
        )
        .bind(limit)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Search history by URL or title.
    pub async fn search(&self, query: &str) -> Result<Vec<HistoryEntry>, String> {
        let pattern = format!("%{query}%");
        sqlx::query_as::<_, HistoryEntry>(
            "SELECT * FROM history
             WHERE url LIKE ? OR title LIKE ?
             ORDER BY visited_at DESC
             LIMIT 50"
        )
        .bind(&pattern)
        .bind(&pattern)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Delete a history entry by ID.
    pub async fn delete(&self, id: &str) -> Result<(), String> {
        sqlx::query("DELETE FROM history WHERE id = ?")
            .bind(id)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        Ok(())
    }

    /// Clear all history.
    pub async fn clear(&self) -> Result<(), String> {
        sqlx::query("DELETE FROM history")
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        Ok(())
    }
}