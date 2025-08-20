import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useLiveSubmissions(initial = []) {
  const [subs, setSubs] = useState(initial);

  useEffect(() => {
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return [subs, setSubs];
}
