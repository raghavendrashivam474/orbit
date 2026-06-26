//! models/history.rs
//! History data model.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct HistoryEntry {
    pub id:          String,
    pub url:         String,
    pub title:       String,
    pub visited_at:  String,
    pub visit_count: i64,
}