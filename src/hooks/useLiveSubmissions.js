/**
 * @fileoverview Custom hook for managing real-time submission updates via Supabase
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { useEffect, useState, useRef } from "react";
import { supabase } from "../services/supabase";
import { loadSubmissions } from "../services/SubmissionsService";

/**
 * Custom hook for managing real-time submission updates.
 *
 * Sets up Supabase real-time subscriptions to automatically update the submissions
 * list when new submissions are added. The hook handles initial data loading,
 * real-time updates, and proper cleanup of subscriptions.
 *
 * @function useLiveSubmissions
 * @param {Array} [initial=[]] - Initial submissions data
 * @returns {Array} Tuple containing [submissions, setSubmissions]
 * @returns {Array} returns[0] - Current submissions array
 * @returns {Function} returns[1] - Function to manually update submissions
 *
 * @example
 * ```javascript
 * function SubmissionsDisplay() {
 *   const [submissions, setSubmissions] = useLiveSubmissions([]);
 *
 *   // submissions will automatically update when new data arrives
 *   return (
 *     <div>
 *       <h2>Live Submissions ({submissions.length})</h2>
 *       {submissions.map(sub => (
 *         <div key={sub.id}>{sub.name} from {sub.city}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLiveSubmissions(initial = []) {
  const [subs, setSubs] = useState(initial);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    // Initial fetch to populate UI quickly
    (async () => {
      try {
        const initialData = await loadSubmissions();
        if (mounted.current) setSubs(initialData || []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(
          "Could not load initial submissions:",
          err?.message || err
        );
      }
    })();

    const channels = [];

    const channel = supabase
      .channel("rt-submissions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "submissions_public" },
        (payload) => {
          const row = payload.new;
          setSubs((prev) =>
            prev.some((s) => s.id === row.id) ? prev : [row, ...prev]
          );
        }
      )
      .subscribe();

    channels.push(channel);

    return () => {
      mounted.current = false;
      // Remove channels created by this hook only
      channels.forEach((ch) => {
        try {
          supabase.removeChannel(ch);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Failed to remove supabase channel:", e?.message || e);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [subs, setSubs];
}
