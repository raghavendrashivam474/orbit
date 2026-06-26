-- 0003_bookmarks.sql
-- Orbit Bookmarks

CREATE TABLE IF NOT EXISTS bookmarks (
    id         TEXT PRIMARY KEY,
    url        TEXT NOT NULL,
    title      TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_url        ON bookmarks(url);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);