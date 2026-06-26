//! models/session.rs
//! Session and tab data models.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct SessionEntry {
    pub id:         String,
    pub saved_at:   String,
    pub active_tab: String,
    pub tab_count:  i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct SessionTabEntry {
    pub id:         String,
    pub session_id: String,
    pub tab_id:     String,
    pub url:        String,
    pub title:      String,
    pub position:   i64,
}

/// Full session with all tabs. Used for session restore.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FullSession {
    pub session:    SessionEntry,
    pub tabs:       Vec<SessionTabEntry>,
}