//! repositories/bookmark.rs
//! SQLite Bookmark Repository

use crate::database::DbPool;
use crate::models::bookmark::BookmarkEntry;
use uuid::Uuid;

pub struct SqliteBookmarkRepository<'a> {
    pool: &'a DbPool,
}

impl<'a> SqliteBookmarkRepository<'a> {
    pub fn new(pool: &'a DbPool) -> Self {
        Self { pool }
    }

    /// Add a new bookmark.
    pub async fn add(&self, url: &str, title: &str) -> Result<BookmarkEntry, String> {
        let id = Uuid::new_v4().to_string();
        sqlx::query(
            "INSERT INTO bookmarks (id, url, title) VALUES (?, ?, ?)"
        )
        .bind(&id)
        .bind(url)
        .bind(title)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        self.find_by_id(&id).await?
            .ok_or_else(|| "Bookmark not found after insert".to_string())
    }

    /// Find a bookmark by ID.
    pub async fn find_by_id(&self, id: &str) -> Result<Option<BookmarkEntry>, String> {
        sqlx::query_as::<_, BookmarkEntry>(
            "SELECT * FROM bookmarks WHERE id = ?"
        )
        .bind(id)
        .fetch_optional(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Check if a URL is already bookmarked.
    pub async fn is_bookmarked(&self, url: &str) -> Result<bool, String> {
        let count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM bookmarks WHERE url = ?"
        )
        .bind(url)
        .fetch_one(self.pool)
        .await
        .map_err(|e| e.to_string())?;
        Ok(count > 0)
    }

    /// Return all bookmarks ordered by creation date.
    pub async fn all(&self) -> Result<Vec<BookmarkEntry>, String> {
        sqlx::query_as::<_, BookmarkEntry>(
            "SELECT * FROM bookmarks ORDER BY created_at DESC"
        )
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Search bookmarks by URL or title.
    pub async fn search(&self, query: &str) -> Result<Vec<BookmarkEntry>, String> {
        let pattern = format!("%{query}%");
        sqlx::query_as::<_, BookmarkEntry>(
            "SELECT * FROM bookmarks
             WHERE url LIKE ? OR title LIKE ?
             ORDER BY created_at DESC"
        )
        .bind(&pattern)
        .bind(&pattern)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Update bookmark title.
    pub async fn update_title(&self, id: &str, title: &str) -> Result<(), String> {
        sqlx::query(
            "UPDATE bookmarks SET title = ?, updated_at = datetime('now') WHERE id = ?"
        )
        .bind(title)
        .bind(id)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;
        Ok(())
    }

    /// Delete a bookmark.
    pub async fn delete(&self, id: &str) -> Result<(), String> {
        sqlx::query("DELETE FROM bookmarks WHERE id = ?")
            .bind(id)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        Ok(())
    }

    /// Delete bookmark by URL.
    pub async fn delete_by_url(&self, url: &str) -> Result<(), String> {
        sqlx::query("DELETE FROM bookmarks WHERE url = ?")
            .bind(url)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        Ok(())
    }
}