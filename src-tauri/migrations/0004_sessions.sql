-- 0004_sessions.sql
-- Orbit Session Persistence

CREATE TABLE IF NOT EXISTS sessions (
    id           TEXT    PRIMARY KEY,
    saved_at     TEXT    NOT NULL DEFAULT (datetime('now')),
    active_tab   TEXT    NOT NULL DEFAULT '',
    tab_count    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS session_tabs (
    id         TEXT    PRIMARY KEY,
    session_id TEXT    NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    tab_id     TEXT    NOT NULL,
    url        TEXT    NOT NULL DEFAULT '',
    title      TEXT    NOT NULL DEFAULT '',
    position   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_session_tabs_session ON session_tabs(session_id);