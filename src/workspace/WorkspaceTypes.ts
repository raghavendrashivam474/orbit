/**
 * WorkspaceTypes.ts
 * Orbit Workspace - Type Definitions
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

// Emoji constants stored as Unicode escapes to survive PowerShell encoding
export const WORKSPACE_EMOJIS = [
  "\u{1F3E0}",  // house
  "\u{1F4BC}",  // briefcase
  "\u{1F680}",  // rocket
  "\u{1F4DA}",  // books
  "\u{1F3AF}",  // target
  "\u{1F52C}",  // microscope
  "\u{1F3A8}",  // artist palette
  "\u{1F6E0}\u{FE0F}",  // hammer and wrench
  "\u{1F4DD}",  // memo
  "\u{1F30D}",  // globe
  "\u{1F3AE}",  // video game
  "\u{1F4A1}",  // light bulb
  "\u{1F510}",  // closed lock with key
  "\u{1F4CA}",  // bar chart
  "\u{1F9E0}",  // brain
  "\u{26A1}",   // high voltage
] as const;

export const DEFAULT_WORKSPACE_EMOJI = "\u{1F3E0}";  // house
export const DEFAULT_WORKSPACE_ID    = "workspace-personal";