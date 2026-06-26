//! workspace/service.rs

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

    pub async fn list(&self) -> Result<Vec<WorkspaceEntry>, String> {
        SqliteWorkspaceRepository::new(&self.pool).list().await
    }

    pub async fn find(&self, id: &str) -> Result<Option<WorkspaceEntry>, String> {
        SqliteWorkspaceRepository::new(&self.pool).find(id).await
    }

    pub async fn create(&self, input: CreateWorkspaceInput) -> Result<WorkspaceEntry, String> {
        SqliteWorkspaceRepository::new(&self.pool).create(input).await
    }

    pub async fn update(&self, input: UpdateWorkspaceInput) -> Result<WorkspaceEntry, String> {
        SqliteWorkspaceRepository::new(&self.pool).update(input).await
    }

    pub async fn delete(&self, id: &str) -> Result<(), String> {
        SqliteWorkspaceRepository::new(&self.pool).delete(id).await
    }

    pub async fn activate(&self, id: &str) -> Result<(), String> {
        SqliteWorkspaceRepository::new(&self.pool).touch(id).await
    }

    pub async fn save_tabs(&self, input: SaveWorkspaceTabsInput) -> Result<(), String> {
        SqliteWorkspaceRepository::new(&self.pool).save_tabs(input).await
    }

    pub async fn load_tabs(&self, workspace_id: &str) -> Result<Vec<WorkspaceTabEntry>, String> {
        SqliteWorkspaceRepository::new(&self.pool).load_tabs(workspace_id).await
    }

    /// Ensure the default Personal workspace exists on first launch.
    pub async fn ensure_default(&self) -> Result<(), String> {
        let repo = SqliteWorkspaceRepository::new(&self.pool);
        let all  = repo.list().await?;

        if all.is_empty() {
            // House emoji as Unicode escape - survives encoding pipelines
            let house_emoji = "\u{1F3E0}".to_string();

            repo.create(CreateWorkspaceInput {
                name:      "Personal".to_string(),
                icon:      house_emoji,
                icon_type: "emoji".to_string(),
                color:     "#3B82F6".to_string(),
            }).await?;
        }

        Ok(())
    }
}