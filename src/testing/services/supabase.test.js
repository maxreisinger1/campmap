import { createClient } from "@supabase/supabase-js";
import * as errorParser from "../../utils/errorParser";

// Mock dependencies
jest.mock("@supabase/supabase-js");
jest.mock("../../utils/errorParser");

const mockCreateClient = createClient;
const mockParseError = errorParser.parseError;

// Mock environment variables
const originalEnv = process.env;

describe("supabase service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
    console.warn = jest.fn();

    // Reset environment variables
    process.env = { ...originalEnv };
    process.env.REACT_APP_SUPABASE_URL = "https://test.supabase.co";
    process.env.REACT_APP_SUPABASE_ANON_KEY = "test-anon-key";
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("client creation", () => {
    test("creates supabase client with correct config", () => {
      // Re-import to trigger client creation with mocked env vars
      jest.resetModules();
      require("../../services/supabase");

      expect(mockCreateClient).toHaveBeenCalledWith(
        "https://test.supabase.co",
        "test-anon-key",
        {
          auth: { persistSession: false, detectSessionInUrl: false },
          realtime: { params: { eventsPerSecond: 2 } },
        }
      );
    });

    test("warns when environment variables are missing", () => {
      delete process.env.REACT_APP_SUPABASE_URL;
      delete process.env.REACT_APP_SUPABASE_ANON_KEY;

      jest.resetModules();
      require("../../services/supabase");

      expect(console.warn).toHaveBeenCalledWith(
        "Missing Supabase env vars: REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY. Check your environment."
      );
    });
  });

  describe("invokeEdgeFunction", () => {
    let mockSupabaseClient;

    beforeEach(() => {
      mockSupabaseClient = {
        functions: {
          invoke: jest.fn(),
        },
      };

      mockCreateClient.mockReturnValue(mockSupabaseClient);

      // Re-import to get fresh instance
      jest.resetModules();
    });

    test("successfully invokes edge function", async () => {
      const { invokeEdgeFunction } = require("../../services/supabase");

      const mockResponse = { data: { success: true }, error: null };
      mockSupabaseClient.functions.invoke.mockResolvedValue(mockResponse);

      const result = await invokeEdgeFunction("test-function", {
        param: "value",
      });

      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith(
        "test-function",
        { body: { param: "value" } }
      );
      expect(result).toEqual({ success: true });
    });

    test("uses default timeout when not specified", async () => {
      const { invokeEdgeFunction } = require("../../services/supabase");

      const mockResponse = { data: { success: true }, error: null };
      mockSupabaseClient.functions.invoke.mockResolvedValue(mockResponse);

      await invokeEdgeFunction("test-function");

      // Should complete without timeout error (default 8s)
      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalled();
    });

    test("uses custom timeout when specified", async () => {
      const { invokeEdgeFunction } = require("../../services/supabase");

      const mockResponse = { data: { success: true }, error: null };
      mockSupabaseClient.functions.invoke.mockResolvedValue(mockResponse);

      await invokeEdgeFunction("test-function", {}, { timeout: 5000 });

      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalled();
    });

    test("handles function response error", async () => {
      const { invokeEdgeFunction } = require("../../services/supabase");

      const mockError = new Error("Function error");
      const mockResponse = { data: null, error: mockError };
      mockSupabaseClient.functions.invoke.mockResolvedValue(mockResponse);
      mockParseError.mockResolvedValue("Parsed function error");

      await expect(invokeEdgeFunction("test-function")).rejects.toThrow(
        "Parsed function error"
      );

      expect(mockParseError).toHaveBeenCalledWith(mockError);
      expect(console.error).toHaveBeenCalledWith(
        "Edge function test-function failed:",
        "Parsed function error"
      );
    });

    test("handles function invoke rejection", async () => {
      const { invokeEdgeFunction } = require("../../services/supabase");

      const mockError = new Error("Network error");
      mockSupabaseClient.functions.invoke.mockRejectedValue(mockError);

      await expect(invokeEdgeFunction("test-function")).rejects.toThrow(
        "Network error"
      );

      expect(console.error).toHaveBeenCalledWith(
        "Edge function test-function failed:",
        "Network error"
      );
    });

    test("handles timeout", async () => {
      const { invokeEdgeFunction } = require("../../services/supabase");

      // Mock a function that takes longer than timeout
      mockSupabaseClient.functions.invoke.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 1000))
      );

      await expect(
        invokeEdgeFunction("test-function", {}, { timeout: 100 })
      ).rejects.toThrow("Request timed out");
    });

    test("uses empty body when not provided", async () => {
      const { invokeEdgeFunction } = require("../../services/supabase");

      const mockResponse = { data: { success: true }, error: null };
      mockSupabaseClient.functions.invoke.mockResolvedValue(mockResponse);

      await invokeEdgeFunction("test-function");

      expect(mockSupabaseClient.functions.invoke).toHaveBeenCalledWith(
        "test-function",
        { body: {} }
      );
    });

    test("handles error without message property", async () => {
      const { invokeEdgeFunction } = require("../../services/supabase");

      const mockError = { code: "ERR_001" };
      mockSupabaseClient.functions.invoke.mockRejectedValue(mockError);

      await expect(invokeEdgeFunction("test-function")).rejects.toThrow(
        "[object Object]"
      );

      expect(console.error).toHaveBeenCalledWith(
        "Edge function test-function failed:",
        "[object Object]"
      );
    });
  });
});
