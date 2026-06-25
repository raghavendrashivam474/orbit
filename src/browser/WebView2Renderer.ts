/**
 * WebView2Renderer.ts
 * Orbit Browser Layer - Current Renderer Implementation
 *
 * Uses Tauri v2.11.x child webview API.
 * All implementation details are private to this file.
 * The rest of Orbit interacts only through RendererInterface.
 *
 * See ADR-0003 for architectural rationale.
 */

import type { RendererInterface } from "./RendererInterface";
import type { ContentBounds } from "@/layout/LayoutTypes";
import { invoke } from "@/core/ipc/bridge";

export class WebView2Renderer implements RendererInterface {
  private readonly id: string;
  private initialized = false;

  constructor(id: string) {
    this.id = id;
  }

  async navigate(url: string): Promise<void> {
    if (!this.initialized) {
      // First navigation creates the child webview
      await invoke("browser_create", { id: this.id, url });
      this.initialized = true;
    } else {
      await invoke("browser_navigate", { id: this.id, url });
    }
  }

  async reload(): Promise<void> {
    if (!this.initialized) return;
    await invoke("browser_reload", { id: this.id });
  }

  async stop(): Promise<void> {
    if (!this.initialized) return;
    await invoke("browser_stop", { id: this.id });
  }

  async back(): Promise<void> {
    if (!this.initialized) return;
    await invoke("browser_back", { id: this.id });
  }

  async forward(): Promise<void> {
    if (!this.initialized) return;
    await invoke("browser_forward", { id: this.id });
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
    if (!this.initialized) return;
    await invoke("browser_update_bounds", {
      id: this.id,
      x:      bounds.x,
      y:      bounds.y,
      width:  bounds.width,
      height: bounds.height,
    });
  }

  async show(): Promise<void> {
    if (!this.initialized) return;
    await invoke("browser_show", { id: this.id });
  }

  async hide(): Promise<void> {
    if (!this.initialized) return;
    await invoke("browser_hide", { id: this.id });
  }

  async destroy(): Promise<void> {
    if (!this.initialized) return;
    await invoke("browser_destroy", { id: this.id });
    this.initialized = false;
  }
}