-- 0006_workspaces.sql
-- Orbit Workspace Engine

CREATE TABLE IF NOT EXISTS workspaces (
    id             TEXT    PRIMARY KEY,
    name           TEXT    NOT NULL,
    icon           TEXT    NOT NULL DEFAULT 'ðŸ ',
    icon_type      TEXT    NOT NULL DEFAULT 'emoji',
    color          TEXT    NOT NULL DEFAULT '#3B82F6',
    created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    last_opened_at TEXT    NOT NULL DEFAULT (datetime('now')),
    position       INTEGER NOT NULL DEFAULT 0,
    is_default     INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS workspace_tabs (
    id           TEXT    PRIMARY KEY,
    workspace_id TEXT    NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    tab_id       TEXT    NOT NULL,
    url          TEXT    NOT NULL DEFAULT '',
    title        TEXT    NOT NULL DEFAULT 'New Tab',
    position     INTEGER NOT NULL DEFAULT 0,
    is_active    INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_workspace_tabs_workspace
    ON workspace_tabs(workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_tabs_tab
    ON workspace_tabs(tab_id);

-- Insert the default Personal workspace
INSERT OR IGNORE INTO workspaces
    (id, name, icon, icon_type, color, position, is_default)
VALUES
    ('workspace-personal', 'Personal', 'ðŸ ', 'emoji', '#3B82F6', 0, 1);

-- Settings key for active workspace
INSERT OR IGNORE INTO settings (key, value)
VALUES ('active_workspace_id', '"workspace-personal"');