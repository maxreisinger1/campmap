import { render, screen, fireEvent } from "@testing-library/react";
import RetroToast from "../../components/RetroToast";

// Mock timer functions
jest.useFakeTimers();

describe("RetroToast", () => {
  const defaultProps = {
    message: "Test message",
    show: true,
    onClose: jest.fn(),
    retroMode: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test("renders when show is true", () => {
    render(<RetroToast {...defaultProps} />);

    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByText("🕹️")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  test("does not render when show is false", () => {
    render(<RetroToast {...defaultProps} show={false} />);

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();
    render(<RetroToast {...defaultProps} onClose={onClose} />);

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("auto-closes after 3.5 seconds", async () => {
    const onClose = jest.fn();
    render(<RetroToast {...defaultProps} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();

    // Fast-forward time by 3.5 seconds
    jest.advanceTimersByTime(3500);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clears timer when component unmounts", () => {
    const onClose = jest.fn();
    const { unmount } = render(
      <RetroToast {...defaultProps} onClose={onClose} />
    );

    unmount();

    // Advance time after unmount - onClose should not be called
    jest.advanceTimersByTime(3500);
    expect(onClose).not.toHaveBeenCalled();
  });

  test("resets timer when show changes to true", () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <RetroToast {...defaultProps} show={false} onClose={onClose} />
    );

    // Advance time while hidden
    jest.advanceTimersByTime(2000);

    // Show the toast
    rerender(<RetroToast {...defaultProps} show={true} onClose={onClose} />);

    // Should not close immediately since timer was reset
    expect(onClose).not.toHaveBeenCalled();

    // Should close after full duration
    jest.advanceTimersByTime(3500);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("renders message and controls", () => {
    render(<RetroToast {...defaultProps} />);

    expect(screen.getByText("Test message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  test("renders emoji icon", () => {
    render(<RetroToast {...defaultProps} />);

    expect(screen.getByRole("img", { name: "alert" })).toBeInTheDocument();
  });
});
