//! context/repository.rs
//! Sprint 6 — Context SQLite repository.
//! All context-domain SQL lives here.

use crate::database::DbPool;
use crate::context::models::*;
use uuid::Uuid;

pub struct SqliteContextRepository<'a> {
    pool: &'a DbPool,
}

impl<'a> SqliteContextRepository<'a> {
    pub fn new(pool: &'a DbPool) -> Self {
        Self { pool }
    }

    // ── Page CRUD ──────────────────────────────────────────

    /// Find a Page by its normalized URL.
    /// Returns None if no matching Page exists.
    pub async fn find_page_by_normalized_url(
        &self,
        normalized_url: &str,
    ) -> Result<Option<PageEntry>, String> {
        sqlx::query_as::<_, PageEntry>(
            "SELECT * FROM pages WHERE normalized_url = ?"
        )
        .bind(normalized_url)
        .fetch_optional(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Create a new Page. Fails if normalized_url conflicts.
    pub async fn create_page(&self, input: &RecordNavigationInput) -> Result<PageEntry, String> {
        let id = format!("page-{}", Uuid::new_v4());

        sqlx::query(
            "INSERT INTO pages (id, url, normalized_url, title, hostname)
             VALUES (?, ?, ?, ?, ?)"
        )
        .bind(&id)
        .bind(&input.url)
        .bind(&input.normalized_url)
        .bind(&input.title)
        .bind(&input.hostname)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        self.find_page_by_normalized_url(&input.normalized_url)
            .await?
            .ok_or_else(|| "Page not found after insert".to_string())
    }

    /// Update last_seen_at to now for an existing Page.
    pub async fn touch_page(&self, page_id: &str) -> Result<(), String> {
        sqlx::query(
            "UPDATE pages SET last_seen_at = datetime('now') WHERE id = ?"
        )
        .bind(page_id)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;
        Ok(())
    }

    /// Update Page metadata. Does NOT create a PageVisit.
    /// Any None field is left unchanged.
    pub async fn update_page_metadata(
        &self,
        input: &UpdatePageMetadataInput,
    ) -> Result<Option<PageEntry>, String> {
        let existing = self.find_page_by_normalized_url(&input.normalized_url).await?;
        let Some(page) = existing else { return Ok(None); };

        let title = input.title.clone().unwrap_or_else(|| page.title.clone());
        let description = match &input.description {
            Some(d) => Some(d.clone()),
            None => page.description.clone(),
        };
        let favicon_url = match &input.favicon_url {
            Some(f) => Some(f.clone()),
            None => page.favicon_url.clone(),
        };

        sqlx::query(
            "UPDATE pages
             SET title = ?, description = ?, favicon_url = ?
             WHERE id = ?"
        )
        .bind(&title)
        .bind(&description)
        .bind(&favicon_url)
        .bind(&page.id)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        self.find_page_by_normalized_url(&input.normalized_url).await
    }

    // ── PageVisit CRUD ─────────────────────────────────────

    /// Record a new PageVisit.
    pub async fn create_visit(
        &self,
        page_id: &str,
        workspace_id: &str,
        tab_id: Option<&str>,
        source: &str,
    ) -> Result<PageVisitEntry, String> {
        let id = format!("visit-{}", Uuid::new_v4());

        sqlx::query(
            "INSERT INTO page_visits (id, page_id, workspace_id, tab_id, source)
             VALUES (?, ?, ?, ?, ?)"
        )
        .bind(&id)
        .bind(page_id)
        .bind(workspace_id)
        .bind(tab_id)
        .bind(source)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        sqlx::query_as::<_, PageVisitEntry>(
            "SELECT * FROM page_visits WHERE id = ?"
        )
        .bind(&id)
        .fetch_one(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Get all visits for a Page, most recent first.
    pub async fn get_visits_for_page(
        &self,
        page_id: &str,
    ) -> Result<Vec<PageVisitEntry>, String> {
        sqlx::query_as::<_, PageVisitEntry>(
            "SELECT * FROM page_visits WHERE page_id = ? ORDER BY visited_at DESC"
        )
        .bind(page_id)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    // ── Workspace-aware queries ────────────────────────────

    /// Distinct pages recently visited in a workspace, most recent visit first.
    /// Deduplicates: the same Page appears once even if visited multiple times.
    pub async fn get_recent_workspace_pages(
        &self,
        workspace_id: &str,
        limit: i64,
    ) -> Result<Vec<PageEntry>, String> {
        sqlx::query_as::<_, PageEntry>(
            "SELECT p.* FROM pages p
             INNER JOIN (
                SELECT page_id, MAX(visited_at) AS latest
                FROM page_visits
                WHERE workspace_id = ?
                GROUP BY page_id
             ) v ON v.page_id = p.id
             ORDER BY v.latest DESC
             LIMIT ?"
        )
        .bind(workspace_id)
        .bind(limit)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// All pages associated with a workspace via at least one visit.
    pub async fn get_workspace_pages(
        &self,
        workspace_id: &str,
    ) -> Result<Vec<PageEntry>, String> {
        sqlx::query_as::<_, PageEntry>(
            "SELECT DISTINCT p.* FROM pages p
             INNER JOIN page_visits v ON v.page_id = p.id
             WHERE v.workspace_id = ?
             ORDER BY p.last_seen_at DESC"
        )
        .bind(workspace_id)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// All visits for a workspace, most recent first. Used to build the timeline.
    pub async fn get_workspace_visits(
        &self,
        workspace_id: &str,
        limit: i64,
    ) -> Result<Vec<PageVisitEntry>, String> {
        sqlx::query_as::<_, PageVisitEntry>(
            "SELECT * FROM page_visits
             WHERE workspace_id = ?
             ORDER BY visited_at DESC
             LIMIT ?"
        )
        .bind(workspace_id)
        .bind(limit)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    // ── Search ─────────────────────────────────────────────

    /// Lexical search over pages.
    /// Optional workspace filter restricts results to pages with a visit
    /// in that workspace.
    ///
    /// Ranking (explainable):
    ///   1. Exact title match
    ///   2. Title contains query
    ///   3. Hostname match
    ///   4. URL match
    ///   5. Description match
    pub async fn search_pages(
        &self,
        query: &str,
        workspace_id: Option<&str>,
        limit: i64,
    ) -> Result<Vec<PageEntry>, String> {
        let q_exact = query.to_string();
        let q_like  = format!("%{}%", query);

        let sql = if workspace_id.is_some() {
            "SELECT DISTINCT p.* FROM pages p
             INNER JOIN page_visits v ON v.page_id = p.id
             WHERE v.workspace_id = ?
               AND (p.title LIKE ? OR p.url LIKE ? OR p.normalized_url LIKE ?
                    OR p.hostname LIKE ? OR p.description LIKE ?)
             ORDER BY
                CASE
                    WHEN LOWER(p.title)       = LOWER(?) THEN 1
                    WHEN p.title    LIKE ?               THEN 2
                    WHEN p.hostname LIKE ?               THEN 3
                    WHEN p.url      LIKE ?               THEN 4
                    ELSE 5
                END,
                p.last_seen_at DESC
             LIMIT ?"
        } else {
            "SELECT * FROM pages p
             WHERE p.title LIKE ? OR p.url LIKE ? OR p.normalized_url LIKE ?
                OR p.hostname LIKE ? OR p.description LIKE ?
             ORDER BY
                CASE
                    WHEN LOWER(p.title)       = LOWER(?) THEN 1
                    WHEN p.title    LIKE ?               THEN 2
                    WHEN p.hostname LIKE ?               THEN 3
                    WHEN p.url      LIKE ?               THEN 4
                    ELSE 5
                END,
                p.last_seen_at DESC
             LIMIT ?"
        };

        let mut q = sqlx::query_as::<_, PageEntry>(sql);

        if let Some(ws) = workspace_id {
            q = q.bind(ws);
        }

        q = q
            .bind(&q_like)   // WHERE title
            .bind(&q_like)   // WHERE url
            .bind(&q_like)   // WHERE normalized_url
            .bind(&q_like)   // WHERE hostname
            .bind(&q_like)   // WHERE description
            .bind(&q_exact)  // ORDER exact title
            .bind(&q_like)   // ORDER title like
            .bind(&q_like)   // ORDER hostname like
            .bind(&q_like)   // ORDER url like
            .bind(limit);

        q.fetch_all(self.pool).await.map_err(|e| e.to_string())
    }
}