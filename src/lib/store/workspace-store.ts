import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WorkspaceState {
  workspaceId: string | null;
  workspaceName: string;
  workspaceSlug: string;
  syncStatus: "synced" | "syncing" | "error";
  setWorkspace: (id: string, name: string, slug: string) => void;
  setSyncStatus: (status: WorkspaceState["syncStatus"]) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaceId: null,
      workspaceName: "Personal Workspace",
      workspaceSlug: "personal",
      syncStatus: "synced",
      setWorkspace: (id, name, slug) =>
        set({ workspaceId: id, workspaceName: name, workspaceSlug: slug }),
      setSyncStatus: (syncStatus) => set({ syncStatus }),
    }),
    { name: "troy-workspace" }
  )
);

export interface UIState {
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
}));
