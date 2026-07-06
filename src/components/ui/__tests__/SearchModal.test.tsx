import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchModal } from "../SearchModal";

const mockSelectPlanet = jest.fn();
const mockSelectStar = jest.fn();
const mockSelectConstellation = jest.fn();
const mockSetCameraTarget = jest.fn();
const mockSetSearchOpen = jest.fn();

let mockIsSearchOpen = true;

jest.mock("@/lib/store/explorer-store", () => ({
  useExplorerStore: () => ({
    isSearchOpen: mockIsSearchOpen,
    setSearchOpen: mockSetSearchOpen,
    selectPlanet: mockSelectPlanet,
    selectStar: mockSelectStar,
    selectConstellation: mockSelectConstellation,
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

const mockPlanets = [
  { id: "earth", name: "Earth", color: "#3498db", distanceScaled: 1 },
  { id: "mars", name: "Mars", color: "#ff5733", distanceScaled: 1.5 },
];

const mockDwarfPlanets = [
  { id: "pluto", name: "Pluto", color: "#cccccc", distanceScaled: 5 },
];

const mockStars = [
  { id: "sirius", name: "Sirius", color: "#9db4ff", x: 1, y: 2, z: 3 },
  { id: "vega", name: "Vega", color: "#ffffff", x: 4, y: 5, z: 6 },
];

const mockConstellations = [
  {
    id: "orion",
    name: "Orion",
    indonesianName: "Orion",
    stars: ["sirius"],
  },
];

jest.mock("@/hooks/data/usePlanetData", () => ({
  usePlanetData: () => ({ planets: mockPlanets }),
}));

jest.mock("@/hooks/data/useDwarfPlanetData", () => ({
  useDwarfPlanetData: () => ({ dwarfPlanets: mockDwarfPlanets }),
}));

jest.mock("@/hooks/data/useStarData", () => ({
  useStarData: () => ({ stars: mockStars }),
}));

jest.mock("@/hooks/data/useConstellationData", () => ({
  useConstellationData: () => ({ constellations: mockConstellations }),
}));

describe("SearchModal", () => {
  beforeEach(() => {
    mockIsSearchOpen = true;
    jest.clearAllMocks();
  });

  it("does not render when isSearchOpen is false", () => {
    mockIsSearchOpen = false;
    render(<SearchModal />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders search input when isSearchOpen is true", () => {
    render(<SearchModal />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("search.placeholder"),
    ).toBeInTheDocument();
  });

  it("renders all objects (sun, planets, dwarf planets, stars, constellations) with no query", () => {
    render(<SearchModal />);
    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Earth")).toBeInTheDocument();
    expect(screen.getByText("Mars")).toBeInTheDocument();
    expect(screen.getByText("Pluto")).toBeInTheDocument();
    expect(screen.getByText("Sirius")).toBeInTheDocument();
    expect(screen.getByText("Vega")).toBeInTheDocument();
    expect(screen.getByText("Orion")).toBeInTheDocument();
  });

  it("filters the displayed list based on the query", () => {
    render(<SearchModal />);
    const input = screen.getByPlaceholderText("search.placeholder");
    fireEvent.change(input, { target: { value: "ear" } });

    expect(screen.getByText("Earth")).toBeInTheDocument();
    expect(screen.queryByText("Mars")).not.toBeInTheDocument();
    expect(screen.queryByText("Pluto")).not.toBeInTheDocument();
    expect(screen.queryByText("Sirius")).not.toBeInTheDocument();
    expect(screen.queryByText("Orion")).not.toBeInTheDocument();
  });

  it("shows the no results message when the query matches nothing", () => {
    render(<SearchModal />);
    const input = screen.getByPlaceholderText("search.placeholder");
    fireEvent.change(input, { target: { value: "zzz-no-match" } });
    expect(screen.getByText("search.noResults")).toBeInTheDocument();
  });

  it("selecting a planet result calls selectPlanet with correct id and closes the modal", () => {
    render(<SearchModal />);
    fireEvent.click(screen.getByText("Earth"));

    expect(mockSelectPlanet).toHaveBeenCalledWith("earth");
    expect(mockSelectStar).toHaveBeenCalledWith(null);
    expect(mockSelectConstellation).toHaveBeenCalledWith(null);
    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it("selecting a dwarf planet result also calls selectPlanet (current behavior)", () => {
    render(<SearchModal />);
    fireEvent.click(screen.getByText("Pluto"));

    expect(mockSelectPlanet).toHaveBeenCalledWith("pluto");
    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it("selecting a star result calls selectStar with correct id", () => {
    render(<SearchModal />);
    fireEvent.click(screen.getByText("Sirius"));

    expect(mockSelectStar).toHaveBeenCalledWith("sirius");
    expect(mockSelectPlanet).toHaveBeenCalledWith(null);
    expect(mockSelectConstellation).toHaveBeenCalledWith(null);
    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it("selecting a constellation result calls selectConstellation with correct id", () => {
    render(<SearchModal />);
    fireEvent.click(screen.getByText("Orion"));

    expect(mockSelectConstellation).toHaveBeenCalledWith("orion");
    expect(mockSelectPlanet).toHaveBeenCalledWith(null);
    expect(mockSelectStar).toHaveBeenCalledWith(null);
    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it("selecting the sun clears the planet/star selection and closes the modal", () => {
    render(<SearchModal />);
    fireEvent.click(screen.getByText("Sun"));

    expect(mockSelectPlanet).toHaveBeenCalledWith(null);
    expect(mockSelectStar).toHaveBeenCalledWith(null);
    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it("clicking the backdrop closes the modal", () => {
    render(<SearchModal />);
    // The backdrop is the first fixed-position overlay div (no accessible role).
    const dialog = screen.getByRole("dialog");
    const backdrop = dialog.previousElementSibling as HTMLElement;
    fireEvent.click(backdrop);

    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it("ArrowDown moves the highlighted result and Enter selects it", () => {
    render(<SearchModal />);
    const input = screen.getByPlaceholderText("search.placeholder");

    // Initial highlighted item is the first one in the list (Sun).
    expect(input).toHaveAttribute("aria-activedescendant", "search-result-sun");

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      "search-result-earth",
    );

    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockSelectPlanet).toHaveBeenCalledWith("earth");
    expect(mockSetSearchOpen).toHaveBeenCalledWith(false);
  });

  it("ArrowUp does not move above the first result", () => {
    render(<SearchModal />);
    const input = screen.getByPlaceholderText("search.placeholder");

    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveAttribute("aria-activedescendant", "search-result-sun");
  });
});
