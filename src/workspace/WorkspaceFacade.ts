import type { Workspace, CreateWorkspaceInput, UpdateWorkspaceInput } from "./WorkspaceTypes";
import { WorkspaceEventEmitter, type WorkspaceEvent, type WorkspaceEventType } from "./WorkspaceEvents";
import { WorkspaceRepository } from "@/repositories/WorkspaceRepository";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useTabStore } from "@/store/tabStore";
import { SettingsRepository } from "@/repositories/SettingsRepository";

class WorkspaceFacadeClass {
  private readonly emitter = new WorkspaceEventEmitter();

  async initialize(): Promise<void> {
    const workspaces = await WorkspaceRepository.list();
    useWorkspaceStore.getState().setWorkspaces(workspaces);

    const stored = await SettingsRepository.get("active_workspace_id").catch(() => null);
    const targetId = stored
      ? (JSON.parse(stored) as string)
      : workspaces[0]?.id ?? null;

    if (targetId) {
      useWorkspaceStore.getState().setActiveWorkspaceId(targetId);
    }
  }

  async create(input: CreateWorkspaceInput): Promise<Workspace> {
    const workspace = await WorkspaceRepository.create(input);
    useWorkspaceStore.getState().addWorkspace(workspace);
    this.emitter.emit({ type: "workspace:created", workspace });
    return workspace;
  }

  async update(input: UpdateWorkspaceInput): Promise<Workspace> {
    const workspace = await WorkspaceRepository.update(input);
    useWorkspaceStore.getState().updateWorkspace(workspace);
    this.emitter.emit({ type: "workspace:updated", workspace });
    return workspace;
  }

  async delete(id: string): Promise<void> {
    const workspaces = useWorkspaceStore.getState().workspaces;
    if (workspaces.length <= 1) {
      throw new Error("Cannot delete the last workspace.");
    }

    if (useWorkspaceStore.getState().activeWorkspaceId === id) {
      const next = workspaces.find((w) => w.id !== id);
      if (next) await this.switchTo(next.id);
    }

    await WorkspaceRepository.delete(id);
    useWorkspaceStore.getState().removeWorkspace(id);
    this.emitter.emit({ type: "workspace:deleted", id });
  }

  /**
   * Switch active workspace. Tabs are not destroyed.
   * Sets active tab to first tab of new workspace, or creates one if empty.
   */
  async switchTo(workspaceId: string): Promise<void> {
    const from = useWorkspaceStore.getState().activeWorkspaceId;
    if (from === workspaceId) return;

    useWorkspaceStore.getState().setActiveWorkspaceId(workspaceId);

    await SettingsRepository.set(
      "active_workspace_id",
      JSON.stringify(workspaceId)
    ).catch(console.warn);

    await WorkspaceRepository.activate(workspaceId).catch(console.warn);

    // Set active tab to first tab in new workspace, or create one
    const wsTabs = useTabStore.getState().getWorkspaceTabs(workspaceId);
    if (wsTabs.length === 0) {
      useTabStore.getState().addTab(workspaceId);
    } else {
      useTabStore.getState().setActiveTab(wsTabs[0].id);
    }

    const workspace = useWorkspaceStore
      .getState()
      .workspaces.find((w) => w.id === workspaceId) ?? null;

    if (workspace) {
      this.emitter.emit({
        type: "workspace:switched",
        from,
        to: workspaceId,
        workspace,
      });
    }
  }

  on(
    type: WorkspaceEventType,
    listener: (event: WorkspaceEvent) => void,
  ): () => void {
    return this.emitter.on(type, listener);
  }
}

export const workspaceFacade = new WorkspaceFacadeClass();