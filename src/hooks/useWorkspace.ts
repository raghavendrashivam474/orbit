import { useCallback } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { workspaceFacade } from "@/workspace/WorkspaceFacade";
import type { CreateWorkspaceInput, UpdateWorkspaceInput, Workspace } from "@/workspace/WorkspaceTypes";

interface UseWorkspaceReturn {
  workspaces:        Workspace[];
  activeWorkspaceId: string | null;
  activeWorkspace:   Workspace | null;
  switchTo: (id: string) => Promise<void>;
  create:   (input: CreateWorkspaceInput) => Promise<Workspace>;
  update:   (input: UpdateWorkspaceInput) => Promise<Workspace>;
  remove:   (id: string) => Promise<void>;
}

export function useWorkspace(): UseWorkspaceReturn {
  const { workspaces, activeWorkspaceId } = useWorkspaceStore();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? null;

  const switchTo = useCallback(async (id: string): Promise<void> => {
    await workspaceFacade.switchTo(id);
  }, []);

  const create = useCallback(async (input: CreateWorkspaceInput): Promise<Workspace> => {
    return workspaceFacade.create(input);
  }, []);

  const update = useCallback(async (input: UpdateWorkspaceInput): Promise<Workspace> => {
    return workspaceFacade.update(input);
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    await workspaceFacade.delete(id);
  }, []);

  return { workspaces, activeWorkspaceId, activeWorkspace, switchTo, create, update, remove };
}