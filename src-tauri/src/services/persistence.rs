//! services/persistence.rs
//! Orbit Persistence Service
//!
//! Coordinates all persistence operations.
//! Acts as the single point of contact between
//! Tauri command handlers and the repository layer.
//!
//! No SQL exists in this file.
//! Business logic lives here; SQL lives in repositories.

use crate::database::DbPool;
use crate::models::{
    bookmark::BookmarkEntry,
    history::HistoryEntry,
    session::FullSession,
};
use crate::repositories::{
    bookmark::SqliteBookmarkRepository,
    history::SqliteHistoryRepository,
    session::{SqliteSessionRepository, TabToSave},
    settings::SqliteSettingsRepository,
};

pub struct PersistenceService {
    pool: DbPool,
}

impl PersistenceService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    // â”€â”€ History â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    pub async fn record_navigation(&self, url: &str, title: &str) -> Result<(), String> {
        // Do not record blank pages or internal pages
        if url.is_empty() || url == "about:blank" {
            return Ok(());
        }
        let repo = SqliteHistoryRepository::new(&self.pool);
        repo.upsert(url, title).await
    }

    pub async fn get_recent_history(&self, limit: i64) -> Result<Vec<HistoryEntry>, String> {
        let repo = SqliteHistoryRepository::new(&self.pool);
        repo.recent(limit).await
    }

    pub async fn search_history(&self, query: &str) -> Result<Vec<HistoryEntry>, String> {
        let repo = SqliteHistoryRepository::new(&self.pool);
        repo.search(query).await
    }

    pub async fn delete_history_entry(&self, id: &str) -> Result<(), String> {
        let repo = SqliteHistoryRepository::new(&self.pool);
        repo.delete(id).await
    }

    pub async fn clear_history(&self) -> Result<(), String> {
        let repo = SqliteHistoryRepository::new(&self.pool);
        repo.clear().await
    }

    // â”€â”€ Bookmarks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    pub async fn add_bookmark(&self, url: &str, title: &str) -> Result<BookmarkEntry, String> {
        let repo = SqliteBookmarkRepository::new(&self.pool);
        repo.add(url, title).await
    }

    pub async fn get_all_bookmarks(&self) -> Result<Vec<BookmarkEntry>, String> {
        let repo = SqliteBookmarkRepository::new(&self.pool);
        repo.all().await
    }

    pub async fn search_bookmarks(&self, query: &str) -> Result<Vec<BookmarkEntry>, String> {
        let repo = SqliteBookmarkRepository::new(&self.pool);
        repo.search(query).await
    }

    pub async fn is_bookmarked(&self, url: &str) -> Result<bool, String> {
        let repo = SqliteBookmarkRepository::new(&self.pool);
        repo.is_bookmarked(url).await
    }

    pub async fn update_bookmark_title(&self, id: &str, title: &str) -> Result<(), String> {
        let repo = SqliteBookmarkRepository::new(&self.pool);
        repo.update_title(id, title).await
    }

    pub async fn delete_bookmark(&self, id: &str) -> Result<(), String> {
        let repo = SqliteBookmarkRepository::new(&self.pool);
        repo.delete(id).await
    }

    pub async fn delete_bookmark_by_url(&self, url: &str) -> Result<(), String> {
        let repo = SqliteBookmarkRepository::new(&self.pool);
        repo.delete_by_url(url).await
    }

    // â”€â”€ Sessions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    pub async fn save_session(
        &self,
        active_tab: &str,
        tabs: Vec<TabToSave>,
    ) -> Result<String, String> {
        let repo = SqliteSessionRepository::new(&self.pool);
        repo.save(active_tab, tabs).await
    }

    pub async fn load_latest_session(&self) -> Result<Option<FullSession>, String> {
        let repo = SqliteSessionRepository::new(&self.pool);
        repo.load_latest().await
    }

    // â”€â”€ Settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    pub async fn get_setting(&self, key: &str) -> Result<Option<String>, String> {
        let repo = SqliteSettingsRepository::new(&self.pool);
        repo.get(key).await
    }

    pub async fn set_setting(&self, key: &str, value: &str) -> Result<(), String> {
        let repo = SqliteSettingsRepository::new(&self.pool);
        repo.set(key, value).await
    }

    pub async fn get_all_settings(&self) -> Result<Vec<(String, String)>, String> {
        let repo = SqliteSettingsRepository::new(&self.pool);
        repo.all().await
    }
}