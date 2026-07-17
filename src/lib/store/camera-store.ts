import { create } from "zustand";
import * as THREE from "three";

interface CameraState {
  cameraTarget: THREE.Vector3 | null;
  cameraPosition: THREE.Vector3 | null;
  setCameraTarget: (target: THREE.Vector3 | null) => void;
  setCameraPosition: (pos: THREE.Vector3 | null) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  cameraTarget: null,
  cameraPosition: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
}));
