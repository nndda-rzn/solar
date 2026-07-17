import { useCameraStore } from "../camera-store";
import * as THREE from "three";

describe("useCameraStore", () => {
  beforeEach(() => {
    useCameraStore.setState({ cameraTarget: null, cameraPosition: null });
  });

  it("setCameraTarget stores Vector3", () => {
    const target = new THREE.Vector3(1, 2, 3);
    useCameraStore.getState().setCameraTarget(target);
    expect(useCameraStore.getState().cameraTarget).toEqual(target);
  });

  it("setCameraPosition stores Vector3", () => {
    const pos = new THREE.Vector3(10, 20, 30);
    useCameraStore.getState().setCameraPosition(pos);
    expect(useCameraStore.getState().cameraPosition).toEqual(pos);
  });

  it("setCameraTarget(null) clears", () => {
    useCameraStore.getState().setCameraTarget(new THREE.Vector3(1, 2, 3));
    useCameraStore.getState().setCameraTarget(null);
    expect(useCameraStore.getState().cameraTarget).toBeNull();
  });
});
