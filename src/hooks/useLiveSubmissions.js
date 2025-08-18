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
        function (payload) {
          var row = payload.new;
          setSubs(function (prev) {
            return prev.some(function (s) {
              return s.id === row.id;
            })
              ? prev
              : [row].concat(prev);
          });
        }
      )
      .subscribe();

    return function () {
      supabase.removeChannel(channel);
    };
  }, []);

  return [subs, setSubs];
}
