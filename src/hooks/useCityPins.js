/**
 * @fileoverview Hook to fetch aggregated city pins from city_pins_public
 */
import { useEffect, useState } from "react";
import {
  getCityPins,
  subscribeToCityLeaderboard,
} from "../services/CityService";
import { supabase } from "../services/supabase";

export function useCityPins() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCityPins()
      .then((data) => {
        console.log("Fetched city pins:", data);
        if (!cancelled) setPins(data ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // Reuse leaderboard realtime channels to refresh pins on changes
    const unsub = subscribeToCityLeaderboard(() => {
      getCityPins().then((data) => {
        if (!cancelled) setPins(data ?? []);
      });
    });

    // Also refresh on new submissions so counts update without a page reload
    // Listen to base table (views don't emit realtime events)
    const ch = supabase
      .channel("rt-pins-submissions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "submissions" },
        () => {
          getCityPins().then((data) => {
            if (!cancelled) setPins(data ?? []);
          });
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      unsub();
      try {
        supabase.removeChannel(ch);
      } catch (e) {}
    };
  }, []);

  return { pins, loading, error };
}
