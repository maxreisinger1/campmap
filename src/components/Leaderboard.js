/**
 * @fileoverview City leaderboard component with progress tracking and countdown timers
 * @author Creator Camp Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import RetroLoader from "./RetroLoader";

/**
 * Leaderboard component displaying city signup progress and event information.
 *
 * Shows cities ranked by signup progress, event status, ticket availability,
 * and countdown timers. Supports different visual themes and interactive
 * city focusing functionality.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.leaderboard - Array of city leaderboard data
 * @param {number} [props.CITY_GOAL=100] - Target signup count for cities
 * @param {string|null} props.focus - Currently focused city ID
 * @param {string} props.theme - Visual theme for styling
 * @param {boolean} [props.loading=false] - Whether data is loading
 * @param {boolean} [props.retroMode=false] - Whether retro styling is enabled
 * @param {Function} props.onCityFocus - Callback when city is focused
 * @returns {JSX.Element} Leaderboard with city rankings and status
 *
 * @example
 * ```javascript
 * <Leaderboard
 *   leaderboard={cityData}
 *   CITY_GOAL={150}
 *   focus={selectedCityId}
 *   theme="modern"
 *   loading={isLoading}
 *   retroMode={isRetroMode}
 *   onCityFocus={handleCityFocus}
 * />
 * ```
 */
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

  /**
   * Formats a countdown timer from milliseconds to human-readable format.
   *
   * Converts milliseconds to days, hours, minutes, and seconds format.
   * Returns the most significant time units, always including seconds.
   *
   * @function formatCountdown
   * @param {number} ms - Milliseconds to format
   * @returns {string} Formatted countdown string (e.g., "2d 5h 30m 15s")
   */
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
    <div className="relative rounded-2xl p-4 md:p-5 border border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.6)] h-full flex flex-col">
      <h3 className="text-3xl tracking-wider font-extrabold mb-1">
        City Leaderboard
      </h3>
      <p className="text-xs mb-3 opacity-70">
        First city to <b>{CITY_GOAL}</b> signups unlocks a{" "}
        <span className="font-bold">Premiere Night</span>. Bars fill as fans
        join.
      </p>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <RetroLoader text="Loading leaderboard..." retroMode={retroMode} />
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-sm opacity-70 flex-1 flex items-center justify-center">
          No cities yet. Be the first to drop a pin.
        </div>
      ) : (
        <div className="flex-1 overflow-auto pr-1 space-y-2">
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
                      className="ml-2 px-2 py-1 text-xs font-bold rounded bg-[#FF9D47] border border-black shadow hover:bg-[#FF9D47]/80 transition"
                    >
                      Buy Tickets
                    </a>
                  )}
                </div>
                <div className="mt-2 h-4 w-full rounded-full border-2 border-black bg-gray-200 overflow-hidden relative">
                  <div
                    className="absolute left-0 top-0 h-full pointer-events-none"
                    style={{
                      width: "8px",
                      background: "#EE4284",
                    }}
                  />
                  <div
                    className="h-full border-r-2 border-black transition-[width] duration-700 ease-out"
                    style={{
                      width: `${pct * 100}%`,
                      background: "#D42568",
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
