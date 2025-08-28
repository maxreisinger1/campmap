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
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 100;
  const mounted = useRef(true);

  // Fetch a page of submissions
  const fetchPage = async (pageNum = 0) => {
    setLoading(true);
    try {
      const data = await loadSubmissions({ limit: PAGE_SIZE, offset: pageNum * PAGE_SIZE });
      if (mounted.current) {
        if (pageNum === 0) {
          setSubs(data || []);
        } else {
          setSubs((prev) => [...prev, ...(data || [])]);
        }
        setHasMore((data?.length || 0) === PAGE_SIZE);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Could not load submissions:", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch: keep loading pages until all submissions are loaded
  useEffect(() => {
    mounted.current = true;
    let cancelled = false;
    async function fetchAll() {
      let pageNum = 0;
      let all = [];
      let keepGoing = true;
      while (keepGoing && !cancelled) {
        setLoading(true);
        try {
          const data = await loadSubmissions({ limit: PAGE_SIZE, offset: pageNum * PAGE_SIZE });
          if (!data || data.length === 0) {
            keepGoing = false;
            break;
          }
          all = [...all, ...data];
          setSubs([...all]);
          if (data.length < PAGE_SIZE) {
            keepGoing = false;
          } else {
            pageNum++;
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn("Could not load submissions:", err?.message || err);
          keepGoing = false;
        } finally {
          setLoading(false);
        }
      }
      setHasMore(false);
      setPage(pageNum);
    }
    fetchAll();

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
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "submissions_public" },
        (payload) => {
          const deletedId = payload.old.id;
          setSubs((prev) => prev.filter((s) => s.id !== deletedId));
        }
      )
      .subscribe();

    channels.push(channel);

    return () => {
      cancelled = true;
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

  // Load next page
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage);
  };

  return [subs, setSubs, { hasMore, loading, loadMore }];
}
