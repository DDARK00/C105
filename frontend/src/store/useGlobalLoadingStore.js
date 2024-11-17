import { create } from "zustand";

const useGlobalLoadingStore = create((set) => ({
  loading: false,

  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
}));

export default useGlobalLoadingStore;
