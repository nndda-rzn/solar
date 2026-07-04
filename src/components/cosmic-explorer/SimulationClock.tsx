"use client";

import { useFrame } from "@react-three/fiber";
import { useSimulationStore } from "@/lib/store/simulation-store";

/**
 * SimulationClock - Central time accumulator for the entire simulation
 *
 * This component advances the dayOffset in the simulation store based on
 * real elapsed time (delta) multiplied by the current speed setting.
 *
 * Mounted once in the 3D scene to provide a single source of truth for
 * simulation time, ensuring orbit animations, planet rotations, and the
 * date display all stay in sync.
 *
 * The dayOffset accumulates smoothly without jumps when speed changes or
 * pause/resume occurs, fixing the "orbit resets when slider changes" bug.
 */
export function SimulationClock() {
  const advanceDayOffset = useSimulationStore((s) => s.advanceDayOffset);

  useFrame((state, delta) => {
    // Advance simulation time by real elapsed time scaled by speed
    // advanceDayOffset handles isPlaying check internally
    advanceDayOffset(delta);
  });

  // This component renders nothing - it's just a time accumulator
  return null;
}
