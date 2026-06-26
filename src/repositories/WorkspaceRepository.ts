/**
 * WorkspaceRepository.ts
 * Orbit - TypeScript Workspace Repository
 * Thin IPC wrapper. All SQL lives in Rust.
 *
 * Tauri auto-converts camelCase keys to snake_case parameters.
 * Pass camelCase from TypeScript.
 */

import { invoke } from "@/core/ipc/bridge";
import type {
  Workspace,
  WorkspaceTab,
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  SaveWorkspaceTabsInput,
} from "@/workspace/WorkspaceTypes";

interface RustWorkspace {
  id:             string;
  name:           string;
  icon:           string;
  icon_type:      string;
  color:          string;
  created_at:     string;
  updated_at:     string;
  last_opened_at: string;
  position:       number;
  is_default:     number;
}

interface RustWorkspaceTab {
  id:           string;
  workspace_id: string;
  tab_id:       string;
  url:          string;
  title:        string;
  position:     number;
  is_active:    number;
  created_at:   string;
}

function mapWorkspace(r: RustWorkspace): Workspace {
  return {
    id:           r.id,
    name:         r.name,
    icon:         r.icon,
    iconType:     "emoji",
    color:        r.color,
    createdAt:    r.created_at,
    updatedAt:    r.updated_at,
    lastOpenedAt: r.last_opened_at,
    position:     r.position,
    isDefault:    r.is_default === 1,
  };
}

function mapTab(r: RustWorkspaceTab): WorkspaceTab {
  return {
    id:          r.id,
    workspaceId: r.workspace_id,
    tabId:       r.tab_id,
    url:         r.url,
    title:       r.title,
    position:    r.position,
    isActive:    r.is_active === 1,
    createdAt:   r.created_at,
  };
}

export const WorkspaceRepository = {
  list: async (): Promise<Workspace[]> => {
    const raw = await invoke<RustWorkspace[]>("workspace_list");
    return raw.map(mapWorkspace);
  },

  find: async (id: string): Promise<Workspace | null> => {
    const raw = await invoke<RustWorkspace | null>("workspace_find", { id });
    return raw ? mapWorkspace(raw) : null;
  },

  create: async (input: CreateWorkspaceInput): Promise<Workspace> => {
    const raw = await invoke<RustWorkspace>("workspace_create", {
      input: {
        name:      input.name,
        icon:      input.icon,
        icon_type: input.iconType,
        color:     input.color,
      },
    });
    return mapWorkspace(raw);
  },

  update: async (input: UpdateWorkspaceInput): Promise<Workspace> => {
    const raw = await invoke<RustWorkspace>("workspace_update", { input });
    return mapWorkspace(raw);
  },

  delete: async (id: string): Promise<void> =>
    invoke("workspace_delete", { id }),

  activate: async (id: string): Promise<void> =>
    invoke("workspace_activate", { id }),

  saveTabs: async (input: SaveWorkspaceTabsInput): Promise<void> =>
    invoke("workspace_save_tabs", {
      input: {
        workspace_id: input.workspaceId,
        active_tab:   input.activeTab,
        tabs:         input.tabs.map((t) => ({
          tab_id:   t.tabId,
          url:      t.url,
          title:    t.title,
          position: t.position,
        })),
      },
    }),

  loadTabs: async (workspaceId: string): Promise<WorkspaceTab[]> => {
    const raw = await invoke<RustWorkspaceTab[]>("workspace_load_tabs", {
      workspaceId,
    });
    return raw.map(mapTab);
  },
} as const;