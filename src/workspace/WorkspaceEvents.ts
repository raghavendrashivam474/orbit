/**
 * WorkspaceEvents.ts
 * Orbit Workspace â€” Event Definitions
 */

import type { Workspace } from "./WorkspaceTypes";

export type WorkspaceEventType =
  | "workspace:created"
  | "workspace:updated"
  | "workspace:deleted"
  | "workspace:switched"
  | "workspace:tabs:saved"
  | "workspace:tabs:loaded";

export interface WorkspaceCreatedEvent {
  type:      "workspace:created";
  workspace: Workspace;
}

export interface WorkspaceUpdatedEvent {
  type:      "workspace:updated";
  workspace: Workspace;
}

export interface WorkspaceDeletedEvent {
  type: "workspace:deleted";
  id:   string;
}

export interface WorkspaceSwitchedEvent {
  type:      "workspace:switched";
  from:      string | null;
  to:        string;
  workspace: Workspace;
}

export type WorkspaceEvent =
  | WorkspaceCreatedEvent
  | WorkspaceUpdatedEvent
  | WorkspaceDeletedEvent
  | WorkspaceSwitchedEvent;

type WorkspaceEventListener = (event: WorkspaceEvent) => void;

export class WorkspaceEventEmitter {
  private readonly listeners = new Map<
    WorkspaceEventType,
    Set<WorkspaceEventListener>
  >();

  on(type: WorkspaceEventType, listener: WorkspaceEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);
    return () => this.listeners.get(type)?.delete(listener);
  }

  emit(event: WorkspaceEvent): void {
    this.listeners.get(event.type)?.forEach((listener) => {
      try { listener(event); } catch (err) { console.warn(err); }
    });
  }
}