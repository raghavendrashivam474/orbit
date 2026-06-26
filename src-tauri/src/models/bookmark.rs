//! models/bookmark.rs
//! Bookmark data model.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct BookmarkEntry {
    pub id:         String,
    pub url:        String,
    pub title:      String,
    pub created_at: String,
    pub updated_at: String,
}