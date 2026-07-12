-- 0007_context.sql
-- Sprint 6 Context Engine Foundation
-- Pages table and PageVisits table

CREATE TABLE IF NOT EXISTS pages (
    id              TEXT    PRIMARY KEY,
    url             TEXT    NOT NULL,
    normalized_url  TEXT    NOT NULL UNIQUE,
    title           TEXT    NOT NULL DEFAULT '',
    hostname        TEXT    NOT NULL DEFAULT '',
    description     TEXT,
    favicon_url     TEXT,
    first_seen_at   TEXT    NOT NULL DEFAULT (datetime('now')),
    last_seen_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pages_normalized_url ON pages(normalized_url);
CREATE INDEX IF NOT EXISTS idx_pages_hostname       ON pages(hostname);
CREATE INDEX IF NOT EXISTS idx_pages_last_seen      ON pages(last_seen_at DESC);

CREATE TABLE IF NOT EXISTS page_visits (
    id            TEXT    PRIMARY KEY,
    page_id       TEXT    NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
    workspace_id  TEXT    NOT NULL,
    tab_id        TEXT,
    visited_at    TEXT    NOT NULL DEFAULT (datetime('now')),
    source        TEXT    NOT NULL DEFAULT 'unknown'
);

CREATE INDEX IF NOT EXISTS idx_page_visits_page       ON page_visits(page_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_workspace  ON page_visits(workspace_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON page_visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_ws_time    ON page_visits(workspace_id, visited_at DESC);