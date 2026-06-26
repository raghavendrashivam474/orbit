//! repositories/session.rs
//! SQLite Session Repository

use crate::database::DbPool;
use crate::models::session::{FullSession, SessionEntry, SessionTabEntry};
use uuid::Uuid;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TabToSave {
    pub tab_id:   String,
    pub url:      String,
    pub title:    String,
    pub position: i64,
}

pub struct SqliteSessionRepository<'a> {
    pool: &'a DbPool,
}

impl<'a> SqliteSessionRepository<'a> {
    pub fn new(pool: &'a DbPool) -> Self {
        Self { pool }
    }

    /// Save the current session.
    /// Replaces any existing saved session.
    pub async fn save(
        &self,
        active_tab: &str,
        tabs: Vec<TabToSave>,
    ) -> Result<String, String> {
        // Delete existing sessions
        sqlx::query("DELETE FROM sessions")
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;

        let session_id = Uuid::new_v4().to_string();
        let tab_count  = tabs.len() as i64;

        sqlx::query(
            "INSERT INTO sessions (id, active_tab, tab_count) VALUES (?, ?, ?)"
        )
        .bind(&session_id)
        .bind(active_tab)
        .bind(tab_count)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        for tab in tabs {
            let id = Uuid::new_v4().to_string();
            sqlx::query(
                "INSERT INTO session_tabs
                    (id, session_id, tab_id, url, title, position)
                 VALUES (?, ?, ?, ?, ?, ?)"
            )
            .bind(id)
            .bind(&session_id)
            .bind(&tab.tab_id)
            .bind(&tab.url)
            .bind(&tab.title)
            .bind(tab.position)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        }

        Ok(session_id)
    }

    /// Load the most recent saved session.
    pub async fn load_latest(&self) -> Result<Option<FullSession>, String> {
        let session = sqlx::query_as::<_, SessionEntry>(
            "SELECT * FROM sessions ORDER BY saved_at DESC LIMIT 1"
        )
        .fetch_optional(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        let Some(session) = session else {
            return Ok(None);
        };

        let tabs = sqlx::query_as::<_, SessionTabEntry>(
            "SELECT * FROM session_tabs WHERE session_id = ? ORDER BY position ASC"
        )
        .bind(&session.id)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        Ok(Some(FullSession { session, tabs }))
    }
}