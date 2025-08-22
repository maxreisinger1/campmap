import { parseError } from "../../utils/errorParser";

describe("parseError", () => {
  test("returns message from simple error object", async () => {
    const error = { message: "Simple error message" };
    const result = await parseError(error);
    expect(result).toBe("Simple error message");
  });

  test("handles error with ReadableStream body", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode('{"error": "Stream error message"}'));
        controller.close();
      },
    });

    const error = {
      message: "Original message",
      context: { body: mockStream },
    };

    const result = await parseError(error);
    expect(result).toBe("Stream error message");
  });

  test("handles error with string body containing JSON", async () => {
    const error = {
      message: "Original message",
      context: { body: '{"error": "JSON error message"}' },
    };

    const result = await parseError(error);
    expect(result).toBe("JSON error message");
  });

  test("handles error with string body containing plain text", async () => {
    const error = {
      message: "Original message",
      context: { body: "Plain text error" },
    };

    const result = await parseError(error);
    expect(result).toBe("Plain text error");
  });

  test("handles error with invalid JSON in string body", async () => {
    const error = {
      message: "Original message",
      context: { body: "Invalid JSON {" },
    };

    const result = await parseError(error);
    expect(result).toBe("Invalid JSON {");
  });

  test("returns original message when no body context", async () => {
    const error = { message: "No context error" };
    const result = await parseError(error);
    expect(result).toBe("No context error");
  });

  test("returns fallback message when no message provided", async () => {
    const error = {};
    const result = await parseError(error);
    expect(result).toBe("Unknown error occurred");
  });

  test("handles error with empty string message", async () => {
    const error = { message: "" };
    const result = await parseError(error);
    expect(result).toBe("Unknown error occurred");
  });

  test("handles ReadableStream with invalid JSON", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode("Invalid JSON {"));
        controller.close();
      },
    });

    const error = {
      message: "Original message",
      context: { body: mockStream },
    };

    const result = await parseError(error);
    expect(result).toBe("Invalid JSON {");
  });

  test("handles ReadableStream read error", async () => {
    const mockStream = new ReadableStream({
      start(controller) {
        controller.error(new Error("Stream read error"));
      },
    });

    const error = {
      message: "Original message",
      context: { body: mockStream },
    };

    const result = await parseError(error);
    expect(result).toBe("Original message");
  });

  test("handles complex JSON error structure", async () => {
    const error = {
      message: "Original message",
      context: {
        body: JSON.stringify({
          error: "Detailed error",
          code: "ERR_001",
          details: "Additional info",
        }),
      },
    };

    const result = await parseError(error);
    expect(result).toBe("Detailed error");
  });

  test("handles JSON body without error property", async () => {
    const error = {
      message: "Original message",
      context: {
        body: JSON.stringify({
          message: "Different structure",
          status: "failed",
        }),
      },
    };

    const result = await parseError(error);
    expect(result).toBe('{"message":"Different structure","status":"failed"}');
  });
});
