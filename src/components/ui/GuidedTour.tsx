"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { useTourStore } from "@/lib/store/tour-store";
import { useCameraStore } from "@/lib/store/camera-store";
import { useScaleStore } from "@/lib/store/scale-store";
import { useSelectionStore } from "@/lib/store/selection-store";
import { TOUR_STEPS } from "@/data/tour-steps";
import { TourCard } from "./TourCard";
import type { ScaleMode } from "@/config/scales";

export function GuidedTour() {
  const { isTourActive, currentStep, hasCompletedTour, startTour } =
    useTourStore();
  const setCameraTarget = useCameraStore((s) => s.setCameraTarget);
  const setScale = useScaleStore((s) => s.setScale);
  const selectPlanet = useSelectionStore((s) => s.selectPlanet);

  // Auto-trigger on first visit
  useEffect(() => {
    if (!hasCompletedTour) {
      const timer = setTimeout(() => startTour(), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Apply camera + scale + selection when step changes
  useEffect(() => {
    if (!isTourActive) return;
    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    // Set scale
    setScale(step.scale as ScaleMode);

    // Set camera target
    if (step.cameraTarget) {
      setCameraTarget(
        new THREE.Vector3(
          step.cameraTarget.x,
          step.cameraTarget.y,
          step.cameraTarget.z,
        ),
      );
    } else {
      setCameraTarget(null);
    }

    // Select planet if specified
    selectPlanet(step.selectPlanet);
  }, [isTourActive, currentStep, setCameraTarget, setScale, selectPlanet]);

  // Reset selection when tour ends
  useEffect(() => {
    if (!isTourActive) {
      selectPlanet(null);
    }
  }, [isTourActive, selectPlanet]);

  if (!isTourActive) return null;

  return <TourCard />;
}
