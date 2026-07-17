import type { ScaleMode } from "@/config/scales";

export interface TourStep {
  id: string;
  scale: ScaleMode;
  cameraTarget: { x: number; y: number; z: number } | null;
  selectPlanet: string | null;
  titleKey: string;
  descriptionKey: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    scale: "solar",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.welcome.title",
    descriptionKey: "tour.steps.welcome.description",
  },
  {
    id: "sun",
    scale: "solar",
    cameraTarget: { x: 0, y: 5, z: 20 },
    selectPlanet: null,
    titleKey: "tour.steps.sun.title",
    descriptionKey: "tour.steps.sun.description",
  },
  {
    id: "earth",
    scale: "solar",
    cameraTarget: { x: 15, y: 2, z: 5 },
    selectPlanet: "earth",
    titleKey: "tour.steps.earth.title",
    descriptionKey: "tour.steps.earth.description",
  },
  {
    id: "saturn",
    scale: "solar",
    cameraTarget: { x: 95, y: 5, z: 10 },
    selectPlanet: "saturn",
    titleKey: "tour.steps.saturn.title",
    descriptionKey: "tour.steps.saturn.description",
  },
  {
    id: "neptune",
    scale: "solar",
    cameraTarget: { x: 300, y: 5, z: 10 },
    selectPlanet: "neptune",
    titleKey: "tour.steps.neptune.title",
    descriptionKey: "tour.steps.neptune.description",
  },
  {
    id: "stellar",
    scale: "stellar",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.stellar.title",
    descriptionKey: "tour.steps.stellar.description",
  },
  {
    id: "galactic",
    scale: "galactic",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.galactic.title",
    descriptionKey: "tour.steps.galactic.description",
  },
  {
    id: "cosmic",
    scale: "cosmic",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.cosmic.title",
    descriptionKey: "tour.steps.cosmic.description",
  },
  {
    id: "finish",
    scale: "solar",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.finish.title",
    descriptionKey: "tour.steps.finish.description",
  },
];
