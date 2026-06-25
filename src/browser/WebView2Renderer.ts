/**
 * WebView2Renderer.ts
 * Orbit Browser Layer - Current Renderer Implementation
 *
 * Implements RendererInterface using Tauri IPC commands
 * that delegate to the Rust backend WebView control layer.
 *
 * INTERNAL IMPLEMENTATION DETAIL.
 * Nothing outside the browser/ folder should import this directly.
 * Use BrowserFacade instead.
 *
 * See ADR-0003 for architectural rationale.
 */

import type { RendererInterface } from "./RendererInterface";
import { invoke } from "@/core/ipc/bridge";

export class WebView2Renderer implements RendererInterface {
  async navigate(url: string): Promise<void> {
    await invoke("browser_navigate", { url });
  }

  async reload(): Promise<void> {
    await invoke("browser_reload");
  }

  async stop(): Promise<void> {
    await invoke("browser_stop");
  }

  async back(): Promise<void> {
    await invoke("browser_back");
  }

  async forward(): Promise<void> {
    await invoke("browser_forward");
  }

  async getTitle(): Promise<string> {
    return invoke<string>("browser_get_title");
  }

  async getUrl(): Promise<string> {
    return invoke<string>("browser_get_url");
  }

  async canGoBack(): Promise<boolean> {
    return invoke<boolean>("browser_can_go_back");
  }

  async canGoForward(): Promise<boolean> {
    return invoke<boolean>("browser_can_go_forward");
  }

  async destroy(): Promise<void> {
    await invoke("browser_destroy");
  }
}