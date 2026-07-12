//! context/models.rs
//! Sprint 6 — Context Engine domain models.
//!
//! Page:      global identity for a web resource, keyed by normalized_url
//! PageVisit: workspace-scoped act of visiting a Page
//!
//! See ADR-0009 for the identity model.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct PageEntry {
    pub id:              String,
    pub url:             String,
    pub normalized_url:  String,
    pub title:           String,
    pub hostname:        String,
    pub description:     Option<String>,
    pub favicon_url:     Option<String>,
    pub first_seen_at:   String,
    pub last_seen_at:    String,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct PageVisitEntry {
    pub id:            String,
    pub page_id:       String,
    pub workspace_id:  String,
    pub tab_id:        Option<String>,
    pub visited_at:    String,
    pub source:        String,
}

/// Input for creating or resolving a Page.
/// Used by ContextService.record_navigation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecordNavigationInput {
    pub url:            String,
    pub normalized_url: String,
    pub title:          String,
    pub hostname:       String,
    pub workspace_id:   String,
    pub tab_id:         Option<String>,
    pub source:         String,
}

/// Input for updating Page metadata after page load completes.
/// Never creates a PageVisit.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdatePageMetadataInput {
    pub normalized_url: String,
    pub title:          Option<String>,
    pub description:    Option<String>,
    pub favicon_url:    Option<String>,
}