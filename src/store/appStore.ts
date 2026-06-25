import { create } from "zustand";

interface AppState {
  version: string;
  initialized: boolean;
  setInitialized: (value: boolean) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  version: "0.1.0",
  initialized: false,
  setInitialized: (value: boolean): void => { set({ initialized: value }); },
}));
