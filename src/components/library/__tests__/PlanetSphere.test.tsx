import { render, screen, fireEvent } from "@testing-library/react";
import { PlanetSphere } from "../PlanetSphere";

jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: (_cb: () => void) => {
    /* mock — no frame loop in tests */
  },
}));

jest.mock("@react-three/drei", () => ({
  useTexture: (url: string) => ({ url }),
}));

const TEST_URL = "/textures/solar-system/earth/diffuse.webp";

describe("PlanetSphere", () => {
  it("renders with role=img and aria-label", () => {
    render(<PlanetSphere url={TEST_URL} />);
    const el = screen.getByRole("img", { name: /3D planet preview/i });
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("BUTTON");
  });

  it("starts with aria-pressed=false", () => {
    render(<PlanetSphere url={TEST_URL} />);
    const el = screen.getByRole("img", { name: /3D planet preview/i });
    expect(el.getAttribute("aria-pressed")).toBe("false");
  });

  it("toggles aria-pressed on click", () => {
    render(<PlanetSphere url={TEST_URL} />);
    const el = screen.getByRole("img", { name: /3D planet preview/i });
    fireEvent.click(el);
    expect(el.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(el);
    expect(el.getAttribute("aria-pressed")).toBe("false");
  });

  it("mounts an R3F canvas inside", () => {
    render(<PlanetSphere url={TEST_URL} />);
    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
  });
});
