//! models/mod.rs
//! Orbit Data Models
//!
//! These structs represent database rows.
//! They are serialized to DTOs before crossing the IPC boundary.

pub mod bookmark;
pub mod history;
pub mod session;
pub mod settings;