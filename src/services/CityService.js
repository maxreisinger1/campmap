import { supabase } from "./supabase";

// Fetch city leaderboard with all relevant event/ticket info
export async function getCityLeaderboard() {
  const { data, error } = await supabase
    .from("city_leaderboard")
    .select("*")
    .order("progress_ratio", { ascending: false });
  if (error) throw error;
  return data;
}

// Subscribe to city leaderboard changes (city_metrics, events, cities)
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
