//! models/settings.rs
//! Settings data model.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct SettingsEntry {
    pub key:        String,
    pub value:      String,
    pub updated_at: String,
}