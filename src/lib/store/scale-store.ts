import { create } from "zustand";
import { ScaleMode } from "@/config/scales";

interface ScaleState {
  scale: ScaleMode;
  setScale: (scale: ScaleMode) => void;
}

export const useScaleStore = create<ScaleState>((set) => ({
  scale: "solar",
  setScale: (scale) => set({ scale }),
}));
