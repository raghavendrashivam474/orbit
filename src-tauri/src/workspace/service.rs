//! workspace/service.rs
//! Workspace Service â€” coordinates workspace business logic.

use crate::database::DbPool;
use crate::workspace::models::*;
use crate::workspace::repository::SqliteWorkspaceRepository;

#[derive(Debug)]
pub struct WorkspaceService {
    pool: DbPool,
}

impl WorkspaceService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    /// Return all workspaces.
    pub async fn list(&self) -> Result<Vec<WorkspaceEntry>, String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        repo.list().await
    }

    /// Find a workspace by ID.
    pub async fn find(&self, id: &str) -> Result<Option<WorkspaceEntry>, String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        repo.find(id).await
    }

    /// Create a new workspace.
    pub async fn create(&self, input: CreateWorkspaceInput) -> Result<WorkspaceEntry, String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        repo.create(input).await
    }

    /// Update a workspace.
    pub async fn update(&self, input: UpdateWorkspaceInput) -> Result<WorkspaceEntry, String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        repo.update(input).await
    }

    /// Delete a workspace.
    pub async fn delete(&self, id: &str) -> Result<(), String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        repo.delete(id).await
    }

    /// Mark workspace as recently opened.
    pub async fn activate(&self, id: &str) -> Result<(), String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        repo.touch(id).await
    }

    /// Save current tabs to a workspace.
    pub async fn save_tabs(&self, input: SaveWorkspaceTabsInput) -> Result<(), String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        repo.save_tabs(input).await
    }

    /// Load saved tabs for a workspace.
    pub async fn load_tabs(&self, workspace_id: &str) -> Result<Vec<WorkspaceTabEntry>, String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        repo.load_tabs(workspace_id).await
    }

    /// Ensure the default Personal workspace exists.
    /// Called on application startup.
    pub async fn ensure_default(&self) -> Result<(), String> {
        let repo  = SqliteWorkspaceRepository::new(&self.pool);
        let all   = repo.list().await?;

        if all.is_empty() {
            repo.create(CreateWorkspaceInput {
                name:      "Personal".to_string(),
                icon:      "ðŸ ".to_string(),
                icon_type: "emoji".to_string(),
                color:     "#3B82F6".to_string(),
            }).await?;
        }

        Ok(())
    }
}