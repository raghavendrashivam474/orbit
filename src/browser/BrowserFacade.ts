/**
 * BrowserFacade.ts
 * Orbit Browser Layer - Public API
 * Sprint 3: Debug logging added to trace navigation.
 */

import type { RendererInterface } from "./RendererInterface";
import type { BrowserEvent, BrowserEventType } from "./BrowserEvents";
import type { RendererSession } from "./RendererSession";
import type { BrowserError, TabBrowserState } from "./BrowserTypes";
import type { ContentBounds } from "@/layout/LayoutTypes";
import { WebView2Renderer } from "./WebView2Renderer";
import { BrowserEventEmitter } from "./BrowserEvents";
import { createRendererSession } from "./RendererSession";
import { LayoutManager } from "@/layout/LayoutManager";
import { resolveUrl } from "@/services/navigation/urlResolver";
import { useBrowserStore } from "@/store/browserStore";

interface TabEntry {
  session:  RendererSession;
  renderer: RendererInterface;
}

class BrowserFacade {
  private readonly emitter  = new BrowserEventEmitter();
  private readonly tabs     = new Map<string, TabEntry>();
  private activeTabId: string | null = null;
  private currentBounds: ContentBounds = { x: 220, y: 128, width: 1060, height: 672 };
  private pollInterval: ReturnType<typeof setInterval> | null = null;

  registerTab(tabId: string, initialUrl = ""): void {
    if (this.tabs.has(tabId)) return;
    console.warn("[BrowserFacade] registerTab:", tabId);
    const session  = createRendererSession(tabId, initialUrl);
    const renderer = new WebView2Renderer(`browser-${tabId}`);
    this.tabs.set(tabId, { session, renderer });
    useBrowserStore.getState().initTabState(tabId, initialUrl);
  }

  async activateTab(tabId: string): Promise<void> {
    const entry = this.tabs.get(tabId);
    if (!entry) {
      console.warn("[BrowserFacade] activateTab: no entry for", tabId);
      return;
    }

    if (this.activeTabId && this.activeTabId !== tabId) {
      const prev = this.tabs.get(this.activeTabId);
      if (prev) {
        prev.session.isActive = false;
        await prev.renderer.hide().catch(console.warn);
      }
    }

    entry.session.isActive = true;
    this.activeTabId = tabId;
    console.warn("[BrowserFacade] activateTab:", tabId, "bounds:", this.currentBounds);

    await entry.renderer.show().catch(console.warn);
    await entry.renderer.updateBounds(this.currentBounds).catch(console.warn);

    if (entry.session.state.url && !entry.session.state.error) {
      await entry.renderer.navigate(entry.session.state.url).catch(console.warn);
    }

    this.startPolling();
  }

  async destroyTab(tabId: string): Promise<void> {
    const entry = this.tabs.get(tabId);
    if (!entry) return;
    await entry.renderer.destroy().catch(console.warn);
    this.tabs.delete(tabId);
    useBrowserStore.getState().removeTabState(tabId);
  }

  async updateBounds(bounds: ContentBounds): Promise<void> {
    if (LayoutManager.boundsEqual(this.currentBounds, bounds)) return;
    this.currentBounds = bounds;
    console.warn("[BrowserFacade] updateBounds:", bounds);

    if (this.activeTabId) {
      const entry = this.tabs.get(this.activeTabId);
      if (entry) {
        await entry.renderer.updateBounds(bounds).catch(console.warn);
      }
    }
  }

  async navigate(input: string): Promise<void> {
    console.warn("[BrowserFacade] navigate called:", input);
    console.warn("[BrowserFacade] activeTabId:", this.activeTabId);
    console.warn("[BrowserFacade] tabs count:", this.tabs.size);

    if (!this.activeTabId) {
      console.warn("[BrowserFacade] navigate: no active tab");
      return;
    }
    const entry = this.tabs.get(this.activeTabId);
    if (!entry) {
      console.warn("[BrowserFacade] navigate: no entry for active tab");
      return;
    }

    const resolved = resolveUrl(input);
    const url = resolved.href;
    console.warn("[BrowserFacade] resolved URL:", url);

    this.emitter.emit({ type: "navigation:start", tabId: this.activeTabId, url });
    this.updateTabState(this.activeTabId, {
      url, isLoading: true, progress: 0, error: null,
    });

    try {
      console.warn("[BrowserFacade] calling renderer.navigate...");
      await entry.renderer.navigate(url);
      console.warn("[BrowserFacade] renderer.navigate succeeded");
      await entry.renderer.updateBounds(this.currentBounds);
      this.startPolling();
    } catch (err) {
      console.warn("[BrowserFacade] renderer.navigate FAILED:", err);
      const error: BrowserError = {
        code:    "CONNECTION_FAILED",
        message: err instanceof Error ? err.message : String(err),
        url,
      };
      this.updateTabState(this.activeTabId, { isLoading: false, error });
      this.emitter.emit({ type: "navigation:error", tabId: this.activeTabId, error });
    }
  }

  async reload(): Promise<void> {
    if (!this.activeTabId) return;
    const entry = this.tabs.get(this.activeTabId);
    if (!entry) return;
    this.updateTabState(this.activeTabId, { isLoading: true, progress: 0 });
    await entry.renderer.reload().catch(console.warn);
  }

  async stop(): Promise<void> {
    if (!this.activeTabId) return;
    const entry = this.tabs.get(this.activeTabId);
    if (!entry) return;
    this.updateTabState(this.activeTabId, { isLoading: false });
    await entry.renderer.stop().catch(console.warn);
  }

  async back(): Promise<void> {
    if (!this.activeTabId) return;
    const entry = this.tabs.get(this.activeTabId);
    if (entry) await entry.renderer.back().catch(console.warn);
  }

  async forward(): Promise<void> {
    if (!this.activeTabId) return;
    const entry = this.tabs.get(this.activeTabId);
    if (entry) await entry.renderer.forward().catch(console.warn);
  }

  private startPolling(): void {
    if (this.pollInterval) return;
    this.pollInterval = setInterval(async () => {
      if (!this.activeTabId) return;
      const entry = this.tabs.get(this.activeTabId);
      if (!entry) return;
      try {
        const [title, url, canGoBack, canGoForward] = await Promise.all([
          entry.renderer.getTitle(),
          entry.renderer.getUrl(),
          entry.renderer.canGoBack(),
          entry.renderer.canGoForward(),
        ]);
        this.updateTabState(this.activeTabId, {
          title, url, canGoBack, canGoForward, isLoading: false,
        });
        this.emitter.emit({ type: "title:update", tabId: this.activeTabId, title });
        this.emitter.emit({
          type: "history:update", tabId: this.activeTabId, canGoBack, canGoForward,
        });
      } catch {
        // Renderer not ready
      }
    }, 500);
  }

  stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  on(type: BrowserEventType, listener: (event: BrowserEvent) => void): () => void {
    return this.emitter.on(type, listener);
  }

  private updateTabState(tabId: string, updates: Partial<TabBrowserState>): void {
    const entry = this.tabs.get(tabId);
    if (entry) {
      entry.session.state = { ...entry.session.state, ...updates };
    }
    useBrowserStore.getState().updateTabState(tabId, updates);
  }

  getSessionState(tabId: string): TabBrowserState | null {
    return this.tabs.get(tabId)?.session.state ?? null;
  }
}

export const browserFacade = new BrowserFacade();