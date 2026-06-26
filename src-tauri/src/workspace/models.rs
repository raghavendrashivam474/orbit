//! workspace/models.rs
//! Workspace data models.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct WorkspaceEntry {
    pub id:             String,
    pub name:           String,
    pub icon:           String,
    pub icon_type:      String,
    pub color:          String,
    pub created_at:     String,
    pub updated_at:     String,
    pub last_opened_at: String,
    pub position:       i64,
    pub is_default:     i64,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct WorkspaceTabEntry {
    pub id:           String,
    pub workspace_id: String,
    pub tab_id:       String,
    pub url:          String,
    pub title:        String,
    pub position:     i64,
    pub is_active:    i64,
    pub created_at:   String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkspaceWithTabs {
    pub workspace: WorkspaceEntry,
    pub tabs:      Vec<WorkspaceTabEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateWorkspaceInput {
    pub name:      String,
    pub icon:      String,
    pub icon_type: String,
    pub color:     String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateWorkspaceInput {
    pub id:    String,
    pub name:  Option<String>,
    pub icon:  Option<String>,
    pub color: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SaveWorkspaceTabsInput {
    pub workspace_id: String,
    pub active_tab:   String,
    pub tabs:         Vec<TabInput>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TabInput {
    pub tab_id:   String,
    pub url:      String,
    pub title:    String,
    pub position: i64,
}