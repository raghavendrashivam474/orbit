//! workspace/repository.rs
//! Workspace SQLite Repository â€” owns all workspace SQL.

use crate::database::DbPool;
use crate::workspace::models::*;
use uuid::Uuid;

pub struct SqliteWorkspaceRepository<'a> {
    pool: &'a DbPool,
}

impl<'a> SqliteWorkspaceRepository<'a> {
    pub fn new(pool: &'a DbPool) -> Self {
        Self { pool }
    }

    /// Return all workspaces ordered by position.
    pub async fn list(&self) -> Result<Vec<WorkspaceEntry>, String> {
        sqlx::query_as::<_, WorkspaceEntry>(
            "SELECT * FROM workspaces ORDER BY position ASC"
        )
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Find a workspace by ID.
    pub async fn find(&self, id: &str) -> Result<Option<WorkspaceEntry>, String> {
        sqlx::query_as::<_, WorkspaceEntry>(
            "SELECT * FROM workspaces WHERE id = ?"
        )
        .bind(id)
        .fetch_optional(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Create a new workspace.
    pub async fn create(&self, input: CreateWorkspaceInput) -> Result<WorkspaceEntry, String> {
        let id       = format!("workspace-{}", Uuid::new_v4());
        let position = self.next_position().await?;

        sqlx::query(
            "INSERT INTO workspaces
                (id, name, icon, icon_type, color, position, is_default)
             VALUES (?, ?, ?, ?, ?, ?, 0)"
        )
        .bind(&id)
        .bind(&input.name)
        .bind(&input.icon)
        .bind(&input.icon_type)
        .bind(&input.color)
        .bind(position)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        self.find(&id).await?
            .ok_or_else(|| "Workspace not found after insert".to_string())
    }

    /// Update workspace name, icon, or color.
    pub async fn update(&self, input: UpdateWorkspaceInput) -> Result<WorkspaceEntry, String> {
        if let Some(name) = &input.name {
            sqlx::query(
                "UPDATE workspaces SET name = ?, updated_at = datetime('now') WHERE id = ?"
            )
            .bind(name)
            .bind(&input.id)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        }

        if let Some(icon) = &input.icon {
            sqlx::query(
                "UPDATE workspaces SET icon = ?, updated_at = datetime('now') WHERE id = ?"
            )
            .bind(icon)
            .bind(&input.id)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        }

        if let Some(color) = &input.color {
            sqlx::query(
                "UPDATE workspaces SET color = ?, updated_at = datetime('now') WHERE id = ?"
            )
            .bind(color)
            .bind(&input.id)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        }

        self.find(&input.id).await?
            .ok_or_else(|| "Workspace not found after update".to_string())
    }

    /// Delete a workspace. Cascades to workspace_tabs.
    pub async fn delete(&self, id: &str) -> Result<(), String> {
        let count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM workspaces"
        )
        .fetch_one(self.pool)
        .await
        .map_err(|e| e.to_string())?;

        if count <= 1 {
            return Err("Cannot delete the last workspace.".to_string());
        }

        sqlx::query("DELETE FROM workspaces WHERE id = ?")
            .bind(id)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    /// Update last_opened_at timestamp.
    pub async fn touch(&self, id: &str) -> Result<(), String> {
        sqlx::query(
            "UPDATE workspaces SET last_opened_at = datetime('now') WHERE id = ?"
        )
        .bind(id)
        .execute(self.pool)
        .await
        .map_err(|e| e.to_string())?;
        Ok(())
    }

    /// Save tabs for a workspace. Replaces existing tab records.
    pub async fn save_tabs(&self, input: SaveWorkspaceTabsInput) -> Result<(), String> {
        sqlx::query("DELETE FROM workspace_tabs WHERE workspace_id = ?")
            .bind(&input.workspace_id)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;

        for tab in &input.tabs {
            let id       = Uuid::new_v4().to_string();
            let is_active = if tab.tab_id == input.active_tab { 1 } else { 0 };

            sqlx::query(
                "INSERT INTO workspace_tabs
                    (id, workspace_id, tab_id, url, title, position, is_active)
                 VALUES (?, ?, ?, ?, ?, ?, ?)"
            )
            .bind(&id)
            .bind(&input.workspace_id)
            .bind(&tab.tab_id)
            .bind(&tab.url)
            .bind(&tab.title)
            .bind(tab.position)
            .bind(is_active)
            .execute(self.pool)
            .await
            .map_err(|e| e.to_string())?;
        }

        Ok(())
    }

    /// Load tabs for a workspace.
    pub async fn load_tabs(&self, workspace_id: &str) -> Result<Vec<WorkspaceTabEntry>, String> {
        sqlx::query_as::<_, WorkspaceTabEntry>(
            "SELECT * FROM workspace_tabs
             WHERE workspace_id = ?
             ORDER BY position ASC"
        )
        .bind(workspace_id)
        .fetch_all(self.pool)
        .await
        .map_err(|e| e.to_string())
    }

    /// Get the next available position.
    async fn next_position(&self) -> Result<i64, String> {
        let max: Option<i64> = sqlx::query_scalar(
            "SELECT MAX(position) FROM workspaces"
        )
        .fetch_one(self.pool)
        .await
        .map_err(|e| e.to_string())?;
        Ok(max.unwrap_or(-1) + 1)
    }
}