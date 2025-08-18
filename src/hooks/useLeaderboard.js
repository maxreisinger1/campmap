import { useEffect, useMemo, useState } from "react";
import { supabase } from "../services/supabase";

export function useLeaderboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("city_leaderboard")
        .select("*");
      if (cancelled) return;
      if (error) setError(error.message);
      else setRows(data ?? []);
      setLoading(false);
    };

    load();

    // Realtime: city_metrics (counts)
    const chMetrics = supabase
      .channel("rt-city-metrics")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "city_metrics" },
        (payload) => {
          const rec = payload.new ?? payload.old;
          if (!rec?.city_id) return;
          setRows((prev) => {
            const next = [...prev];
            const i = next.findIndex((r) => r.city_id === rec.city_id);
            if (i !== -1 && payload.new) {
              next[i] = {
                ...next[i],
                signup_count:
                  (payload.new && payload.new.signup_count) ??
                  next[i].signup_count,
                progress_ratio:
                  ((payload.new && payload.new.signup_count) ??
                    next[i].signup_count) / Math.max(1, next[i].threshold),
              };
              // keep sorted (desc by count, then alpha)
              next.sort(
                (a, b) =>
                  b.signup_count - a.signup_count ||
                  a.city_name.localeCompare(b.city_name)
              );
            }
            return next;
          });
        }
      )
      .subscribe();

    // Realtime: events (tickets availability)
    const chEvents = supabase
      .channel("rt-events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          const rec = payload.new ?? payload.old;
          if (!rec?.city_id) return;
          const hasTickets = !!payload.new?.evey_event_url;
          setRows((prev) =>
            prev.map((r) =>
              r.city_id === rec.city_id
                ? { ...r, tickets_available: hasTickets }
                : r
            )
          );
        }
      )
      .subscribe();

    // Optional: threshold/name changes
    const chCities = supabase
      .channel("rt-cities")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cities" },
        (payload) => {
          if (!payload.new) return;
          setRows((prev) =>
            prev.map((r) =>
              r.city_id === payload.new.id
                ? {
                    ...r,
                    city_name: payload.new.name ?? r.city_name,
                    threshold: payload.new.threshold ?? r.threshold,
                    progress_ratio:
                      r.signup_count /
                      Math.max(1, payload.new.threshold ?? r.threshold),
                  }
                : r
            )
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(chMetrics);
      supabase.removeChannel(chEvents);
      supabase.removeChannel(chCities);
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
