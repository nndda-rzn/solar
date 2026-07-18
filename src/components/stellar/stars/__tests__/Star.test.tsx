import { render } from "@testing-library/react";
import { Star } from "../Star";
import { StarPosition } from "@/types/celestial/star";

jest.mock("@react-three/fiber", () => ({
  useFrame: jest.fn(),
}));

jest.mock("@react-three/drei", () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("@/hooks/useCelestialSelection", () => ({
  useCelestialSelection: () => ({
    isSelected: false,
    isHovered: false,
    handleClick: jest.fn(),
    handleClickWithPosition: jest.fn(),
    handlePointerOver: jest.fn(),
    handlePointerOut: jest.fn(),
  }),
}));

function makeStar(overrides: Partial<StarPosition> = {}): StarPosition {
  return {
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
      en: { description: "The brightest star", facts: ["Bright"] },
      id: { description: "Bintang paling terang", facts: ["Terang"] },
    },
    x: 0,
    y: 0,
    z: 100,
    ...overrides,
  };
}

describe("Star", () => {
  it("renders a bright star without crashing", () => {
    expect(() => render(<Star star={makeStar()} />)).not.toThrow();
  });

  it("renders a dim star without crashing", () => {
    const dimStar = makeStar({
      id: "delta-lyrae",
      name: "Delta Lyrae",
      magnitude: 4.3,
    });
    expect(() => render(<Star star={dimStar} />)).not.toThrow();
  });
});
