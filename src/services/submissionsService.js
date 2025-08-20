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
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Failed to add submission: ${error.message}`);
    throw error;
  }
}
