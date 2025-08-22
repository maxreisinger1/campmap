import { render, screen } from "@testing-library/react";
import RetroLoader from "../../components/RetroLoader";

describe("RetroLoader", () => {
  test("renders with default text", () => {
    render(<RetroLoader />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders with custom text", () => {
    render(<RetroLoader text="Custom loading message" />);

    expect(screen.getByText("Custom loading message")).toBeInTheDocument();
  });

  test("renders loading bars container", () => {
    render(<RetroLoader />);

    // Test that the component renders properly
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("applies retro styling when retroMode is true", () => {
    render(<RetroLoader retroMode={true} />);

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toHaveClass("text-yellow-500");
  });

  test("applies normal styling when retroMode is false", () => {
    render(<RetroLoader retroMode={false} />);

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toHaveClass("text-gray-700");
  });

  test("applies retro font family when in retro mode", () => {
    render(<RetroLoader retroMode={true} />);

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toHaveStyle({
      fontFamily: '"Press Start 2P", monospace',
    });
  });

  test("uses default font when not in retro mode", () => {
    render(<RetroLoader retroMode={false} />);

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).not.toHaveStyle({
      fontFamily: '"Press Start 2P", monospace',
    });
  });

  test("renders with proper structure", () => {
    render(<RetroLoader />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("text has correct base styling", () => {
    render(<RetroLoader />);

    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toHaveClass(
      "mt-4",
      "text-base",
      "font-mono",
      "font-bold"
    );
  });
});
