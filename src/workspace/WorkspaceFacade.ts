/**
 * WorkspaceFacade.ts
 * Orbit Workspace â€” Public API
 *
 * The shell communicates with workspaces exclusively through this facade.
 * No component imports from WorkspaceRepository or WorkspaceService directly.
 *
 * See ADR-0007 for architectural rationale.
 */

import type {
  Workspace,
  WorkspaceTab,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
} from "./WorkspaceTypes";
import { WorkspaceEventEmitter, type WorkspaceEvent, type WorkspaceEventType } from "./WorkspaceEvents";
import { WorkspaceRepository } from "@/repositories/WorkspaceRepository";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useTabStore } from "@/store/tabStore";
import { browserFacade } from "@/browser/BrowserFacade";
import { SettingsRepository } from "@/repositories/SettingsRepository";

class WorkspaceFacadeClass {
  private readonly emitter       = new WorkspaceEventEmitter();
  private activeWorkspaceId: string | null = null;

  // â”€â”€ Initialization â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async initialize(): Promise<void> {
    const workspaces = await WorkspaceRepository.list();
    useWorkspaceStore.getState().setWorkspaces(workspaces);

    // Load last active workspace from settings
    const stored = await SettingsRepository.get("active_workspace_id").catch(() => null);
    const targetId = stored
      ? (JSON.parse(stored) as string)
      : workspaces[0]?.id ?? null;

    if (targetId) {
      await this.switchTo(targetId, { restoreTabs: true });
    }
  }

  // â”€â”€ Workspace CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

    // Switch to another workspace first
    if (this.activeWorkspaceId === id) {
      const next = workspaces.find((w) => w.id !== id);
      if (next) await this.switchTo(next.id, { restoreTabs: true });
    }

    await WorkspaceRepository.delete(id);
    useWorkspaceStore.getState().removeWorkspace(id);
    this.emitter.emit({ type: "workspace:deleted", id });
  }

  // â”€â”€ Workspace Switching â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async switchTo(
    workspaceId: string,
    options: { restoreTabs: boolean } = { restoreTabs: true },
  ): Promise<void> {
    const from = this.activeWorkspaceId;

    // Save current workspace tabs before switching
    if (from && from !== workspaceId) {
      await this.saveCurrentTabs(from);
    }

    // Destroy all current renderers
    if (from && from !== workspaceId) {
      await this.destroyAllRenderers();
    }

    this.activeWorkspaceId = workspaceId;

    // Persist active workspace
    await SettingsRepository.set(
      "active_workspace_id",
      JSON.stringify(workspaceId)
    ).catch(console.warn);

    await WorkspaceRepository.activate(workspaceId).catch(console.warn);

    const workspace = useWorkspaceStore
      .getState()
      .workspaces.find((w) => w.id === workspaceId) ?? null;

    useWorkspaceStore.getState().setActiveWorkspaceId(workspaceId);

    // Restore tabs for the new workspace
    if (options.restoreTabs) {
      await this.restoreTabs(workspaceId);
    }

    if (workspace) {
      this.emitter.emit({
        type: "workspace:switched",
        from,
        to: workspaceId,
        workspace,
      });
    }
  }

  // â”€â”€ Tab Management â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  private async saveCurrentTabs(workspaceId: string): Promise<void> {
    const { tabs, activeTabId } = useTabStore.getState();
    const workspaceTabs = tabs
      .filter((t) => t.workspaceId === workspaceId)
      .map((t, i) => ({
        tabId:    t.id,
        url:      t.url ?? "",
        title:    t.title ?? "New Tab",
        position: i,
      }));

    if (workspaceTabs.length === 0) return;

    await WorkspaceRepository.saveTabs({
      workspaceId,
      activeTab: activeTabId,
      tabs:      workspaceTabs,
    }).catch(console.warn);
  }

  private async restoreTabs(workspaceId: string): Promise<void> {
    const savedTabs = await WorkspaceRepository.loadTabs(workspaceId);
    const tabStore  = useTabStore.getState();

    // Remove all current tabs for this workspace
    const currentTabs = tabStore.tabs.filter(
      (t) => t.workspaceId === workspaceId
    );
    currentTabs.forEach((t) => tabStore.removeTab(t.id));

    if (savedTabs.length === 0) {
      // No saved tabs â€” open a single new tab
      tabStore.addTab({ workspaceId });
      return;
    }

    // Restore saved tabs
    let activeTabId = "";
    savedTabs.forEach((savedTab) => {
      tabStore.addTab({
        id:          savedTab.tabId,
        workspaceId,
        url:         savedTab.url,
        title:       savedTab.title,
        isLoading:   false,
      });
      if (savedTab.isActive) {
        activeTabId = savedTab.tabId;
      }
    });

    if (activeTabId) {
      tabStore.setActiveTab(activeTabId);
    }
  }

  private async destroyAllRenderers(): Promise<void> {
    const { tabs } = useTabStore.getState();
    const destroyPromises = tabs.map((tab) =>
      browserFacade.destroyTab(tab.id).catch(console.warn)
    );
    await Promise.all(destroyPromises);
  }

  // â”€â”€ Active Workspace â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  getActiveWorkspaceId(): string | null {
    return this.activeWorkspaceId;
  }

  // â”€â”€ Events â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  on(
    type: WorkspaceEventType,
    listener: (event: WorkspaceEvent) => void,
  ): () => void {
    return this.emitter.on(type, listener);
  }
}

export const workspaceFacade = new WorkspaceFacadeClass();