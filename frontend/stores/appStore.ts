import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  selectedStationId: string | null;
  setSelectedStationId: (id: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedStationId: null,
      setSelectedStationId: (id) => set({ selectedStationId: id }),
    }),
    { name: "atmosai-app" }
  )
);