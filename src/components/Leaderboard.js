import React from "react";

export default function Leaderboard({
  leaderboard,
  submissions,
  CITY_GOAL,
  focus,
  COLORS,
  theme,
}) {
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
            const sub = submissions.find(
              (s) => `${s.city}, ${s.state}` === row.place
            );
            const onClick = () => sub && focus(sub.lat, sub.lon);
            const pct = Math.min(1, row.count / CITY_GOAL);
            const remaining = Math.max(0, CITY_GOAL - row.count);
            const unlocked = pct >= 1;
            return (
              <div
                key={row.place}
                className="border border-black/20 rounded-lg p-2 hover:bg-[#fff7df] cursor-pointer"
                onClick={onClick}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 text-right font-black">{i + 1}</div>
                  <div className="flex-1 font-bold">{row.place}</div>
                  <div className="text-xs font-mono w-20 text-right">
                    {row.count}/{CITY_GOAL}
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
                </div>
                <div className="mt-2 h-4 w-full rounded-full border-2 border-black bg-[repeating-linear-gradient(45deg,#fff,#fff_6px,#f3efe4_6px,#f3efe4_12px)] overflow-hidden relative">
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 6px 7px, ${COLORS.gold} 2px, transparent 2.5px), radial-gradient(circle at calc(100% - 6px) 7px, ${COLORS.gold} 2px, transparent 2.5px)`,
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
