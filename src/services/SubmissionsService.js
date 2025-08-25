/**
 * @fileoverview Service for managing fan submissions and related operations
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { parseError } from "../utils/errorParser";
import { supabase, invokeEdgeFunction } from "./supabase";

/**
 * Loads all public submissions from the database, ordered by creation date.
 *
 * @async
 * @function loadSubmissions
 * @returns {Promise<Array>} Array of submission objects from submissions_public view
 * @throws {Error} When the database query fails
 *
 * @example
 * ```javascript
 * try {
 *   const submissions = await loadSubmissions();
 *   console.log(`Loaded ${submissions.length} submissions`);
 * } catch (error) {
 *   console.error('Failed to load submissions:', error.message);
 * }
 * ```
 */
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

/**
 * Submits a new fan signup through the submit_signup Edge Function.
 *
 * Performs client-side validation before sending to the server.
 * The Edge Function handles ZIP code lookup, city assignment, and database insertion.
 *
 * @async
 * @function addSubmission
 * @param {Object} submission - The submission data
 * @param {string} submission.name - Fan's full name (will be trimmed)
 * @param {string} submission.email - Fan's email address (will be trimmed and lowercased)
 * @param {string} submission.zip - Fan's ZIP code for location lookup
 * @param {string} submission.city - City name from ZIP code lookup
 * @param {string} submission.state - State name from ZIP code lookup
 * @param {number} submission.lat - Latitude coordinate
 * @param {number} submission.lon - Longitude coordinate
 * @returns {Promise<Object>} Object containing submission and city data
 * @throws {Error} When validation fails or submission processing fails
 *
 * @example
 * ```javascript
 * try {
 *   const payload = {
 *     name: 'Jane Smith',
 *     email: 'jane@example.com',
 *     zip: '90210',
 *     city: 'Beverly Hills',
 *     state: 'CA',
 *     lat: 34.0901,
 *     lon: -118.4065
 *   };
 *   const result = await addSubmission(payload);
 *   console.log('Submission successful:', result.submission);
 *   console.log('City info:', result.city);
 * } catch (error) {
 *   console.error('Submission failed:', error.message);
 * }
 * ```
 */
export async function addSubmission(submission) {
  // Basic client-side validation to avoid bad requests to the function.
  if (!submission || typeof submission !== "object") {
    throw new Error("Invalid submission payload");
  }
  const { name, email, zip, city, state, lat, lon } = submission;
  if (!name || !email || !zip) {
    throw new Error("Missing required fields: name, email, or zip");
  }
  if (!city || !state || typeof lat !== "number" || typeof lon !== "number") {
    throw new Error(
      "Missing or invalid location data: city, state, lat, or lon"
    );
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
