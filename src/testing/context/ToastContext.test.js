import { render, screen, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast } from "../../context/ToastContext";
import { act } from "@testing-library/react";

// Test component to use the toast context
function TestComponent() {
  const { showToast } = useToast();

  return (
    <div>
      <button onClick={() => showToast("Test message")}>
        Show Normal Toast
      </button>
      <button onClick={() => showToast("Retro message", true)}>
        Show Retro Toast
      </button>
    </div>
  );
}

// Mock timer functions for toast auto-close
jest.useFakeTimers();

describe("ToastContext", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test("provides showToast function through context", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByText("Show Normal Toast")).toBeInTheDocument();
    expect(screen.getByText("Show Retro Toast")).toBeInTheDocument();
  });

  test("shows toast when showToast is called", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText("Show Normal Toast");
    fireEvent.click(button);

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  test("shows toast with retro mode", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText("Show Retro Toast");
    fireEvent.click(button);

    expect(screen.getByText("Retro message")).toBeInTheDocument();
  });

  test("can show multiple toasts by replacing previous", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const normalButton = screen.getByText("Show Normal Toast");
    const retroButton = screen.getByText("Show Retro Toast");

    // Show first toast
    fireEvent.click(normalButton);
    expect(screen.getByText("Test message")).toBeInTheDocument();

    // Show second toast (should replace first)
    fireEvent.click(retroButton);
    expect(screen.getByText("Retro message")).toBeInTheDocument();
    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  test("closes toast when close button is clicked", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText("Show Normal Toast");
    fireEvent.click(button);

    expect(screen.getByText("Test message")).toBeInTheDocument();

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  test("toast auto-closes after timeout", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText("Show Normal Toast");
    fireEvent.click(button);

    expect(screen.getByText("Test message")).toBeInTheDocument();

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(3500);
    });

    expect(screen.queryByText("Test message")).not.toBeInTheDocument();
  });

  test("renders children correctly", () => {
    render(
      <ToastProvider>
        <div data-testid="child-content">Child Content</div>
      </ToastProvider>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });

  test("renders RetroToast component", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText("Show Normal Toast");
    fireEvent.click(button);

    // Toast should contain emoji and close button
    expect(screen.getByText("🕹️")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  test("handles showToast with default retroMode", () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText("Show Normal Toast");
    fireEvent.click(button);

    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  test("useToast hook throws error when used outside provider", () => {
    // Temporarily suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    function TestComponentWithoutProvider() {
      useToast(); // This should throw
      return <div>Test</div>;
    }

    expect(() => {
      render(<TestComponentWithoutProvider />);
    }).toThrow();

    console.error = originalError;
  });
});
