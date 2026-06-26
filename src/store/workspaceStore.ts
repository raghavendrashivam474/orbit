/**
 * workspaceStore.ts
 * Orbit Workspace Store
 *
 * Global index of all workspaces.
 * Updated exclusively by WorkspaceFacade.
 * Components read from this store â€” they never write directly.
 */

import { create } from "zustand";
import type { Workspace } from "@/workspace/WorkspaceTypes";

interface WorkspaceStoreState {
  workspaces:        Workspace[];
  activeWorkspaceId: string | null;
  initialized:       boolean;

  setWorkspaces:       (workspaces: Workspace[])  => void;
  addWorkspace:        (workspace: Workspace)      => void;
  updateWorkspace:     (workspace: Workspace)      => void;
  removeWorkspace:     (id: string)                => void;
  setActiveWorkspaceId:(id: string)                => void;
  setInitialized:      (value: boolean)            => void;
}

export const useWorkspaceStore = create<WorkspaceStoreState>()((set) => ({
  workspaces:        [],
  activeWorkspaceId: null,
  initialized:       false,

  setWorkspaces: (workspaces): void => {
    set({ workspaces });
  },

  addWorkspace: (workspace): void => {
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    }));
  },

  updateWorkspace: (workspace): void => {
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === workspace.id ? workspace : w
      ),
    }));
  },

  removeWorkspace: (id): void => {
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.id !== id),
    }));
  },

  setActiveWorkspaceId: (id): void => {
    set({ activeWorkspaceId: id });
  },

  setInitialized: (value): void => {
    set({ initialized: value });
  },
}));