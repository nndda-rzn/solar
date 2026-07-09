import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import enMessages from "@/messages/en/common.json";
import { CatalogGrid } from "../CatalogGrid";

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

const items = [
  {
    id: "earth",
    title: "Earth",
    type: "planet" as const,
    accentColor: "#3b82f6",
  },
  {
    id: "mars",
    title: "Mars",
    type: "planet" as const,
    accentColor: "#ef4444",
  },
];

describe("CatalogGrid", () => {
  it("renders all items as cards", () => {
    renderWithIntl(
      <CatalogGrid items={items} onSelect={jest.fn()} emptyLabel="No items" />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("shows empty state when no items", () => {
    renderWithIntl(
      <CatalogGrid
        items={[]}
        onSelect={jest.fn()}
        emptyLabel="No items here"
      />,
    );
    expect(screen.getByText("No items here")).toBeInTheDocument();
  });

  it("calls onSelect with id and type on card click", async () => {
    const onSelect = jest.fn();
    const { user } = renderWithIntl(
      <CatalogGrid items={items} onSelect={onSelect} emptyLabel="x" />,
    );
    await user.click(screen.getByRole("button", { name: /Earth/i }));
    expect(onSelect).toHaveBeenCalledWith("earth", "planet");
  });
});
