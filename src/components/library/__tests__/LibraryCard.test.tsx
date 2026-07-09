import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import enMessages from "@/messages/en/common.json";
import { LibraryCard } from "../LibraryCard";

jest.mock("next-intl", () => {
  const actual = jest.requireActual("@/messages/en/common.json");
  return {
    useTranslations: () => (key: string) => {
      const parts = key.split(".");
      let cur: unknown = actual;
      for (const p of parts) {
        if (cur && typeof cur === "object" && p in cur) {
          cur = (cur as Record<string, unknown>)[p];
        } else {
          return key;
        }
      }
      return typeof cur === "string" ? cur : key;
    },
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
      children,
  };
});

function renderWithIntl(ui: React.ReactNode) {
  return {
    user: userEvent.setup(),
    ...render(<>{ui}</>),
  };
}

describe("LibraryCard", () => {
  const baseProps = {
    id: "earth",
    title: "Earth",
    type: "planet" as const,
    onSelect: jest.fn(),
  };

  it("renders title", () => {
    renderWithIntl(<LibraryCard {...baseProps} />);
    expect(screen.getByText("Earth")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const { user } = renderWithIntl(<LibraryCard {...baseProps} />);
    await user.click(screen.getByRole("button"));
    expect(baseProps.onSelect).toHaveBeenCalledWith("earth", "planet");
  });

  it("applies disabled state", () => {
    renderWithIntl(<LibraryCard {...{ ...baseProps, disabled: true }} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders stats inline joined by separator", () => {
    renderWithIntl(
      <LibraryCard
        {...baseProps}
        stats={[
          { label: "Moons", value: "1" },
          { label: "Temp", value: "288C" },
          { label: "Distance", value: "1 AU" },
        ]}
      />,
    );
    expect(screen.getByText("1 · 288C · 1 AU")).toBeInTheDocument();
  });

  it("hides stats line when stats array is empty", () => {
    const { container } = renderWithIntl(<LibraryCard {...baseProps} />);
    expect(container.querySelector(".text-cosmic-glow\\/80")).toBeNull();
  });

  it("renders subtitle when provided", () => {
    renderWithIntl(<LibraryCard {...baseProps} subtitle="The Blue Planet" />);
    expect(screen.getByText("The Blue Planet")).toBeInTheDocument();
  });

  it("renders accent color in inner anchor dot when no textureUrl", () => {
    const { container } = renderWithIntl(
      <LibraryCard {...baseProps} accentColor="#ff0000" />,
    );
    const dot = container.querySelector(".h-12.w-12.rounded-full");
    expect(dot).toBeInTheDocument();
    expect((dot as HTMLElement).style.backgroundColor).toBe("rgb(255, 0, 0)");
  });

  it("renders fallback accent color when no accentColor and no textureUrl", () => {
    const { container } = renderWithIntl(<LibraryCard {...baseProps} />);
    const dot = container.querySelector(".h-12.w-12.rounded-full");
    expect((dot as HTMLElement).style.backgroundColor).toBe(
      "rgb(74, 158, 255)",
    );
  });

  it("renders orbital ring decoration when no textureUrl", () => {
    const { container } = renderWithIntl(<LibraryCard {...baseProps} />);
    expect(container.querySelector(".border-dashed")).toBeInTheDocument();
  });

  it("renders texture image when textureUrl provided, no anchor dot", () => {
    const { container } = renderWithIntl(
      <LibraryCard
        {...baseProps}
        textureUrl="/textures/solar-system/earth/diffuse.webp"
        accentColor="#ff0000"
      />,
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute("src")).toBe(
      "/textures/solar-system/earth/diffuse.webp",
    );
    expect(container.querySelector(".h-12.w-12.rounded-full")).toBeNull();
    expect(container.querySelector(".border-dashed")).toBeNull();
  });

  it("renders top gradient overlay for badge readability when textured", () => {
    const { container } = renderWithIntl(
      <LibraryCard
        {...baseProps}
        textureUrl="/textures/solar-system/earth/diffuse.webp"
      />,
    );
    const topGrad = container.querySelector(
      ".bg-gradient-to-b.from-cosmic-black\\/80",
    );
    expect(topGrad).toBeInTheDocument();
  });
});
