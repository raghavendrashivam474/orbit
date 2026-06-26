-- 0001_initial.sql
-- Orbit Database - Initial Schema
-- Creates the migrations tracking table.

CREATE TABLE IF NOT EXISTS _migrations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    version    INTEGER NOT NULL UNIQUE,
    name       TEXT    NOT NULL,
    applied_at TEXT    NOT NULL DEFAULT (datetime('now'))
);