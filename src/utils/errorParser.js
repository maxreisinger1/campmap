/**
 * @fileoverview Error parsing utilities for handling various error formats
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Parses errors from various sources, especially Supabase function errors.
 *
 * Handles different error formats including ReadableStream responses,
 * JSON error objects, and plain string errors. Attempts to extract
 * meaningful error messages from complex error structures.
 *
 * @async
 * @function parseError
 * @param {Error} error - The error object to parse
 * @returns {Promise<string>} Parsed error message
 *
 * @example
 * ```javascript
 * try {
 *   // Some operation that might fail
 * } catch (error) {
 *   const message = await parseError(error);
 *   console.error('Parsed error:', message);
 * }
 * ```
 */
export async function parseError(error) {
  let msg = error.message;

  // Supabase FunctionsHttpError exposes body in context
  const body = error.context?.body;

  // Case: body is a ReadableStream
  if (body instanceof ReadableStream) {
    const reader = body.getReader();
    const chunks = [];
    let result;
    while (!(result = await reader.read()).done) {
      chunks.push(new TextDecoder().decode(result.value));
    }
    const bodyText = chunks.join("");
    try {
      const parsed = JSON.parse(bodyText);
      if (parsed?.error) msg = parsed.error;
      else msg = bodyText;
    } catch {
      msg = bodyText;
    }
  }

  // Case: body is just string
  else if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      if (parsed?.error) msg = parsed.error;
      else msg = body;
    } catch {
      msg = body;
    }
  }

  return msg || "Unknown error occurred";
}

/**
 * Maps low-level network/CORS/timeout errors to concise, user-friendly messages.
 * Use this when presenting messages to end users (e.g., in a toast), while keeping
 * console logs with the original error for debugging.
 *
 * @param {string} message - Raw error message
 * @returns {string} User-friendly error message
 */
export function toUserFriendlyMessage(message) {
  const msg = (message || "").toLowerCase();

  // Common browser/network errors
  if (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("err_network") ||
    msg.includes("econn") ||
    msg.includes("enotfound") ||
    msg.includes("edge function") // e.g. "Failed to send a request to the Edge Function"
  ) {
    return "We couldn’t reach our servers. Please check your internet connection and try again. If you use an ad blocker or VPN, try disabling it for this site.";
  }

  if (msg.includes("timed out") || msg.includes("timeout")) {
    return "This is taking longer than expected. Please try again in a moment.";
  }

  if (
    msg.includes("cors") ||
    msg.includes("preflight") ||
    msg.includes("blocked by client")
  ) {
    return "Your browser blocked the request. If you use an ad blocker, tracking protection, or VPN, try disabling it for this site and retry.";
  }

  return message || "Something went wrong. Please try again.";
}
