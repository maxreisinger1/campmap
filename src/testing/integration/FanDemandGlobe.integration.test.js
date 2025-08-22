import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FanDemandGlobe from "../../components/FanDemandGlobe";
import * as submissionsService from "../../services/SubmissionsService";
import * as zipLookup from "../../utils/zipLookup";

// Mock dependencies
jest.mock("../../services/SubmissionsService");
jest.mock("../../utils/zipLookup");
jest.mock("../../services/supabase", () => ({
  supabase: {
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    })),
    removeChannel: jest.fn(),
  },
}));

// Mock the lazy-loaded components
jest.mock("../../components/GlobeMap", () => {
  return function MockGlobeMap() {
    return <div data-testid="globe-map">Mock Globe Map</div>;
  };
});

jest.mock("../../components/RetroEffects", () => {
  return function MockRetroEffects() {
    return <div data-testid="retro-effects">Mock Retro Effects</div>;
  };
});

const mockLoadSubmissions = submissionsService.loadSubmissions;
const mockAddSubmission = submissionsService.addSubmission;
const mockLookupZip = zipLookup.lookupZip;

describe("FanDemandGlobe Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    mockLoadSubmissions.mockResolvedValue([]);
    mockLookupZip.mockResolvedValue({
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    });
    mockAddSubmission.mockResolvedValue({
      submission: {
        id: "123",
        name: "John Doe",
        email: "john@example.com",
        city: "Austin",
      },
    });
  });

  test("renders main components", async () => {
    render(<FanDemandGlobe />);

    // Check for header elements
    expect(screen.getByText("CAMP")).toBeInTheDocument();
    expect(screen.getByText("— Fan Demand Globe")).toBeInTheDocument();

    // Check for form elements
    expect(
      screen.getByText("Bring the movie to your city")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("73301")).toBeInTheDocument();

    // Wait for submissions to load and globe to appear
    await waitFor(() => {
      expect(screen.getByTestId("globe-map")).toBeInTheDocument();
    });
  });

  test("submits form successfully", async () => {
    render(<FanDemandGlobe />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("globe-map")).toBeInTheDocument();
    });

    // Fill out form
    const nameInput = screen.getByPlaceholderText("Jane Doe");
    const emailInput = screen.getByPlaceholderText("jane@example.com");
    const zipInput = screen.getByPlaceholderText("73301");

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(zipInput, "12345");

    // Submit form
    const submitButton = screen.getByText("Drop Pin");
    await userEvent.click(submitButton);

    // Verify services were called
    await waitFor(() => {
      expect(mockLookupZip).toHaveBeenCalledWith("12345");
    });

    expect(mockAddSubmission).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      zip: "12345",
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    });

    // Check for success toast
    await waitFor(() => {
      expect(
        screen.getByText("Pinned! Thanks for raising your hand.")
      ).toBeInTheDocument();
    });
  });

  test("handles form validation errors", async () => {
    render(<FanDemandGlobe />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("globe-map")).toBeInTheDocument();
    });

    // Try to submit empty form
    const submitButton = screen.getByText("Drop Pin");
    await userEvent.click(submitButton);

    // Should show validation error in toast
    await waitFor(() => {
      expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    });
  });

  test("handles submission errors", async () => {
    mockAddSubmission.mockRejectedValue(new Error("Submission failed"));

    render(<FanDemandGlobe />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("globe-map")).toBeInTheDocument();
    });

    // Fill out form
    const nameInput = screen.getByPlaceholderText("Jane Doe");
    const emailInput = screen.getByPlaceholderText("jane@example.com");
    const zipInput = screen.getByPlaceholderText("73301");

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(zipInput, "12345");

    // Submit form
    const submitButton = screen.getByText("Drop Pin");
    await userEvent.click(submitButton);

    // Should show error toast
    await waitFor(() => {
      expect(screen.getByText("Submission failed")).toBeInTheDocument();
    });
  });

  test("switches between modes", async () => {
    render(<FanDemandGlobe />);

    // Start in normal mode
    await waitFor(() => {
      expect(document.body).not.toHaveClass("retro-mode");
    });

    // Toggle to retro mode
    const retroToggle = screen.getByText("MVP • Retro Edition");
    await userEvent.click(retroToggle);

    await waitFor(() => {
      expect(document.body).toHaveClass("retro-mode");
    });

    // Toggle back to normal mode
    await userEvent.click(retroToggle);

    await waitFor(() => {
      expect(document.body).not.toHaveClass("retro-mode");
    });
  });

  test("clears form when clear button is clicked", async () => {
    render(<FanDemandGlobe />);

    // Fill out form
    const nameInput = screen.getByPlaceholderText("Jane Doe");
    const emailInput = screen.getByPlaceholderText("jane@example.com");
    const zipInput = screen.getByPlaceholderText("73301");

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(zipInput, "12345");

    // Verify form is filled
    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(zipInput).toHaveValue("12345");

    // Click clear button
    const clearButton = screen.getByText("Clear");
    await userEvent.click(clearButton);

    // Verify form is cleared
    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(zipInput).toHaveValue("");
  });

  test("formats ZIP input correctly", async () => {
    render(<FanDemandGlobe />);

    const zipInput = screen.getByPlaceholderText("73301");

    // Type non-numeric characters and more than 5 digits
    await userEvent.type(zipInput, "abc123456def");

    // Should only keep first 5 digits
    expect(zipInput).toHaveValue("12345");
  });

  test("shows loading state during submission", async () => {
    // Mock slow submission
    mockAddSubmission.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ submission: { id: "123" } }), 1000)
        )
    );

    render(<FanDemandGlobe />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId("globe-map")).toBeInTheDocument();
    });

    // Fill out form
    const nameInput = screen.getByPlaceholderText("Jane Doe");
    const emailInput = screen.getByPlaceholderText("jane@example.com");
    const zipInput = screen.getByPlaceholderText("73301");

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");
    await userEvent.type(zipInput, "12345");

    // Submit form
    const submitButton = screen.getByText("Drop Pin");
    await userEvent.click(submitButton);

    // Should show loading state
    expect(screen.getByText("Processing...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  test("displays footer", () => {
    render(<FanDemandGlobe />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Camp Studios — All vibes reserved.`)
    ).toBeInTheDocument();
    expect(screen.getByText("Roadmap:")).toBeInTheDocument();
  });

  test("loads initial submissions on mount", async () => {
    const mockSubmissions = [
      { id: "1", name: "John", city: "Austin", lat: 30.27, lon: -97.74 },
      { id: "2", name: "Jane", city: "Dallas", lat: 32.78, lon: -96.8 },
    ];

    mockLoadSubmissions.mockResolvedValue(mockSubmissions);

    render(<FanDemandGlobe />);

    // Should call loadSubmissions on mount
    expect(mockLoadSubmissions).toHaveBeenCalledTimes(1);

    // Wait for globe to render with submissions
    await waitFor(() => {
      expect(screen.getByTestId("globe-map")).toBeInTheDocument();
    });
  });
});
