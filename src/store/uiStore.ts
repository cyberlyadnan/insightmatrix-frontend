import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";

interface UIState {
  panelSidebarExpanded: boolean;
  adminSidebarExpanded: boolean;
  theme: ThemeMode;
  setPanelSidebarExpanded: (value: boolean) => void;
  togglePanelSidebar: () => void;
  setAdminSidebarExpanded: (value: boolean) => void;
  toggleAdminSidebar: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      panelSidebarExpanded: true,
      adminSidebarExpanded: true,
      theme: "system",
      setPanelSidebarExpanded: (panelSidebarExpanded) => set({ panelSidebarExpanded }),
      togglePanelSidebar: () =>
        set((state) => ({ panelSidebarExpanded: !state.panelSidebarExpanded })),
      setAdminSidebarExpanded: (adminSidebarExpanded) => set({ adminSidebarExpanded }),
      toggleAdminSidebar: () =>
        set((state) => ({ adminSidebarExpanded: !state.adminSidebarExpanded })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "insightmatrix-ui",
      partialize: (state) => ({
        panelSidebarExpanded: state.panelSidebarExpanded,
        adminSidebarExpanded: state.adminSidebarExpanded,
        theme: state.theme,
      }),
    }
  )
);
