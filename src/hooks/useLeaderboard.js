/**
 * @fileoverview Custom hook for managing city leaderboard data with real-time updates
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { useEffect, useMemo, useState } from "react";
import {
  getCityLeaderboard,
  subscribeToCityLeaderboard,
} from "../services/CityService";

/**
 * Custom hook for managing city leaderboard data with real-time updates.
 *
 * Automatically fetches initial leaderboard data and sets up real-time subscriptions
 * to monitor changes in city metrics, events, and city configurations. The hook
 * intelligently updates local state when changes occur and triggers full refreshes
 * when necessary.
 *
 * @function useLeaderboard
 * @returns {Object} Leaderboard state and computed values
 * @returns {Array} returns.data - Array of city leaderboard objects
 * @returns {boolean} returns.loading - Loading state indicator
 * @returns {string} returns.error - Error message if fetch fails
 * @returns {Array} returns.sortedData - Leaderboard sorted by progress ratio
 * @returns {Object} returns.stats - Aggregate statistics
 * @returns {number} returns.stats.totalCities - Total number of cities
 * @returns {number} returns.stats.totalSignups - Total signup count across all cities
 * @returns {number} returns.stats.averageProgress - Average progress ratio
 *
 * @example
 * ```javascript
 * function LeaderboardComponent() {
 *   const { data, loading, error, sortedData, stats } = useLeaderboard();
 *
 *   if (loading) return <div>Loading leaderboard...</div>;
 *   if (error) return <div>Error: {error}</div>;
 *
 *   return (
 *     <div>
 *       <h2>Cities: {stats.totalCities} | Total Signups: {stats.totalSignups}</h2>
 *       {sortedData.map(city => (
 *         <div key={city.city_id}>
 *           {city.city_name}: {city.signup_count}/{city.city_threshold}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLeaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCityLeaderboard()
      .then((data) => {
        if (!cancelled) setRows(data ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Subscribe to realtime updates
    const unsub = subscribeToCityLeaderboard((type, payload) => {
      const rec = payload.new ?? payload.old;
      if (!rec?.city_id) return;
      setRows((prev) => {
        let next = [...prev];
        const i = next.findIndex((r) => r.city_id === rec.city_id);
        if (i === -1 && payload.new) {
          // New city detected: refresh the leaderboard from backend for full data
          getCityLeaderboard().then((data) => {
            if (!cancelled) setRows(data ?? []);
          });
          return prev; // Don't add partial data, wait for refresh
        } else if (type === "metrics" && i !== -1 && payload.new) {
          next[i] = {
            ...next[i],
            signup_count: payload.new.signup_count ?? next[i].signup_count,
            progress_ratio:
              (payload.new.signup_count ?? next[i].signup_count) /
              Math.max(1, next[i].city_threshold),
          };
        } else if (type === "events" && i !== -1) {
          next[i] = {
            ...next[i],
            evey_event_url: payload.new?.evey_event_url,
            tickets_available: !!payload.new?.evey_event_url,
            tickets_paused: payload.new?.tickets_paused,
            tickets_sold: payload.new?.tickets_sold,
          };
        } else if (type === "cities" && i !== -1) {
          next[i] = {
            ...next[i],
            city_name: payload.new.name ?? next[i].city_name,
            city_threshold: payload.new.threshold ?? next[i].city_threshold,
            progress_ratio:
              next[i].signup_count /
              Math.max(1, payload.new.threshold ?? next[i].city_threshold),
          };
        }
        return next;
      });
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  // Computed sorted leaderboard
  const sortedData = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const aName = typeof a.city_name === "string" ? a.city_name : "";
      const bName = typeof b.city_name === "string" ? b.city_name : "";
      return b.signup_count - a.signup_count || aName.localeCompare(bName);
    });
    return copy;
  }, [rows]);

  // Computed statistics
  const stats = useMemo(() => {
    const totalCities = rows.length;
    const totalSignups = rows.reduce(
      (sum, city) => sum + (city.signup_count || 0),
      0
    );
    const averageProgress =
      totalCities > 0
        ? rows.reduce((sum, city) => sum + (city.progress_ratio || 0), 0) /
          totalCities
        : 0;

    return {
      totalCities,
      totalSignups,
      averageProgress,
    };
  }, [rows]);

  return {
    data: rows,
    loading,
    error,
    sortedData,
    stats,
    // Legacy compatibility
    leaderboard: sortedData,
  };
}
