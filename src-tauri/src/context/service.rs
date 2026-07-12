//! context/service.rs
//! Sprint 6 — Context Service.
//!
//! Coordinates context capture and queries. Owns business logic;
//! delegates all SQL to SqliteContextRepository.

use crate::database::DbPool;
use crate::context::models::*;
use crate::context::repository::SqliteContextRepository;

#[derive(Debug)]
pub struct ContextService {
    pool: DbPool,
}

impl ContextService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    // ── Capture ────────────────────────────────────────────

    /// Record a navigation event.
    ///
    /// Flow:
    ///   1. Look up Page by normalized_url
    ///   2. If missing → create Page
    ///   3. If found   → touch (update last_seen_at)
    ///   4. Always create a PageVisit
    ///
    /// Returns the Page ID.
    pub async fn record_navigation(
        &self,
        input: RecordNavigationInput,
    ) -> Result<String, String> {
        let repo = SqliteContextRepository::new(&self.pool);

        let page = match repo.find_page_by_normalized_url(&input.normalized_url).await? {
            Some(existing) => {
                repo.touch_page(&existing.id).await?;
                existing
            }
            None => repo.create_page(&input).await?,
        };

        repo.create_visit(
            &page.id,
            &input.workspace_id,
            input.tab_id.as_deref(),
            &input.source,
        ).await?;

        Ok(page.id)
    }

    /// Update Page metadata (title/description/favicon).
    /// Does NOT create a PageVisit.
    pub async fn update_page_metadata(
        &self,
        input: UpdatePageMetadataInput,
    ) -> Result<Option<PageEntry>, String> {
        let repo = SqliteContextRepository::new(&self.pool);
        repo.update_page_metadata(&input).await
    }

    // ── Queries ────────────────────────────────────────────

    pub async fn get_recent_workspace_pages(
        &self,
        workspace_id: &str,
        limit: i64,
    ) -> Result<Vec<PageEntry>, String> {
        SqliteContextRepository::new(&self.pool)
            .get_recent_workspace_pages(workspace_id, limit)
            .await
    }

    pub async fn get_workspace_pages(
        &self,
        workspace_id: &str,
    ) -> Result<Vec<PageEntry>, String> {
        SqliteContextRepository::new(&self.pool)
            .get_workspace_pages(workspace_id)
            .await
    }

    pub async fn get_page_visits(
        &self,
        page_id: &str,
    ) -> Result<Vec<PageVisitEntry>, String> {
        SqliteContextRepository::new(&self.pool)
            .get_visits_for_page(page_id)
            .await
    }

    pub async fn get_workspace_visits(
        &self,
        workspace_id: &str,
        limit: i64,
    ) -> Result<Vec<PageVisitEntry>, String> {
        SqliteContextRepository::new(&self.pool)
            .get_workspace_visits(workspace_id, limit)
            .await
    }

    pub async fn search_pages(
        &self,
        query: &str,
        workspace_id: Option<&str>,
        limit: i64,
    ) -> Result<Vec<PageEntry>, String> {
        SqliteContextRepository::new(&self.pool)
            .search_pages(query, workspace_id, limit)
            .await
    }
}