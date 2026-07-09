import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import enMessages from "@/messages/en/common.json";
import { LibraryDetail, type LibraryDetailItem } from "../LibraryDetail";

const messages = { common: enMessages };

jest.mock("next-intl", () => ({
  useTranslations:
    (namespace = "common") =>
    (key: string) => {
      const fullPath = `${namespace}.${key}`;
      const parts = fullPath.split(".");
      let cur: unknown = messages;
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
}));

function renderWithIntl(ui: React.ReactNode) {
  return {
    user: userEvent.setup(),
    ...render(<>{ui}</>),
  };
}

const baseItem = {
  id: "earth",
  title: "Earth",
  type: "planet" as const,
  accentColor: "#3b82f6",
  description: "The third planet from the Sun.",
  facts: ["70% surface is water", "Only planet not named after a god"],
  stats: [
    { label: "Mass", value: "5.97 x 10^24 kg" },
    { label: "Moons", value: "1" },
    { label: "Radius", value: "6371 km" },
  ],
};

describe("LibraryDetail", () => {
  it("renders title and description", () => {
    renderWithIntl(
      <LibraryDetail
        item={baseItem}
        onExplore={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Earth")).toBeInTheDocument();
    expect(screen.getByText(/third planet/i)).toBeInTheDocument();
  });

  it("renders all facts", () => {
    renderWithIntl(
      <LibraryDetail
        item={baseItem}
        onExplore={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText(/70% surface is water/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Only planet not named after a god/i),
    ).toBeInTheDocument();
  });

  it("renders stat rows", () => {
    renderWithIntl(
      <LibraryDetail
        item={baseItem}
        onExplore={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Mass")).toBeInTheDocument();
    expect(screen.getByText(/5\.97 x 10\^24 kg/)).toBeInTheDocument();
  });

  it("calls onExplore on CTA click", async () => {
    const onExplore = jest.fn();
    const { user } = renderWithIntl(
      <LibraryDetail
        item={baseItem}
        onExplore={onExplore}
        onClose={jest.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Explore in 3D/i }));
    expect(onExplore).toHaveBeenCalledWith("earth", "planet");
  });

  it("calls onClose on close click", async () => {
    const onClose = jest.fn();
    const { user } = renderWithIntl(
      <LibraryDetail item={baseItem} onExplore={jest.fn()} onClose={onClose} />,
    );
    await user.click(screen.getByRole("button", { name: /Close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("noContent fallback when no description", () => {
    const item = {
      ...baseItem,
      description: undefined,
    } as unknown as LibraryDetailItem;
    renderWithIntl(
      <LibraryDetail item={item} onExplore={jest.fn()} onClose={jest.fn()} />,
    );
    expect(screen.getByText(/No description available/i)).toBeInTheDocument();
  });
});
