# ADR-0004 - Renderer Implementation Strategy

Status: Accepted
Date: 2026-06-25
Sprint: 3 - Browser Core

## Context

Tauri 2.11.3 provides two paths for embedding web content:

1. WebviewWindow (stable) - a separate OS-level window
2. Child webview via Window::add_child (requires unstable feature)

Orbit's initial preference was stable APIs only.
However, embedded rendering is a core product capability.
A browser that opens separate OS windows for each tab
does not match Orbit's product vision.

## Decision

Enable the Tauri unstable feature flag.
Use Window::add_child to create child webviews inside the main window.

## Strict Scope

The unstable dependency is contained to exactly one file:

    src-tauri/src/browser/mod.rs

No other file in Orbit depends on unstable Tauri APIs.
The TypeScript layer sees only BrowserFacade and RendererInterface.
No unstable types cross the Rust/TypeScript boundary.

## Why This Is Acceptable

1. Embedded rendering is fundamental to Orbit's UX.
   Separate OS windows are a framework workaround, not the product.

2. The RendererInterface abstraction contains the risk.
   If Tauri changes the unstable API signature, only mod.rs changes.
   BrowserFacade, shell, tabs, stores, workspace - none change.

3. ADR-0003 was designed for exactly this situation.
   The abstraction exists to isolate renderer implementation details.

## Risk

Future Tauri updates may change the unstable API signature.
This would require updating browser/mod.rs only.
No other file would be affected.

## Exit Strategy

When Tauri promotes child webview APIs to stable:
  Remove the unstable feature flag from Cargo.toml.
  Update browser/mod.rs to use the stable API.
  No other files change.

When Orbit moves to Chromium (Phase 5):
  Implement ChromiumRenderer satisfying RendererInterface.
  browser/mod.rs is replaced entirely.
  No other files change.

## Engineering Principle Preserved

Orbit's architecture depends on stable abstractions.
Only one renderer implementation depends on an unstable API.
That is a contained, documented, intentional tradeoff.