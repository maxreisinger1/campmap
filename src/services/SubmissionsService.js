import { parseError } from "../utils/errorParser";
import { supabase, invokeEdgeFunction } from "./supabase";

export async function loadSubmissions() {
  try {
    const { data, error } = await supabase
      .from("submissions_public")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Failed to load submissions: ${error.message}`);
    throw error;
  }
}

export async function addSubmission(submission) {
  // Basic client-side validation to avoid bad requests to the function.
  if (!submission || typeof submission !== "object") {
    throw new Error("Invalid submission payload");
  }
  const { name, email, zip } = submission;
  if (!name || !email || !zip) {
    throw new Error("Missing required fields: name, email, or zip");
  }

  try {
    const data = await invokeEdgeFunction("submit_signup", submission, {
      timeout: 10000,
    });
    return data;
  } catch (err) {
    // Parse known shapes, otherwise rethrow
    const parsed = await parseError(err).catch(
      () => err.message || String(err)
    );
    // eslint-disable-next-line no-console
    console.error("Failed to add submission:", parsed);
    throw new Error(parsed);
  }
}
