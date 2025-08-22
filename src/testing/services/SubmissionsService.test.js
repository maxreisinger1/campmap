import {
  addSubmission,
  loadSubmissions,
} from "../../services/SubmissionsService";
import * as supabaseService from "../../services/supabase";
import * as errorParser from "../../utils/errorParser";

// Mock dependencies
jest.mock("../../services/supabase");
jest.mock("../../utils/errorParser");

const mockInvokeEdgeFunction = supabaseService.invokeEdgeFunction;
const mockSupabase = supabaseService.supabase;
const mockParseError = errorParser.parseError;

describe("SubmissionsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error
  });

  describe("loadSubmissions", () => {
    test("successfully loads submissions", async () => {
      const mockData = [
        { id: "1", name: "John", city: "Austin" },
        { id: "2", name: "Jane", city: "Dallas" },
      ];

      mockSupabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockData,
            error: null,
          }),
        }),
      });

      const result = await loadSubmissions();

      expect(mockSupabase.from).toHaveBeenCalledWith("submissions");
      expect(result).toEqual(mockData);
    });

    test("throws error when supabase query fails", async () => {
      const mockError = new Error("Database error");

      mockSupabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      });

      await expect(loadSubmissions()).rejects.toThrow("Database error");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to load submissions: Database error"
      );
    });

    test("uses correct query parameters", async () => {
      const mockSelect = jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      const mockOrder = mockSelect().order;

      mockSupabase.from = jest.fn().mockReturnValue({
        select: mockSelect,
      });

      await loadSubmissions();

      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockOrder).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
    });
  });

  describe("addSubmission", () => {
    test("successfully adds submission", async () => {
      const mockSubmission = {
        name: "John Doe",
        email: "john@example.com",
        zip: "12345",
      };

      const mockResult = {
        submission: { id: "123", ...mockSubmission },
      };

      mockInvokeEdgeFunction.mockResolvedValue(mockResult);

      const result = await addSubmission(mockSubmission);

      expect(mockInvokeEdgeFunction).toHaveBeenCalledWith(
        "submit_signup",
        mockSubmission,
        { timeout: 10000 }
      );
      expect(result).toEqual(mockResult);
    });

    test("validates submission payload", async () => {
      await expect(addSubmission(null)).rejects.toThrow(
        "Invalid submission payload"
      );
      await expect(addSubmission(undefined)).rejects.toThrow(
        "Invalid submission payload"
      );
      await expect(addSubmission("string")).rejects.toThrow(
        "Invalid submission payload"
      );
    });

    test("validates required fields", async () => {
      const incompleteSubmissions = [
        { email: "test@example.com", zip: "12345" }, // missing name
        { name: "John", zip: "12345" }, // missing email
        { name: "John", email: "test@example.com" }, // missing zip
        { name: "", email: "test@example.com", zip: "12345" }, // empty name
        { name: "John", email: "", zip: "12345" }, // empty email
        { name: "John", email: "test@example.com", zip: "" }, // empty zip
      ];

      for (const submission of incompleteSubmissions) {
        await expect(addSubmission(submission)).rejects.toThrow(
          "Missing required fields: name, email, or zip"
        );
      }
    });

    test("handles edge function errors", async () => {
      const mockSubmission = {
        name: "John Doe",
        email: "john@example.com",
        zip: "12345",
      };

      const mockError = new Error("Edge function error");
      mockInvokeEdgeFunction.mockRejectedValue(mockError);
      mockParseError.mockResolvedValue("Parsed error message");

      await expect(addSubmission(mockSubmission)).rejects.toThrow(
        "Parsed error message"
      );

      expect(mockParseError).toHaveBeenCalledWith(mockError);
      expect(console.error).toHaveBeenCalledWith(
        "Failed to add submission:",
        "Parsed error message"
      );
    });

    test("handles error parsing failure", async () => {
      const mockSubmission = {
        name: "John Doe",
        email: "john@example.com",
        zip: "12345",
      };

      const mockError = new Error("Edge function error");
      mockInvokeEdgeFunction.mockRejectedValue(mockError);
      mockParseError.mockRejectedValue(new Error("Parse error"));

      await expect(addSubmission(mockSubmission)).rejects.toThrow(
        "Edge function error"
      );

      expect(console.error).toHaveBeenCalledWith(
        "Failed to add submission:",
        "Edge function error"
      );
    });

    test("handles error without message", async () => {
      const mockSubmission = {
        name: "John Doe",
        email: "john@example.com",
        zip: "12345",
      };

      const mockError = { code: "ERR_001" }; // Error without message
      mockInvokeEdgeFunction.mockRejectedValue(mockError);
      mockParseError.mockRejectedValue(new Error("Parse error"));

      await expect(addSubmission(mockSubmission)).rejects.toThrow(
        "[object Object]"
      );
    });

    test("uses correct timeout for edge function", async () => {
      const mockSubmission = {
        name: "John Doe",
        email: "john@example.com",
        zip: "12345",
      };

      mockInvokeEdgeFunction.mockResolvedValue({ success: true });

      await addSubmission(mockSubmission);

      expect(mockInvokeEdgeFunction).toHaveBeenCalledWith(
        "submit_signup",
        mockSubmission,
        { timeout: 10000 }
      );
    });
  });
});
