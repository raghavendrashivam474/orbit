-- 0005_settings.sql
-- Orbit Settings Persistence

CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Insert defaults
INSERT OR IGNORE INTO settings (key, value) VALUES
    ('theme',             '"dark"'),
    ('sidebar_collapsed', 'false'),
    ('restore_session',   'true'),
    ('startup_url',       '""');