/**
 * BrowserFacade.ts
 * Orbit Browser Layer - Public API
 *
 * The single entry point for all browser operations.
 * The shell and all UI components must use this class exclusively.
 * No component may bypass this facade.
 *
 * Responsibilities:
 *   - Delegate navigation operations to the active renderer
 *   - Emit browser events for state changes
 *   - Manage renderer sessions per tab
 *   - Keep tab browser state synchronized
 *
 * See ADR-0003 for architectural rationale.
 */

import type { RendererInterface } from "./RendererInterface";
import type { BrowserEvent, BrowserEventType } from "./BrowserEvents";
import type { RendererSession } from "./RendererSession";
import type { BrowserError } from "./BrowserTypes";
import { WebView2Renderer } from "./WebView2Renderer";
import { BrowserEventEmitter } from "./BrowserEvents";
import { createRendererSession } from "./RendererSession";
import { resolveUrl } from "@/services/navigation/urlResolver";
import { useBrowserStore } from "@/store/browserStore";

class BrowserFacade {
  private readonly renderer: RendererInterface = new WebView2Renderer();
  private readonly emitter = new BrowserEventEmitter();
  private readonly sessions = new Map<string, RendererSession>();
  private activeTabId: string | null = null;
  private pollInterval: ReturnType<typeof setInterval> | null = null;

  // â”€â”€ Session Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /** Register a new tab with the facade. */
  registerTab(tabId: string, initialUrl = ""): void {
    const session = createRendererSession(tabId, initialUrl);
    this.sessions.set(tabId, session);
  }

  /** Switch the active renderer session to the given tab. */
  async activateTab(tabId: string): Promise<void> {
    const session = this.sessions.get(tabId);
    if (!session) return;

    // Deactivate current session
    if (this.activeTabId && this.activeTabId !== tabId) {
      const prev = this.sessions.get(this.activeTabId);
      if (prev) prev.isActive = false;
    }

    session.isActive = true;
    this.activeTabId = tabId;

    // Navigate renderer to this tab's URL if it has one
    if (session.state.url) {
      await this.renderer.navigate(session.state.url);
    }
  }

  /** Destroy a tab session and release resources. */
  async destroyTab(tabId: string): Promise<void> {
    const session = this.sessions.get(tabId);
    if (!session) return;

    if (session.isActive) {
      await this.renderer.destroy();
      this.activeTabId = null;
    }

    this.sessions.delete(tabId);
  }

  // â”€â”€ Navigation Operations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /** Navigate the active tab to a URL or search query. */
  async navigate(input: string): Promise<void> {
    if (!this.activeTabId) return;

    const resolved = resolveUrl(input);
    const url = resolved.href;

    this.emitter.emit({ type: "navigation:start", tabId: this.activeTabId, url });
    this.updateTabState(this.activeTabId, { url, isLoading: true, progress: 0, error: null });

    try {
      await this.renderer.navigate(url);
      this.startPolling();
    } catch (err) {
      const error: BrowserError = {
        code:    "CONNECTION_FAILED",
        message: err instanceof Error ? err.message : "Navigation failed",
        url,
      };
      this.updateTabState(this.activeTabId, { isLoading: false, error });
      this.emitter.emit({ type: "navigation:error", tabId: this.activeTabId, error });
    }
  }

  async reload(): Promise<void> {
    if (!this.activeTabId) return;
    this.updateTabState(this.activeTabId, { isLoading: true, progress: 0 });
    await this.renderer.reload();
  }

  async stop(): Promise<void> {
    if (!this.activeTabId) return;
    this.updateTabState(this.activeTabId, { isLoading: false, progress: 0 });
    await this.renderer.stop();
  }

  async back(): Promise<void> {
    if (!this.activeTabId) return;
    await this.renderer.back();
  }

  async forward(): Promise<void> {
    if (!this.activeTabId) return;
    await this.renderer.forward();
  }

  // â”€â”€ State Polling â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Poll the renderer for state updates.
   * Sprint 3: Polling approach due to WebView event limitations.
   * Future: Replace with Tauri event listeners when stable.
   */
  private startPolling(): void {
    if (this.pollInterval) return;

    this.pollInterval = setInterval(async () => {
      if (!this.activeTabId) return;

      try {
        const [title, url, canGoBack, canGoForward] = await Promise.all([
          this.renderer.getTitle(),
          this.renderer.getUrl(),
          this.renderer.canGoBack(),
          this.renderer.canGoForward(),
        ]);

        this.updateTabState(this.activeTabId, {
          title,
          url,
          canGoBack,
          canGoForward,
        });

        this.emitter.emit({
          type: "title:update",
          tabId: this.activeTabId,
          title,
        });

        this.emitter.emit({
          type: "history:update",
          tabId: this.activeTabId,
          canGoBack,
          canGoForward,
        });
      } catch {
        // Renderer not ready yet
      }
    }, 500);
  }

  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  // â”€â”€ Event Subscription â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  on(type: BrowserEventType, listener: (event: BrowserEvent) => void): () => void {
    return this.emitter.on(type, listener);
  }

  // â”€â”€ Internal Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private updateTabState(
    tabId: string,
    updates: Partial<import("./BrowserTypes").TabBrowserState>,
  ): void {
    const session = this.sessions.get(tabId);
    if (session) {
      session.state = { ...session.state, ...updates };
    }
    useBrowserStore.getState().updateTabState(tabId, updates);
  }

  getSessionState(tabId: string): import("./BrowserTypes").TabBrowserState | null {
    return this.sessions.get(tabId)?.state ?? null;
  }
}

// Singleton â€” one facade instance for the application lifetime
export const browserFacade = new BrowserFacade();