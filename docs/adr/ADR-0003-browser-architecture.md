# ADR-0003 - Browser Architecture

Status: Accepted
Date: 2026-06-25
Sprint: 3 - Browser Core

## Context

Orbit must integrate web browsing capability while maintaining
clean architectural separation between the shell, tab management,
and the underlying rendering engine.

Tauri v2 provides WebView2 on Windows as the rendering primitive.
However, the specific Tauri APIs for managing WebView instances
are subject to change as Tauri evolves.

Orbit must not couple itself to any specific rendering API.

## Decision

Orbit's browser architecture is renderer-agnostic.

The shell communicates exclusively through BrowserFacade.
BrowserFacade delegates to a RendererInterface.
The current implementation of RendererInterface is WebView2Renderer.
WebView2Renderer's internal mechanics are private.

## Abstraction Stack

    Shell
      |
      v
    BrowserFacade        <- only API the shell touches
      |
      v
    RendererInterface    <- TypeScript interface contract
      |
      v
    WebView2Renderer     <- current implementation (private internals)
      |
      v
    Tauri WebView APIs   <- subject to change, contained here only

## Ownership Model

    Shell
      owns: presentation, layout, user interaction

    Tab
      owns: URL, title, history metadata, session metadata, loading state

    Renderer
      owns: WebView instance, navigation execution,
            loading lifecycle, process resources

## RendererInterface Contract

Every renderer must implement:

    navigate(url: string): Promise<void>
    reload(): Promise<void>
    stop(): Promise<void>
    back(): Promise<void>
    forward(): Promise<void>
    getTitle(): Promise<string>
    getUrl(): Promise<string>
    canGoBack(): Promise<boolean>
    canGoForward(): Promise<boolean>
    destroy(): Promise<void>

## Sprint 3 Implementation

WebView2Renderer uses a single managed Tauri WebView.
Tab switching navigates the WebView to the active tab URL.
Inactive tabs preserve metadata only (URL, title, history position).
Inactive tabs do not consume renderer resources.

This is documented as an implementation constraint, not an
architectural principle. Future renderers may support parallel
tab rendering.

## Future Renderers

When Tauri multi-WebView APIs stabilize:
  Replace WebView2Renderer internals only.

When Orbit moves to Chromium:
  Introduce ChromiumRenderer implementing RendererInterface.

The shell, BrowserFacade, tab store, and workspace layer
remain entirely unchanged in both cases.

## Consequences

- No shell component may import from Tauri WebView APIs directly.
- All navigation operations flow through BrowserFacade.
- Tab state and renderer state are explicitly separated.
- The renderer owns and manages all WebView lifecycle events.
- Replacing the renderer requires zero changes outside the browser/ folder.

## Review Conditions

Revisit when:
- Tauri multi-WebView APIs reach stable status.
- Orbit requires parallel tab rendering.
- Phase 5 Chromium integration begins.