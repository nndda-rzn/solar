import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderBar } from "../HeaderBar";

const mockToggleSearch = jest.fn();
const mockToggleBookmarkModal = jest.fn();
const mockToggleSettings = jest.fn();
const mockSignOut = jest.fn().mockResolvedValue({});
const mockPush = jest.fn();
const mockRefresh = jest.fn();

let mockUser: { email: string; id?: string } | null = {
  email: "test@example.com",
};
let mockIsAuthenticated = true;
let mockTotalXp = 250;

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
    isLoading: false,
  }),
}));

jest.mock("@/hooks/useAchievements", () => ({
  useAchievements: () => ({
    totalXp: mockTotalXp,
  }),
}));

jest.mock("@/lib/store/ui-store", () => ({
  useUIStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      toggleSearch: mockToggleSearch,
      toggleBookmarkModal: mockToggleBookmarkModal,
      toggleSettings: mockToggleSettings,
    }),
}));

jest.mock("@/lib/store/simulation-store", () => ({
  useSimulationStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      dayOffset: 0,
    }),
}));

jest.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signOut: mockSignOut,
    },
  }),
}));

jest.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => "/explorer",
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => "en",
}));

describe("HeaderBar", () => {
  beforeEach(() => {
    mockUser = { email: "test@example.com" };
    mockIsAuthenticated = true;
    mockTotalXp = 250;
    jest.clearAllMocks();
  });

  it("renders without crashing when authenticated", () => {
    expect(() => render(<HeaderBar />)).not.toThrow();
    expect(screen.getByLabelText("topbar.account")).toBeInTheDocument();
  });

  it("renders without crashing when not authenticated (UserMenu returns null)", () => {
    mockUser = null;
    mockIsAuthenticated = false;
    expect(() => render(<HeaderBar />)).not.toThrow();
    expect(screen.queryByLabelText("topbar.account")).not.toBeInTheDocument();
  });

  it("calls toggleSearch when the search button is clicked", () => {
    render(<HeaderBar />);
    fireEvent.click(screen.getByLabelText("header.search"));
    expect(mockToggleSearch).toHaveBeenCalledTimes(1);
  });

  it("calls toggleBookmarkModal when the bookmark button is clicked", () => {
    render(<HeaderBar />);
    fireEvent.click(screen.getByLabelText("header.bookmark"));
    expect(mockToggleBookmarkModal).toHaveBeenCalledTimes(1);
  });

  it("calls toggleSettings when the settings button is clicked", () => {
    render(<HeaderBar />);
    fireEvent.click(screen.getByLabelText("settings.title"));
    expect(mockToggleSettings).toHaveBeenCalledTimes(1);
  });

  it("opens the dropdown when the avatar button is clicked", () => {
    render(<HeaderBar />);
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("topbar.account"));
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("closes the dropdown when clicking outside", () => {
    render(<HeaderBar />);
    fireEvent.click(screen.getByLabelText("topbar.account"));
    expect(screen.getByText("test@example.com")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  it("renders the Exit to Dashboard link with correct href and aria-label", () => {
    render(<HeaderBar />);
    const link = screen.getByLabelText("nav.exit");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
