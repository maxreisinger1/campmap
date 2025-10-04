/**
 * @fileoverview Service for managing city data and leaderboard operations
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { supabase } from "./supabase";

/**
 * Fetches the city leaderboard with all relevant event and ticket information.
 * Data is sorted by progress ratio in descending order.
 *
 * @async
 * @function getCityLeaderboard
 * @returns {Promise<Array>} Array of city leaderboard objects
 * @throws {Error} When the database query fails
 *
 * @example
 * ```javascript
 * try {
 *   const leaderboard = await getCityLeaderboard();
 *   leaderboard.forEach(city => {
 *     console.log(`${city.city_name}: ${city.signup_count}/${city.city_threshold} (${Math.round(city.progress_ratio * 100)}%)`);
 *   });
 * } catch (error) {
 *   console.error('Failed to load leaderboard:', error.message);
 * }
 * ```
 */
export async function getCityLeaderboard() {
  const { data, error } = await supabase
    .from("city_leaderboard")
    .select("*")
    .order("progress_ratio", { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Fetch aggregated city pins suitable for map rendering.
 * Only returns cities with at least 2 signups and valid centroids.
 */
export async function getCityPins() {
  const { data, error } = await supabase
    .from("city_pins_public")
    .select("*")
    .order("count", { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Subscribes to real-time changes in city leaderboard data.
 *
 * Sets up three separate channels to monitor:
 * - city_metrics: Real-time signup count updates
 * - events: Event-related changes (URLs, status)
 * - cities: City configuration changes
 *
 * @function subscribeToCityLeaderboard
 * @param {Function} onUpdate - Callback function called when data changes
 * @param {string} onUpdate.type - Type of change ('metrics', 'events', 'cities')
 * @param {Object} onUpdate.payload - Supabase change payload with new/old data
 * @returns {Function} Unsubscribe function to clean up all channels
 *
 * @example
 * ```javascript
 * const unsubscribe = subscribeToCityLeaderboard((type, payload) => {
 *   console.log(`${type} changed:`, payload.new);
 *   if (type === 'metrics') {
 *     // Update signup counts in UI
 *     updateCityMetrics(payload.new);
 *   }
 * });
 *
 * // Clean up when component unmounts
 * return () => unsubscribe();
 * ```
 */
export function subscribeToCityLeaderboard(onUpdate) {
  // Metrics
  const chMetrics = supabase
    .channel("rt-city-metrics")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "city_metrics" },
      (payload) => onUpdate("metrics", payload)
    )
    .subscribe();
  // Events
  const chEvents = supabase
    .channel("rt-events")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "events" },
      (payload) => onUpdate("events", payload)
    )
    .subscribe();
  // Cities
  const chCities = supabase
    .channel("rt-cities")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "cities" },
      (payload) => onUpdate("cities", payload)
    )
    .subscribe();
  return () => {
    supabase.removeChannel(chMetrics);
    supabase.removeChannel(chEvents);
    supabase.removeChannel(chCities);
  };
}
