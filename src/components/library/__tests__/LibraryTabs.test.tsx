import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LibraryTabs } from "../LibraryTabs";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      "tabs.planets": "Planets",
      "tabs.dwarfPlanets": "Dwarf Planets",
      "tabs.stars": "Stars",
      "tabs.constellations": "Constellations",
      "tabs.bookmarks": "My Bookmarks",
    };
    return dict[key] ?? key;
  },
}));

it("renders 5 tabs and shows badge when count > 0", () => {
  render(
    <LibraryTabs active="planets" bookmarkCount={3} onChange={jest.fn()} />,
  );
  expect(screen.getAllByRole("tab")).toHaveLength(5);
  expect(screen.getByText("3")).toBeInTheDocument();
});

it("calls onChange with new tab key", async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  render(
    <LibraryTabs active="planets" bookmarkCount={0} onChange={onChange} />,
  );
  await user.click(screen.getByRole("tab", { name: /Stars/i }));
  expect(onChange).toHaveBeenCalledWith("stars");
});

it("marks active tab as aria-selected", () => {
  render(
    <LibraryTabs
      active="constellations"
      bookmarkCount={0}
      onChange={jest.fn()}
    />,
  );
  const tab = screen.getByRole("tab", { name: /Constellations/i });
  expect(tab.getAttribute("aria-selected")).toBe("true");
});

it("hides badge when count is 0", () => {
  render(
    <LibraryTabs active="planets" bookmarkCount={0} onChange={jest.fn()} />,
  );
  expect(screen.queryByText("0")).not.toBeInTheDocument();
});
