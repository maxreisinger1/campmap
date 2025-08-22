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

// Configure client with sensible defaults for a browser application.
// We disable session detection via URL because this app doesn't manage full auth flows.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, detectSessionInUrl: false },
  // Limit realtime event throughput per connection; tune in production if needed.
  realtime: { params: { eventsPerSecond: 2 } },
});

// Helper: promise timeout wrapper
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

// Invoke an edge function with timeout and improved error parsing.
// Returns the function response data on success or throws a descriptive Error.
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
