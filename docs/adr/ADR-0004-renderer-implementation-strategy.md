# ADR-0004 - Renderer Implementation Strategy

Status: Accepted
Date: 2026-06-25
Sprint: 3 - Browser Core

## Context

Tauri 2.11.3 provides two paths for embedding web content:

1. WebviewWindow (stable) - a separate OS-level window
2. Child webview via add_child (unstable feature flag required)

Orbit's engineering principle is to build on stable APIs only.
Enabling the unstable feature flag would allow embedded child
webviews today but introduces maintenance risk on every Tauri
version update.

## Decision

Sprint 3 uses WebviewWindow (stable API).
The unstable child webview API is deferred.

## Rationale

Orbit can already state: built entirely on stable technologies.
This is a valuable engineering position to maintain.

The renderer abstraction (ADR-0003) means this decision
affects only one file: WebView2Renderer / browser/mod.rs.

The rest of Orbit - shell, tabs, workspace, AI layer -
is completely unaffected by this implementation choice.

## Current Implementation

WebviewWindow per tab.
Positioned to cover the content area.
Hidden when tab is inactive.
Shown when tab is active.

## Upgrade Path

When Tauri stabilizes the child webview API:
  1. Remove the WebviewWindow implementation from browser/mod.rs
  2. Add the child webview implementation
  3. No other files change

When Orbit moves to Chromium (Phase 5):
  1. Implement ChromiumRenderer satisfying RendererInterface
  2. No other files change

## Review Conditions

Revisit when:
- Tauri promotes child webview API to stable
- Phase 5 Chromium integration begins
- A strong product reason requires embedded webviews before stabilization