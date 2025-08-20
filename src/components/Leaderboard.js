import React from "react";

export default function Leaderboard({
  leaderboard,
  submissions,
  CITY_GOAL,
  focus,
  theme,
}) {
  console.log("Leaderboard data:", leaderboard);

  return (
    <div className="relative rounded-2xl p-4 md:p-5 border border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.6)]">
      <h3 className="text-lg md:text-xl font-extrabold mb-1">
        City Leaderboard
      </h3>
      <p className="text-xs mb-3 opacity-70">
        First city to <b>{CITY_GOAL}</b> signups unlocks a{" "}
        <span className="font-bold">Premiere Night</span>. Bars fill as fans
        join.
      </p>
      {leaderboard.length === 0 ? (
        <div className="text-sm opacity-70">
          No cities yet. Be the first to drop a pin.
        </div>
      ) : (
        <div className="max-h-[360px] overflow-auto pr-1 space-y-2">
          {leaderboard.map((row, i) => {
            // New structure: row.city_name, row.city_state, row.signup_count, row.city_threshold, row.evey_event_url, row.tickets_available
            const onClick = () => {
              // Optionally focus map if you have lat/lon
            };
            const pct = Math.min(1, row.signup_count / row.city_threshold);
            const remaining = Math.max(
              0,
              row.city_threshold - row.signup_count
            );
            const unlocked = pct >= 1;
            return (
              <div
                key={row.city_id}
                className="border border-black/20 rounded-lg p-2 hover:bg-[#fff7df] cursor-pointer"
                onClick={onClick}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 text-right font-black">{i + 1}</div>
                  <div className="flex-1 font-bold">
                    {row.city_name}
                    {row.city_state ? `, ${row.city_state}` : ""}
                  </div>
                  <div className="text-xs font-mono w-20 text-right">
                    {row.signup_count}/{row.city_threshold}
                  </div>
                  {unlocked ? (
                    <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border-2 border-black bg-[conic-gradient(at_50%_50%,#fff_0_25%,#ffe08a_25%_50%,#fff_50%_75%,#ffe08a_75%_100%)] shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]">
                      ⭐ Premiere
                    </span>
                  ) : (
                    <span className="ml-2 text-xs font-mono opacity-70">
                      {remaining} to go
                    </span>
                  )}
                  {row.evey_event_url &&
                    row.tickets_available &&
                    !row.tickets_paused && (
                      <a
                        href={row.evey_event_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 px-2 py-1 text-xs font-bold rounded bg-yellow-400 border border-black shadow hover:bg-yellow-300 transition"
                      >
                        Buy Tickets
                      </a>
                    )}
                </div>
                <div className="mt-2 h-4 w-full rounded-full border-2 border-black bg-[repeating-linear-gradient(45deg,#fff,#fff_6px,#f3efe4_6px,#f3efe4_12px)] overflow-hidden relative">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 6px 7px, #f5c518 2px, transparent 2.5px), radial-gradient(circle at calc(100% - 6px) 7px, #f5c518 2px, transparent 2.5px)`,
                      backgroundSize: "12px 14px, 12px 14px",
                      backgroundRepeat: "repeat-y",
                    }}
                  />
                  <div
                    className="h-full border-r-2 border-black transition-[width] duration-700 ease-out"
                    style={{
                      width: `${pct * 100}%`,
                      background: theme.barFill,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
