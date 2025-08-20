import { parseError } from "../utils/errorParser";
import { supabase } from "./supabase";

export async function loadSubmissions() {
  try {
    const { data, error } = await supabase
      .from("submissions")
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
  try {
    const { data, error } = await supabase.functions.invoke("submit_signup", {
      body: submission,
    });

    if (data && data.ok) return data;

    if (error) {
      const msg = await parseError(error);
      throw new Error(msg);
    }
  } catch (err) {
    console.error("Failed to add submission:", err);
    throw err;
  }
}
