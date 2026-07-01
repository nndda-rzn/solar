export function Lighting() {
  return (
    <>
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={1000}
        decay={2}
        color="#fff5e6"
      />
      <ambientLight intensity={0.05} color="#ffffff" />
    </>
  );
}
