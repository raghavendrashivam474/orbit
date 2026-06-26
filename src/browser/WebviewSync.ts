/**
 * WebviewSync.ts
 *
 * The ONLY place that manages webview lifecycle.
 * Pure imperative function. Called explicitly after user actions.
 *
 * Sprint 5.3: Adds observer notification on successful navigation.
 * WebviewSync only reports that navigation occurred. It does not
 * know or care who is listening (PersistenceService, future AI memory, etc).
 */

import { invoke } from "@/core/ipc/bridge";
import { useTabStore, type Tab } from "@/store/tabStore";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { LayoutManager } from "@/layout/LayoutManager";
import { useSettingsStore } from "@/store/settingsStore";
import { LAYOUT } from "@/layout/LayoutConstants";
import {
  type NavigationObserver,
  type NavigationEvent,
  deriveTitleFromUrl,
} from "./NavigationObserver";

// Track which tabs have webviews in Rust
const liveWebviews = new Set<string>();

// Registered observers
const observers = new Set<NavigationObserver>();

let currentBounds = { x: 220, y: 128, width: 1060, height: 672 };
let suppressed = false;

function notifyObservers(event: NavigationEvent): void {
  observers.forEach((observer) => {
    try {
      observer.onNavigate(event);
    } catch (err) {
      console.warn("[WebviewSync] observer threw", err);
    }
  });
}

export const WebviewSync = {
  /**
   * Subscribe to navigation events.
   * Returns an unsubscribe function.
   *
   * Usage:
   *   const unsub = WebviewSync.subscribe(persistenceObserver);
   *   // later:
   *   unsub();
   */
  subscribe(observer: NavigationObserver): () => void {
    observers.add(observer);
    return () => { observers.delete(observer); };
  },

  /** Update bounds used for new webviews and resizing the active one */
  setBounds(bounds: { x: number; y: number; width: number; height: number }): void {
    currentBounds = bounds;
    const activeTab = useTabStore.getState().getActiveTab();
    if (activeTab && liveWebviews.has(activeTab.id)) {
      invoke("browser_update_bounds", {
        id: activeTab.id,
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      }).catch(() => {});
    }
  },

  /** Temporarily hide ALL webviews (e.g., when on a shell page) */
  hideAll(): void {
    suppressed = true;
    for (const tabId of liveWebviews) {
      invoke("browser_hide", { id: tabId }).catch(() => {});
    }
  },

  /** Resume showing the active webview */
  resume(): void {
    suppressed = false;
    this.sync();
  },

  /**
   * THE main sync function.
   * Looks at current state and makes Rust match.
   */
  async sync(): Promise<void> {
    if (suppressed) return;

    const { tabs, activeTabId } = useTabStore.getState();
    const { activeWorkspaceId } = useWorkspaceStore.getState();

    const activeTab = tabs.find((t) => t.id === activeTabId);

    for (const tabId of liveWebviews) {
      if (tabId !== activeTabId) {
        await invoke("browser_hide", { id: tabId }).catch(() => {});
      }
    }

    if (
      activeTab &&
      activeTab.workspaceId === activeWorkspaceId &&
      activeTab.url
    ) {
      if (liveWebviews.has(activeTab.id)) {
        await invoke("browser_show", { id: activeTab.id }).catch(() => {});
        await invoke("browser_update_bounds", {
          id: activeTab.id,
          x: currentBounds.x,
          y: currentBounds.y,
          width: currentBounds.width,
          height: currentBounds.height,
        }).catch(() => {});
      } else {
        await this.createWebview(activeTab);
      }
    }
  },

  /** Create a new webview for a tab and load its URL */
  async createWebview(tab: Tab): Promise<void> {
    if (liveWebviews.has(tab.id)) return;
    if (!tab.url) return;

    try {
      await invoke("browser_create", {
        id: tab.id,
        url: tab.url,
        x: currentBounds.x,
        y: currentBounds.y,
        width: currentBounds.width,
        height: currentBounds.height,
      });
      liveWebviews.add(tab.id);
    } catch (e) {
      console.warn("[WebviewSync] createWebview failed", e);
    }
  },

  /** Navigate the active tab's webview (creates if needed) */
  async navigate(url: string): Promise<void> {
    const activeTab = useTabStore.getState().getActiveTab();
    if (!activeTab) return;

    const derivedTitle = deriveTitleFromUrl(url);

    useTabStore.getState().updateTab(activeTab.id, {
      url,
      isLoading: true,
      title:     derivedTitle,
    });

    let success = false;

    if (liveWebviews.has(activeTab.id)) {
      try {
        await invoke("browser_navigate", { id: activeTab.id, url });
        success = true;
      } catch (e) {
        console.warn("[WebviewSync] navigate failed", e);
      }
    } else {
      const before = liveWebviews.has(activeTab.id);
      await this.createWebview({ ...activeTab, url });
      success = liveWebviews.has(activeTab.id) && !before;
    }

    await this.sync();

    // Notify observers AFTER the navigation has actually been issued.
    // Producers only report success.
    if (success) {
      notifyObservers({
        tabId:       activeTab.id,
        workspaceId: activeTab.workspaceId,
        url,
        title:       derivedTitle,
        at:          new Date().toISOString(),
      });
    }
  },

  async destroyWebview(tabId: string): Promise<void> {
    if (!liveWebviews.has(tabId)) return;
    await invoke("browser_destroy", { id: tabId }).catch(() => {});
    liveWebviews.delete(tabId);
  },

  async reload(): Promise<void> {
    const activeTab = useTabStore.getState().getActiveTab();
    if (!activeTab || !liveWebviews.has(activeTab.id)) return;
    await invoke("browser_reload", { id: activeTab.id }).catch(() => {});
  },

  async stop(): Promise<void> {
    const activeTab = useTabStore.getState().getActiveTab();
    if (!activeTab || !liveWebviews.has(activeTab.id)) return;
    await invoke("browser_stop", { id: activeTab.id }).catch(() => {});
  },

  async back(): Promise<void> {
    const activeTab = useTabStore.getState().getActiveTab();
    if (!activeTab || !liveWebviews.has(activeTab.id)) return;
    await invoke("browser_back", { id: activeTab.id }).catch(() => {});
  },

  async forward(): Promise<void> {
    const activeTab = useTabStore.getState().getActiveTab();
    if (!activeTab || !liveWebviews.has(activeTab.id)) return;
    await invoke("browser_forward", { id: activeTab.id }).catch(() => {});
  },

  computeBoundsFromSidebar(): void {
    const sidebarCollapsed = useSettingsStore.getState().sidebarCollapsed;
    const sidebarWidth = sidebarCollapsed
      ? LAYOUT.SIDEBAR_COLLAPSED
      : LAYOUT.SIDEBAR_EXPANDED;

    const bounds = LayoutManager.getContentBounds({
      windowWidth:    window.innerWidth,
      windowHeight:   window.innerHeight,
      sidebarWidth,
      titlebarHeight: LAYOUT.TITLEBAR_HEIGHT,
      tabbarHeight:   LAYOUT.TABBAR_HEIGHT,
      toolbarHeight:  LAYOUT.TOOLBAR_HEIGHT,
    });

    this.setBounds(bounds);
  },
};