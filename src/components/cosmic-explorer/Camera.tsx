import { PerspectiveCamera } from "@react-three/drei";

export function Camera() {
  return (
    <PerspectiveCamera
      makeDefault
      position={[0, 50, 100]}
      fov={60}
      near={0.1}
      far={100000}
    />
  );
}
