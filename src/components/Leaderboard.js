import React, { useState, useEffect } from "react";
import RetroLoader from "./RetroLoader";

export default function Leaderboard({
  leaderboard,
  CITY_GOAL = 100,
  focus,
  theme,
  loading = false,
  retroMode = false,
  onCityFocus,
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  function formatCountdown(ms) {
    if (!ms || ms <= 0) return "0s";
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);
    return parts.join(" ");
  }
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
      {loading ? (
        <RetroLoader text="Loading leaderboard..." retroMode={retroMode} />
      ) : leaderboard.length === 0 ? (
        <div className="text-sm opacity-70">
          No cities yet. Be the first to drop a pin.
        </div>
      ) : (
        <div className="max-h-[360px] overflow-auto pr-1 space-y-2">
          {leaderboard.map((row, i) => {
            const onClick = () => {
              if (onCityFocus && row.lat && row.lon) {
                onCityFocus({
                  lat: row.lat,
                  lon: row.lon,
                  city: row.city_name,
                  state: row.city_state,
                });
              }
            };
            const pct = Math.min(1, row.signup_count / row.city_threshold);
            const remaining = Math.max(
              0,
              row.city_threshold - row.signup_count
            );
            const unlocked = pct >= 1;

            // Ticket availability & prepurchase logic
            const hasEvey = !!row.evey_event_url;
            const prepurchaseAt = row.prepurchase_enabled_at
              ? Date.parse(row.prepurchase_enabled_at)
              : null;
            const hasPrepurchase = !!prepurchaseAt;
            const prepurchaseMs = hasPrepurchase ? prepurchaseAt - now : null;
            const ticketsPaused = row.tickets_paused === true;
            const canShowBuy =
              unlocked &&
              hasEvey &&
              !ticketsPaused &&
              (!hasPrepurchase || (hasPrepurchase && prepurchaseMs <= 0));
            const canShowCountdown =
              unlocked &&
              hasEvey &&
              hasPrepurchase &&
              prepurchaseMs > 0 &&
              !ticketsPaused;
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
                  {!unlocked && (
                    <span className="ml-2 text-xs font-mono opacity-70">
                      {remaining} to go
                    </span>
                  )}
                  {canShowBuy && (
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
                {canShowCountdown && (
                  <span className="py-2 text-xs font-mono opacity-90">
                    Pre-sale in {formatCountdown(prepurchaseMs)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
