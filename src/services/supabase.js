/**
 * @fileoverview Supabase client configuration and utility functions
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { createClient } from "@supabase/supabase-js";
import { parseError } from "../utils/errorParser";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In production these must exist; in dev warn early to help debugging
  // The anon key is expected to be public client-side; still validate presence.
  // Rely on server-side logic (edge functions / RLS) for write security.
  // eslint-disable-next-line no-console
  console.warn(
    "Missing Supabase env vars: REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY. Check your environment."
  );
}

/**
 * Supabase client instance configured for the Creator Camp application.
 *
 * Configuration includes:
 * - Disabled session persistence (stateless app)
 * - Disabled URL session detection
 * - Rate-limited realtime events (2 per second)
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, detectSessionInUrl: false },
  // Limit realtime event throughput per connection; tune in production if needed.
  realtime: { params: { eventsPerSecond: 2 } },
});

/**
 * Wraps a promise with a timeout to prevent hanging requests.
 *
 * @param {Promise} promise - The promise to wrap
 * @param {number} ms - Timeout in milliseconds
 * @returns {Promise} Promise that resolves/rejects within the timeout
 * @throws {Error} When the timeout is exceeded
 */
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Invokes a Supabase Edge Function with timeout and error handling.
 *
 * @param {string} name - The name of the edge function to invoke
 * @param {Object} [body={}] - The request body to send to the function
 * @param {Object} [options={}] - Additional options
 * @param {number} [options.timeout=8000] - Request timeout in milliseconds
 * @returns {Promise<any>} The function response data
 * @throws {Error} When the function fails or times out
 *
 * @example
 * ```javascript
 * try {
 *   const result = await invokeEdgeFunction('submit_signup', {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     zip: '12345'
 *   }, { timeout: 10000 });
 *   console.log('Signup successful:', result);
 * } catch (error) {
 *   console.error('Signup failed:', error.message);
 * }
 * ```
 */
export async function invokeEdgeFunction(name, body = {}, options = {}) {
  const timeout = options.timeout ?? 8000; // 8s default
  try {
    const res = await withTimeout(
      supabase.functions.invoke(name, { body }),
      timeout
    );

    // supabase functions returns { data, error } shape.
    if (res.error) {
      const msg = await parseError(res.error);
      throw new Error(msg);
    }

    return res.data;
  } catch (err) {
    // Keep errors descriptive for the UI / logging, but don't leak secrets.
    // eslint-disable-next-line no-console
    console.error(`Edge function ${name} failed:`, err?.message || err);
    throw err;
  }
}
