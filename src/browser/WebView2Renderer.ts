/**
 * WebView2Renderer.ts
 * Orbit Browser Layer - Current Renderer Implementation
 */

import type { RendererInterface } from "./RendererInterface";
import type { ContentBounds } from "@/layout/LayoutTypes";
import { invoke } from "@/core/ipc/bridge";

export class WebView2Renderer implements RendererInterface {
  private readonly id: string;
  private initialized = false;
  private lastBounds: ContentBounds = { x: 220, y: 128, width: 800, height: 600 };

  constructor(id: string) {
    this.id = id;
  }

  async navigate(url: string): Promise<void> {
    if (!this.initialized) {
      await invoke<void>("browser_create", {
        id:     this.id,
        url:    url,
        x:      Number(this.lastBounds.x),
        y:      Number(this.lastBounds.y),
        width:  Number(this.lastBounds.width),
        height: Number(this.lastBounds.height),
      });
      this.initialized = true;
    } else {
      await invoke<void>("browser_navigate", {
        id:  this.id,
        url: url,
      });
    }
  }

  async reload(): Promise<void> {
    if (!this.initialized) return;
    await invoke<void>("browser_reload", { id: this.id });
  }

  async stop(): Promise<void> {
    if (!this.initialized) return;
    await invoke<void>("browser_stop", { id: this.id });
  }

  async back(): Promise<void> {
    if (!this.initialized) return;
    await invoke<void>("browser_back", { id: this.id });
  }

  async forward(): Promise<void> {
    if (!this.initialized) return;
    await invoke<void>("browser_forward", { id: this.id });
  }

  async getTitle(): Promise<string> {
    if (!this.initialized) return "New Tab";
    return invoke<string>("browser_get_title", { id: this.id });
  }

  async getUrl(): Promise<string> {
    if (!this.initialized) return "";
    return invoke<string>("browser_get_url", { id: this.id });
  }

  async canGoBack(): Promise<boolean> {
    if (!this.initialized) return false;
    return invoke<boolean>("browser_can_go_back", { id: this.id });
  }

  async canGoForward(): Promise<boolean> {
    if (!this.initialized) return false;
    return invoke<boolean>("browser_can_go_forward", { id: this.id });
  }

  async updateBounds(bounds: ContentBounds): Promise<void> {
    this.lastBounds = bounds;
    if (!this.initialized) return;
    await invoke<void>("browser_update_bounds", {
      id:     this.id,
      x:      Number(bounds.x),
      y:      Number(bounds.y),
      width:  Number(bounds.width),
      height: Number(bounds.height),
    });
  }

  async show(): Promise<void> {
    if (!this.initialized) return;
    await invoke<void>("browser_show", { id: this.id });
  }

  async hide(): Promise<void> {
    if (!this.initialized) return;
    await invoke<void>("browser_hide", { id: this.id });
  }

  async destroy(): Promise<void> {
    if (!this.initialized) return;
    await invoke<void>("browser_destroy", { id: this.id });
    this.initialized = false;
  }
}