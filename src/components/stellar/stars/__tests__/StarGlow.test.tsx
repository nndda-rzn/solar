import { render } from "@testing-library/react";
import { StarGlow } from "../StarGlow";

describe("StarGlow", () => {
  it("renders without crashing using default scale", () => {
    expect(() => render(<StarGlow color="#9db4ff" size={2} />)).not.toThrow();
  });

  it("renders without crashing with a custom scale", () => {
    expect(() =>
      render(<StarGlow color="#9db4ff" size={2} scale={4.0} />),
    ).not.toThrow();
  });

  it("renders without crashing with a small scale (dim star)", () => {
    expect(() =>
      render(<StarGlow color="#ffcc99" size={0.5} scale={1.5} />),
    ).not.toThrow();
  });

  it("renders without crashing with custom intensity", () => {
    expect(() =>
      render(<StarGlow color="#9db4ff" size={2} intensity={0.8} />),
    ).not.toThrow();
  });
});
