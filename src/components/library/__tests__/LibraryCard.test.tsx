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

const messages = { common: enMessages };

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

  it("renders stats when provided", () => {
    renderWithIntl(
      <LibraryCard
        {...baseProps}
        stats={[
          { label: "Moons", value: "1" },
          { label: "Temp", value: "288K" },
        ]}
      />,
    );
    expect(screen.getByText("Moons")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    renderWithIntl(<LibraryCard {...baseProps} subtitle="The Blue Planet" />);
    expect(screen.getByText("The Blue Planet")).toBeInTheDocument();
  });
});
