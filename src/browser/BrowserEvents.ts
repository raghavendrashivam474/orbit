/**
 * BrowserEvents.ts
 * Orbit Browser Layer - Event System
 *
 * Typed event definitions for browser state changes.
 * Components subscribe to these events via BrowserFacade.
 */

import type { BrowserError } from "./BrowserTypes";

export type BrowserEventType =
  | "navigation:start"
  | "navigation:commit"
  | "navigation:finish"
  | "navigation:error"
  | "title:update"
  | "progress:update"
  | "history:update";

export interface NavigationStartEvent {
  type: "navigation:start";
  tabId: string;
  url: string;
}

export interface NavigationCommitEvent {
  type: "navigation:commit";
  tabId: string;
  url: string;
}

export interface NavigationFinishEvent {
  type: "navigation:finish";
  tabId: string;
  url: string;
}

export interface NavigationErrorEvent {
  type: "navigation:error";
  tabId: string;
  error: BrowserError;
}

export interface TitleUpdateEvent {
  type: "title:update";
  tabId: string;
  title: string;
}

export interface ProgressUpdateEvent {
  type: "progress:update";
  tabId: string;
  progress: number;
}

export interface HistoryUpdateEvent {
  type: "history:update";
  tabId: string;
  canGoBack: boolean;
  canGoForward: boolean;
}

export type BrowserEvent =
  | NavigationStartEvent
  | NavigationCommitEvent
  | NavigationFinishEvent
  | NavigationErrorEvent
  | TitleUpdateEvent
  | ProgressUpdateEvent
  | HistoryUpdateEvent;

type BrowserEventListener = (event: BrowserEvent) => void;

/**
 * Simple typed event emitter for browser events.
 * Used internally by BrowserFacade.
 */
export class BrowserEventEmitter {
  private readonly listeners = new Map<BrowserEventType, Set<BrowserEventListener>>();

  on(type: BrowserEventType, listener: BrowserEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(type)?.delete(listener);
    };
  }

  emit(event: BrowserEvent): void {
    this.listeners.get(event.type)?.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.warn("[BrowserEventEmitter] Listener error:", err);
      }
    });
  }

  clear(): void {
    this.listeners.clear();
  }
}