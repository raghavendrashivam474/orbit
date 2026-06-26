-- 0002_history.sql
-- Orbit Browsing History

CREATE TABLE IF NOT EXISTS history (
    id          TEXT    PRIMARY KEY,
    url         TEXT    NOT NULL,
    title       TEXT    NOT NULL DEFAULT '',
    visited_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    visit_count INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_history_url        ON history(url);
CREATE INDEX IF NOT EXISTS idx_history_visited_at ON history(visited_at DESC);