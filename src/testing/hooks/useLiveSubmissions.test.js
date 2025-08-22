import { renderHook, waitFor } from "@testing-library/react";
import { useLiveSubmissions } from "../../hooks/useLiveSubmissions";
import * as submissionsService from "../../services/SubmissionsService";
import { supabase } from "../../services/supabase";

// Mock dependencies
jest.mock("../../services/SubmissionsService");
jest.mock("../../services/supabase");

const mockLoadSubmissions = submissionsService.loadSubmissions;
const mockSupabase = supabase;

describe("useLiveSubmissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock supabase channel setup
    const mockChannel = {
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
    };

    mockSupabase.channel = jest.fn().mockReturnValue(mockChannel);
    mockSupabase.removeChannel = jest.fn();
  });

  test("initializes with provided initial data", () => {
    const initialData = [
      { id: "1", name: "John", city: "Austin" },
      { id: "2", name: "Jane", city: "Dallas" },
    ];

    const { result } = renderHook(() => useLiveSubmissions(initialData));

    expect(result.current[0]).toEqual(initialData);
    expect(typeof result.current[1]).toBe("function");
  });

  test("loads initial submissions on mount", async () => {
    const mockData = [
      { id: "1", name: "John", city: "Austin" },
      { id: "2", name: "Jane", city: "Dallas" },
    ];

    mockLoadSubmissions.mockResolvedValue(mockData);

    const { result } = renderHook(() => useLiveSubmissions([]));

    await waitFor(() => {
      expect(result.current[0]).toEqual(mockData);
    });

    expect(mockLoadSubmissions).toHaveBeenCalledTimes(1);
  });

  test("handles loading error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    mockLoadSubmissions.mockRejectedValue(new Error("Loading failed"));

    const { result } = renderHook(() => useLiveSubmissions([]));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Could not load initial submissions:",
        "Loading failed"
      );
    });

    // Should remain with initial empty array
    expect(result.current[0]).toEqual([]);

    consoleSpy.mockRestore();
  });

  test("sets up realtime subscription", () => {
    renderHook(() => useLiveSubmissions([]));

    expect(mockSupabase.channel).toHaveBeenCalledWith("rt-submissions");

    const mockChannel = mockSupabase.channel.mock.results[0].value;
    expect(mockChannel.on).toHaveBeenCalledWith(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "submissions" },
      expect.any(Function)
    );
    expect(mockChannel.subscribe).toHaveBeenCalledTimes(1);
  });

  test("adds new submission from realtime event", async () => {
    mockLoadSubmissions.mockResolvedValue([]);

    const { result } = renderHook(() => useLiveSubmissions([]));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current[0]).toEqual([]);
    });

    // Get the realtime callback function
    const mockChannel = mockSupabase.channel.mock.results[0].value;
    const realtimeCallback = mockChannel.on.mock.calls[0][2];

    // Simulate a new submission event
    const newSubmission = { id: "3", name: "Bob", city: "Houston" };
    realtimeCallback({ new: newSubmission });

    await waitFor(() => {
      expect(result.current[0]).toEqual([newSubmission]);
    });
  });

  test("does not add duplicate submissions", async () => {
    const existingSubmission = { id: "1", name: "John", city: "Austin" };
    mockLoadSubmissions.mockResolvedValue([existingSubmission]);

    const { result } = renderHook(() => useLiveSubmissions([]));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current[0]).toEqual([existingSubmission]);
    });

    // Get the realtime callback function
    const mockChannel = mockSupabase.channel.mock.results[0].value;
    const realtimeCallback = mockChannel.on.mock.calls[0][2];

    // Try to add the same submission again
    realtimeCallback({ new: existingSubmission });

    // Should not add duplicate
    await waitFor(() => {
      expect(result.current[0]).toEqual([existingSubmission]);
    });

    expect(result.current[0]).toHaveLength(1);
  });

  test("adds new submissions to the beginning of the array", async () => {
    const existingSubmissions = [
      { id: "1", name: "John", city: "Austin" },
      { id: "2", name: "Jane", city: "Dallas" },
    ];

    mockLoadSubmissions.mockResolvedValue(existingSubmissions);

    const { result } = renderHook(() => useLiveSubmissions([]));

    // Wait for initial load
    await waitFor(() => {
      expect(result.current[0]).toEqual(existingSubmissions);
    });

    // Get the realtime callback function
    const mockChannel = mockSupabase.channel.mock.results[0].value;
    const realtimeCallback = mockChannel.on.mock.calls[0][2];

    // Add new submission
    const newSubmission = { id: "3", name: "Bob", city: "Houston" };
    realtimeCallback({ new: newSubmission });

    await waitFor(() => {
      const submissions = result.current[0];
      expect(submissions[0]).toEqual(newSubmission);
    });

    expect(result.current[0]).toHaveLength(3);
  });

  test("cleans up subscription on unmount", () => {
    const { unmount } = renderHook(() => useLiveSubmissions([]));

    const mockChannel = mockSupabase.channel.mock.results[0].value;

    unmount();

    expect(mockSupabase.removeChannel).toHaveBeenCalledWith(mockChannel);
  });

  test("handles subscription cleanup error gracefully", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    mockSupabase.removeChannel.mockImplementation(() => {
      throw new Error("Cleanup failed");
    });

    const { unmount } = renderHook(() => useLiveSubmissions([]));

    unmount();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to remove supabase channel:",
      "Cleanup failed"
    );

    consoleSpy.mockRestore();
  });

  test("does not update state after unmount", async () => {
    mockLoadSubmissions.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const { result, unmount } = renderHook(() => useLiveSubmissions([]));

    // Unmount before promise resolves
    unmount();

    // Wait for promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 150));

    // State should remain unchanged
    expect(result.current[0]).toEqual([]);
  });

  test("provides setter function for manual updates", () => {
    const { result } = renderHook(() => useLiveSubmissions([]));

    const [submissions, setSubmissions] = result.current;

    expect(typeof setSubmissions).toBe("function");
    expect(submissions).toEqual([]);
  });
});
