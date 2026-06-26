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
import { invoke } from "@/core/ipc/bridge";
import { logger } from "@/services/logger/logger";

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
    const session  = createRendererSession(tabId, initialUrl);
    const renderer = new WebView2Renderer(tabId);
    this.tabs.set(tabId, { session, renderer });
    useBrowserStore.getState().initTabState(tabId, initialUrl);
    logger.info("[Facade] registerTab " + tabId.slice(0, 8)).catch(() => {});
  }

  private async hideAllExcept(exceptTabId: string | null): Promise<void> {
    const summary = Array.from(this.tabs.entries())
      .map(([id, e]) => id.slice(0, 8) + (e.session.state.url ? "(url)" : "(empty)"))
      .join(", ");
    logger.info("[Facade] hideAllExcept except=" + (exceptTabId?.slice(0,8) ?? "null") + " tabs=[" + summary + "]").catch(() => {});

    for (const [tabId, entry] of this.tabs) {
      if (tabId === exceptTabId) continue;
      if (!entry.session.state.url) continue;
      logger.info("[Facade] HIDING " + tabId.slice(0, 8)).catch(() => {});
      await invoke<void>("browser_hide", { id: tabId }).catch((e) => {
        logger.warn("[Facade] hide FAILED " + e).catch(() => {});
      });
    }
  }

  async activateTab(tabId: string): Promise<void> {
    logger.info("[Facade] activateTab " + tabId.slice(0, 8)).catch(() => {});
    const entry = this.tabs.get(tabId);
    if (!entry) {
      logger.warn("[Facade] activateTab NO ENTRY for " + tabId.slice(0,8)).catch(() => {});
      return;
    }

    await this.hideAllExcept(tabId);

    if (this.activeTabId && this.activeTabId !== tabId) {
      const prev = this.tabs.get(this.activeTabId);
      if (prev) prev.session.isActive = false;
    }

    entry.session.isActive = true;
    this.activeTabId = tabId;

    if (entry.session.state.url && !entry.session.state.error) {
      logger.info("[Facade] SHOWING " + tabId.slice(0, 8)).catch(() => {});
      await entry.renderer.show().catch(() => {});
      await entry.renderer.updateBounds(this.currentBounds).catch(() => {});
    } else {
      logger.info("[Facade] tab has no URL, not showing").catch(() => {});
    }

    this.startPolling();
  }

  async destroyTab(tabId: string): Promise<void> {
    const entry = this.tabs.get(tabId);
    if (!entry) return;
    await entry.renderer.destroy().catch(() => {});
    this.tabs.delete(tabId);
    useBrowserStore.getState().removeTabState(tabId);
  }

  async updateBounds(bounds: ContentBounds): Promise<void> {
    if (LayoutManager.boundsEqual(this.currentBounds, bounds)) return;
    this.currentBounds = bounds;

    if (this.activeTabId) {
      const entry = this.tabs.get(this.activeTabId);
      if (entry && entry.session.state.url) {
        await entry.renderer.updateBounds(bounds).catch(() => {});
      }
    }
  }

  async navigate(input: string): Promise<void> {
    if (!this.activeTabId) return;
    const entry = this.tabs.get(this.activeTabId);
    if (!entry) return;

    const resolved = resolveUrl(input);
    const url = resolved.href;

    this.emitter.emit({ type: "navigation:start", tabId: this.activeTabId, url });
    this.updateTabState(this.activeTabId, {
      url, isLoading: true, progress: 0, error: null,
    });

    try {
      await entry.renderer.navigate(url);
      await entry.renderer.updateBounds(this.currentBounds);
      this.startPolling();
    } catch (err) {
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
    await entry.renderer.reload().catch(() => {});
  }

  async stop(): Promise<void> {
    if (!this.activeTabId) return;
    const entry = this.tabs.get(this.activeTabId);
    if (!entry) return;
    this.updateTabState(this.activeTabId, { isLoading: false });
    await entry.renderer.stop().catch(() => {});
  }

  async back(): Promise<void> {
    if (!this.activeTabId) return;
    const entry = this.tabs.get(this.activeTabId);
    if (entry) await entry.renderer.back().catch(() => {});
  }

  async forward(): Promise<void> {
    if (!this.activeTabId) return;
    const entry = this.tabs.get(this.activeTabId);
    if (entry) await entry.renderer.forward().catch(() => {});
  }

  private startPolling(): void {
    if (this.pollInterval) return;
    this.pollInterval = setInterval(async () => {
      if (!this.activeTabId) return;
      const entry = this.tabs.get(this.activeTabId);
      if (!entry) return;
      if (!entry.session.state.url) return;
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
        // Not ready
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