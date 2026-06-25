/**
 * RendererInterface.ts
 * Orbit Browser Layer - Renderer Contract
 *
 * Every rendering engine must implement this interface.
 * This is the only contract the browser layer depends on.
 *
 * Current implementation: WebView2Renderer
 * Future implementations: ChromiumRenderer, CEFRenderer, ServoRenderer
 *
 * See ADR-0003 for architectural rationale.
 */

export interface RendererInterface {
  /**
   * Navigate to the given URL.
   * URL must be fully resolved before calling this method.
   * Use urlResolver.ts to resolve user input first.
   */
  navigate(url: string): Promise<void>;

  /** Reload the current page. */
  reload(): Promise<void>;

  /** Stop the current page load. */
  stop(): Promise<void>;

  /** Navigate backward in history. No-op if unavailable. */
  back(): Promise<void>;

  /** Navigate forward in history. No-op if unavailable. */
  forward(): Promise<void>;

  /** Returns the current page title. */
  getTitle(): Promise<string>;

  /** Returns the current URL. */
  getUrl(): Promise<string>;

  /** Returns true if backward navigation is available. */
  canGoBack(): Promise<boolean>;

  /** Returns true if forward navigation is available. */
  canGoForward(): Promise<boolean>;

  /**
   * Destroy the renderer and release all associated resources.
   * Must be called when a tab is permanently closed.
   */
  destroy(): Promise<void>;
}