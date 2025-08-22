import { renderHook, act } from "@testing-library/react";
import { useSubmitSignup } from "../../hooks/useSubmitSignup";
import * as zipLookup from "../../utils/zipLookup";
import * as submissionsService from "../../services/SubmissionsService";

// Mock dependencies
jest.mock("../../utils/zipLookup");
jest.mock("../../services/SubmissionsService");

const mockLookupZip = zipLookup.lookupZip;
const mockAddSubmission = submissionsService.addSubmission;

describe("useSubmitSignup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initial state is correct", () => {
    const { result } = renderHook(() => useSubmitSignup());

    expect(result.current.loading).toBe(false);
    expect(result.current.message).toBe("");
    expect(result.current.error).toBe(null);
    expect(typeof result.current.submit).toBe("function");
    expect(typeof result.current.setMessage).toBe("function");
    expect(typeof result.current.cancel).toBe("function");
  });

  test("validates required name field", async () => {
    const { result } = renderHook(() => useSubmitSignup());

    const form = { name: "", email: "test@example.com", zip: "12345" };

    await act(async () => {
      await expect(result.current.submit(form)).rejects.toThrow(
        "Please enter a valid name."
      );
    });

    expect(result.current.message).toBe("Please enter your name.");
  });

  test("validates email format", async () => {
    const { result } = renderHook(() => useSubmitSignup());

    const form = { name: "John Doe", email: "invalid-email", zip: "12345" };

    await act(async () => {
      await expect(result.current.submit(form)).rejects.toThrow(
        "Please enter a valid email."
      );
    });

    expect(result.current.message).toBe("Please enter a valid email.");
  });

  test("validates ZIP code length", async () => {
    const { result } = renderHook(() => useSubmitSignup());

    const form = { name: "John Doe", email: "test@example.com", zip: "123" };

    await act(async () => {
      await expect(result.current.submit(form)).rejects.toThrow(
        "Please enter a valid ZIP code."
      );
    });

    expect(result.current.message).toBe("Enter a 5-digit ZIP.");
  });

  test("successful submission flow", async () => {
    const mockLocationData = {
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    };

    const mockSubmissionResult = {
      id: "123",
      name: "John Doe",
      email: "test@example.com",
    };

    mockLookupZip.mockResolvedValue(mockLocationData);
    mockAddSubmission.mockResolvedValue(mockSubmissionResult);

    const { result } = renderHook(() => useSubmitSignup());

    const form = { name: "John Doe", email: "TEST@EXAMPLE.COM", zip: "12345" };

    let submissionResult;
    await act(async () => {
      submissionResult = await result.current.submit(form);
    });

    expect(mockLookupZip).toHaveBeenCalledWith("12345");
    expect(mockAddSubmission).toHaveBeenCalledWith({
      name: "John Doe",
      email: "test@example.com", // Should be lowercased
      zip: "12345",
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    });

    expect(submissionResult).toBe(mockSubmissionResult);
    expect(result.current.message).toBe(
      "Pinned! Thanks for raising your hand."
    );
    expect(result.current.loading).toBe(false);
  });

  test("handles ZIP lookup error", async () => {
    mockLookupZip.mockRejectedValue(new Error("Invalid ZIP code"));

    const { result } = renderHook(() => useSubmitSignup());

    const form = { name: "John Doe", email: "test@example.com", zip: "00000" };

    await act(async () => {
      await expect(result.current.submit(form)).rejects.toThrow(
        "Invalid ZIP code"
      );
    });

    expect(result.current.error).toEqual(expect.any(Error));
    expect(result.current.message).toBe("Invalid ZIP code");
    expect(result.current.loading).toBe(false);
  });

  test("handles submission service error", async () => {
    const mockLocationData = {
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    };

    mockLookupZip.mockResolvedValue(mockLocationData);
    mockAddSubmission.mockRejectedValue(new Error("Submission failed"));

    const { result } = renderHook(() => useSubmitSignup());

    const form = { name: "John Doe", email: "test@example.com", zip: "12345" };

    await act(async () => {
      await expect(result.current.submit(form)).rejects.toThrow(
        "Submission failed"
      );
    });

    expect(result.current.error).toEqual(expect.any(Error));
    expect(result.current.message).toBe("Submission failed");
    expect(result.current.loading).toBe(false);
  });

  test("sets loading state during submission", async () => {
    const mockLocationData = {
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    };

    mockLookupZip.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(mockLocationData), 100)
        )
    );
    mockAddSubmission.mockResolvedValue({ id: "123" });

    const { result } = renderHook(() => useSubmitSignup());

    const form = { name: "John Doe", email: "test@example.com", zip: "12345" };

    act(() => {
      result.current.submit(form);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.loading).toBe(false);
  });

  test("accepts valid email formats", async () => {
    const mockLocationData = {
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    };

    mockLookupZip.mockResolvedValue(mockLocationData);
    mockAddSubmission.mockResolvedValue({ id: "123" });

    const { result } = renderHook(() => useSubmitSignup());

    const validEmails = [
      "test@example.com",
      "user.name@domain.co.uk",
      "first+last@subdomain.example.org",
    ];

    for (const email of validEmails) {
      const form = { name: "John Doe", email, zip: "12345" };

      await act(async () => {
        await result.current.submit(form);
      });

      expect(result.current.error).toBe(null);
    }
  });

  test("trims whitespace from form fields", async () => {
    const mockLocationData = {
      city: "Austin",
      state: "TX",
      lat: 30.2672,
      lon: -97.7431,
    };

    mockLookupZip.mockResolvedValue(mockLocationData);
    mockAddSubmission.mockResolvedValue({ id: "123" });

    const { result } = renderHook(() => useSubmitSignup());

    const form = {
      name: "  John Doe  ",
      email: "  TEST@EXAMPLE.COM  ",
      zip: "  12345  ",
    };

    await act(async () => {
      await result.current.submit(form);
    });

    expect(mockAddSubmission).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "John Doe",
        email: "test@example.com",
        zip: "12345",
      })
    );
  });

  test("setMessage updates message state", () => {
    const { result } = renderHook(() => useSubmitSignup());

    act(() => {
      result.current.setMessage("Custom message");
    });

    expect(result.current.message).toBe("Custom message");
  });
});
