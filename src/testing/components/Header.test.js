import { render, screen } from "@testing-library/react";
import Header from "../../components/Header";
import userEvent from "@testing-library/user-event";

describe("Header", () => {
  const defaultProps = {
    retroMode: false,
    setRetroMode: jest.fn(),
    setTransitioning: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders header title correctly", () => {
    render(<Header {...defaultProps} />);

    expect(screen.getByText("CAMP")).toBeInTheDocument();
    expect(screen.getByText("— Fan Demand Globe")).toBeInTheDocument();
  });

  test("renders retro mode toggle button", () => {
    render(<Header {...defaultProps} />);

    const button = screen.getByText("MVP • Retro Edition");
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe("BUTTON");
  });

  test("applies normal styling when not in retro mode", () => {
    render(<Header {...defaultProps} />);

    const button = screen.getByText("MVP • Retro Edition");
    expect(button).toHaveClass("bg-white", "hover:bg-amber-100");
  });

  test("applies retro styling when in retro mode", () => {
    render(<Header {...defaultProps} retroMode={true} />);

    const button = screen.getByText("MVP • Retro Edition");
    expect(button).toHaveClass(
      "bg-[#00b7c2]",
      "text-white",
      "hover:bg-[#00a4ad]"
    );
  });

  test("calls toggle functions when button is clicked", async () => {
    const setRetroMode = jest.fn();
    const setTransitioning = jest.fn();

    render(
      <Header
        {...defaultProps}
        setRetroMode={setRetroMode}
        setTransitioning={setTransitioning}
      />
    );

    const button = screen.getByText("MVP • Retro Edition");
    await userEvent.click(button);

    expect(setTransitioning).toHaveBeenCalledWith(true);
    expect(setRetroMode).toHaveBeenCalledWith(expect.any(Function));
  });

  test("toggles retro mode when toggle is clicked", async () => {
    const mockToggle = jest.fn();

    render(
      <Header
        retroMode={false}
        setRetroMode={mockToggle}
        setTransitioning={jest.fn()}
      />
    );

    const toggleButton = screen.getByText("MVP • Retro Edition");
    await userEvent.click(toggleButton);

    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  test("has correct button styles and classes", () => {
    render(<Header {...defaultProps} />);

    const button = screen.getByText("MVP • Retro Edition");
    expect(button).toHaveClass(
      "text-xs",
      "md:text-sm",
      "uppercase",
      "tracking-wider",
      "font-mono",
      "opacity-90",
      "retro-btn",
      "px-3",
      "py-1",
      "border",
      "border-black",
      "active:translate-y-[1px]",
      "rounded-full"
    );
  });

  test("renders header with border styling", () => {
    render(<Header {...defaultProps} />);

    const headerContainer = screen.getByRole("banner");
    expect(headerContainer).toHaveClass(
      "relative",
      "border-b",
      "border-black/20"
    );
  });
});
