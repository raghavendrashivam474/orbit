/**
 * WorkspaceFacade.ts
 * Orbit Workspace Facade
 *
 * Sprint 5.4:
 * Preserves workspace context (active tab, tab order) across:
 *   - Workspace switches (in-memory context handoff)
 *   - Application restarts (SQLite persistence)
 *
 * Snapshot restoration uses atomic tab replacement to prevent
 * duplicates that would arise from close-then-add sequences.
 */

import type { Workspace, CreateWorkspaceInput, UpdateWorkspaceInput } from "./WorkspaceTypes";
import { WorkspaceEventEmitter, type WorkspaceEvent, type WorkspaceEventType } from "./WorkspaceEvents";
import { WorkspaceRepository } from "@/repositories/WorkspaceRepository";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useTabStore, type Tab } from "@/store/tabStore";
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

    if (!targetId) return;

    useWorkspaceStore.getState().setActiveWorkspaceId(targetId);
    await this.restoreSnapshot(targetId);
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

  async switchTo(workspaceId: string): Promise<void> {
    const from = useWorkspaceStore.getState().activeWorkspaceId;
    if (from === workspaceId) return;

    // Save outgoing workspace snapshot
    if (from) {
      await this.saveSnapshot(from).catch(console.warn);
    }

    // Switch active workspace
    useWorkspaceStore.getState().setActiveWorkspaceId(workspaceId);

    await SettingsRepository.set(
      "active_workspace_id",
      JSON.stringify(workspaceId)
    ).catch(console.warn);

    await WorkspaceRepository.activate(workspaceId).catch(console.warn);

    // Restore incoming workspace snapshot
    await this.restoreSnapshot(workspaceId);

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

  async saveSnapshot(workspaceId: string): Promise<void> {
    const { tabs, activeTabId } = useTabStore.getState();
    const wsTabs = tabs.filter((t) => t.workspaceId === workspaceId);

    if (wsTabs.length === 0) return;

    const activeInThisWorkspace = wsTabs.find((t) => t.id === activeTabId)?.id
      ?? wsTabs[0]?.id
      ?? "";

    const snapshot = wsTabs.map((tab, index) => ({
      tabId:    tab.id,
      url:      tab.url ?? "",
      title:    tab.title ?? "New Tab",
      position: index,
    }));

    await WorkspaceRepository.saveTabs({
      workspaceId,
      activeTab: activeInThisWorkspace,
      tabs:      snapshot,
    });
  }

  async saveAllSnapshots(): Promise<void> {
    const workspaces = useWorkspaceStore.getState().workspaces;
    await Promise.all(
      workspaces.map((w) => this.saveSnapshot(w.id).catch(console.warn))
    );
  }

  /**
   * Restore a workspace's snapshot atomically.
   *
   * Uses tabStore.replaceWorkspaceTabs to avoid the close-then-add
   * pattern that caused duplication (Sprint 5.4 v1 bug):
   *   - closeTab enforces "keep at least one tab per workspace"
   *   - This prevented the last tab from being closed
   *   - New tabs then added on top → duplicate
   *
   * replaceWorkspaceTabs atomically swaps the workspace's tabs.
   */
  private async restoreSnapshot(workspaceId: string): Promise<void> {
    const savedTabs = await WorkspaceRepository.loadTabs(workspaceId).catch(() => []);
    const tabStore  = useTabStore.getState();

    // Case 1: no saved snapshot
    if (savedTabs.length === 0) {
      const inMemory = tabStore.getWorkspaceTabs(workspaceId);
      if (inMemory.length === 0) {
        tabStore.addTab(workspaceId);
      } else {
        const firstTab = inMemory[0];
        if (firstTab) {
          tabStore.setActiveTab(firstTab.id);
        }
      }
      return;
    }

    // Case 2: saved snapshot exists — build new tab list, replace atomically
    const newTabs: Tab[] = savedTabs.map((saved) => ({
      id:           crypto.randomUUID(),
      workspaceId,
      url:          saved.url,
      title:        saved.title,
      isLoading:    false,
      canGoBack:    false,
      canGoForward: false,
    }));

    // Determine which new tab should be active
    let activeIndex = savedTabs.findIndex((s) => s.isActive);
    if (activeIndex < 0) activeIndex = 0;

    const activeTabId = newTabs[activeIndex]?.id ?? newTabs[0]?.id ?? "";

    tabStore.replaceWorkspaceTabs(workspaceId, newTabs, activeTabId);
  }

  on(
    type: WorkspaceEventType,
    listener: (event: WorkspaceEvent) => void,
  ): () => void {
    return this.emitter.on(type, listener);
  }
}

export const workspaceFacade = new WorkspaceFacadeClass();