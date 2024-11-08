import { create } from "zustand";

const useIdeaStore = create((set) => ({
  ideaId: null,
  setIdeaId: (id) => set({ ideaId: id }),
  clearIdeaId: () => set({ ideaId: null }),
}));

export default useIdeaStore;
