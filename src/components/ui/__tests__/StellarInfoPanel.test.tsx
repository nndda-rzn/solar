import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { StellarInfoPanel } from "../StellarInfoPanel";

const mockSelectStar = jest.fn();
const mockSelectConstellation = jest.fn();
const mockSetCameraTarget = jest.fn();

let mockSelectedStar: string | null = null;
let mockSelectedConstellation: string | null = null;

jest.mock("@/lib/store/selection-store", () => ({
  useSelectionStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      selectedStar: mockSelectedStar,
      selectStar: mockSelectStar,
      selectedConstellation: mockSelectedConstellation,
      selectConstellation: mockSelectConstellation,
    }),
}));

jest.mock("@/lib/store/camera-store", () => ({
  useCameraStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      setCameraTarget: mockSetCameraTarget,
    }),
}));

jest.mock("@/lib/events/event-bus", () => ({
  cosmicEventBus: { emit: jest.fn() },
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

const mockStar = {
  id: "sirius",
  name: "Sirius",
  hip: 32349,
  ra: 101.28,
  dec: -16.72,
  magnitude: -1.46,
  spectralType: "A1V",
  color: "#9db4ff",
  distance: 8.6,
  content: {
    en: { description: "The brightest star", facts: ["Bright fact"] },
    id: { description: "Bintang paling terang", facts: ["Fakta terang"] },
  },
  x: 0,
  y: 0,
  z: 100,
};

const mockConstellation = {
  id: "orion",
  name: "Orion",
  indonesianName: "Orion",
  abbreviation: "Ori",
  stars: ["sirius"],
  lines: [],
  content: {
    en: { description: "The hunter", mythology: "Greek myth" },
    id: { description: "Pemburu", mythology: "Mitos Yunani" },
  },
};

jest.mock("@/hooks/data/useStarData", () => ({
  useStarData: () => ({
    getStarById: (id: string) => (id === "sirius" ? mockStar : undefined),
  }),
}));

jest.mock("@/hooks/data/useConstellationData", () => ({
  useConstellationData: () => ({
    getConstellationById: (id: string) =>
      id === "orion" ? mockConstellation : undefined,
  }),
}));

describe("StellarInfoPanel", () => {
  beforeEach(() => {
    mockSelectedStar = null;
    mockSelectedConstellation = null;
    jest.clearAllMocks();
  });

  it("displays star info when a star is selected", () => {
    mockSelectedStar = "sirius";
    render(<StellarInfoPanel />);
    expect(screen.getByText("Sirius")).toBeInTheDocument();
  });

  it("displays constellation info when a constellation is selected", () => {
    mockSelectedConstellation = "orion";
    render(<StellarInfoPanel />);
    expect(screen.getByText("Orion")).toBeInTheDocument();
  });

  it("renders nothing selected without crashing", () => {
    expect(() => render(<StellarInfoPanel />)).not.toThrow();
  });

  it("calls selectStar(null), selectConstellation(null), and setCameraTarget(null) on close", () => {
    mockSelectedStar = "sirius";
    render(<StellarInfoPanel />);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(mockSelectStar).toHaveBeenCalledWith(null);
    expect(mockSelectConstellation).toHaveBeenCalledWith(null);
    expect(mockSetCameraTarget).toHaveBeenCalledWith(null);
  });
});
