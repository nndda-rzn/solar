export function Lighting() {
  return (
    <>
      <directionalLight
        position={[50, 30, 50]}
        intensity={1.5}
        color="#ffffff"
      />
      <pointLight
        position={[0, 0, 0]}
        intensity={500}
        distance={2000}
        decay={1}
        color="#fff5e6"
      />
      <ambientLight intensity={0.2} color="#ffffff" />
    </>
  );
}
