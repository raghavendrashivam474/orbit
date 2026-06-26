/**
 * WorkspaceTypes.ts
 * Orbit Workspace â€” Type Definitions
 *
 * These types mirror the Rust workspace models exactly.
 * Used across the entire workspace layer.
 */

export interface Workspace {
  id:             string;
  name:           string;
  icon:           string;
  iconType:       "emoji";
  color:          string;
  createdAt:      string;
  updatedAt:      string;
  lastOpenedAt:   string;
  position:       number;
  isDefault:      boolean;
}

export interface WorkspaceTab {
  id:          string;
  workspaceId: string;
  tabId:       string;
  url:         string;
  title:       string;
  position:    number;
  isActive:    boolean;
  createdAt:   string;
}

export interface CreateWorkspaceInput {
  name:     string;
  icon:     string;
  iconType: "emoji";
  color:    string;
}

export interface UpdateWorkspaceInput {
  id:    string;
  name?: string;
  icon?: string;
  color?:string;
}

export interface SaveWorkspaceTabsInput {
  workspaceId: string;
  activeTab:   string;
  tabs: {
    tabId:    string;
    url:      string;
    title:    string;
    position: number;
  }[];
}

/** Orbit workspace color palette. */
export const WORKSPACE_COLORS = [
  { label: "Blue",   value: "#3B82F6" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Green",  value: "#22C55E" },
  { label: "Orange", value: "#F97316" },
  { label: "Red",    value: "#EF4444" },
  { label: "Cyan",   value: "#06B6D4" },
  { label: "Amber",  value: "#F59E0B" },
  { label: "Pink",   value: "#EC4899" },
] as const;

/** Default emoji suggestions for new workspaces. */
export const WORKSPACE_EMOJIS = [
  "ðŸ ", "ðŸ’¼", "ðŸš€", "ðŸ“š", "ðŸŽ¯", "ðŸ”¬", "ðŸŽ¨", "ðŸ› ï¸",
  "ðŸ“", "ðŸŒ", "ðŸŽ®", "ðŸ’¡", "ðŸ”", "ðŸ“Š", "ðŸ§ ", "âš¡",
] as const;

export const DEFAULT_WORKSPACE_ID = "workspace-personal";