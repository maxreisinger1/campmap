import { useEffect, useMemo, useState } from "react";
import {
  getCityLeaderboard,
  subscribeToCityLeaderboard,
} from "../services/CityService";

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
        if (type === "metrics" && i !== -1 && payload.new) {
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

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort(
      (a, b) =>
        b.signup_count - a.signup_count ||
        a.city_name.localeCompare(b.city_name)
    );
    return copy;
  }, [rows]);

  return { leaderboard: sorted, loading, error };
}
