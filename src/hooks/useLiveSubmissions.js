import { useEffect, useState, useRef } from "react";
import { supabase } from "../services/supabase";
import { loadSubmissions } from "../services/SubmissionsService";

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
        { event: "INSERT", schema: "public", table: "submissions" },
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
