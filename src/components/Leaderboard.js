/**
 * @fileoverview City leaderboard component with progress tracking and countdown timers
 * @author Creator Camp Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from "react";
import RetroLoader from "./RetroLoader";

// Reusable component for stacked stills
// Flexible stacked stills component for 3 images
function StackedStills({ images, flip = false }) {
  // Optionally add some rotation for collage effect
  const rotations = ["rotate-[13.27deg]", "", "rotate-[-14.38deg]"];
  return (
    <div
      className={`relative flex flex-col gap-20 items-center h-full w-full ${
        flip ? "scale-x-[-1]" : ""
      }`}
      style={{ minWidth: "20rem" }}
    >
      <div className="relative items-center justify-center w-full">
        <div
          className="absolute flex flex-col -gap-20"
          style={{ left: "-40px" }}
        >
          {images.map((img, idx) => {
            // Middle image goes further out
            const extraLeft = idx === 1 ? (flip ? -40 : -40) : 0;
            return (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className={`w-56 border border-black shadow-md ${
                  rotations[idx] || ""
                } ${idx === 1 ? "z-10" : ""}`}
                style={{
                  objectFit: "cover",
                  aspectRatio: "4/3",
                  position: "relative",
                  left: extraLeft,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

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

  // Define 3 unique images for each side
  const leftImages = [
    { src: "/images/still-1.jpg", alt: "Audience 1" },
    { src: "/images/still-2.jpg", alt: "Audience 2" },
    { src: "/images/still-3.jpg", alt: "Audience 3" },
  ];
  const rightImages = [
    {
      src: "/images/still-4.png",
      alt: "City Postcard LA",
    },
    {
      src: "/images/still-5.png",
      alt: "City Postcard NY",
    },
    {
      src: "/images/still-6.jpg",
      alt: "City Postcard Seattle",
    },
  ];

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
    <div
      id="leaderboard"
      className="relative flex flex-row items-stretch justify-center h-fit w-full"
    >
      {/* Left stacked stills - positioned behind and inside - hidden on mobile */}
      <div
        className="hidden lg:flex items-center absolute left-0 z-0"
        style={{ marginLeft: "4rem" }}
      >
        <StackedStills images={leftImages} />
      </div>
      <div className="relative rounded-2xl text-start p-3 md:p-5 border border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.6)] md:shadow-[8px_8px_0_0_rgba(0,0,0,0.6)] h-auto max-h-[450px] md:max-h-[500px] flex flex-col z-10 w-full md:max-w-2xl lg:max-w-3xl">
        <h3 className="text-lg md:text-2xl tracking-wider font-extrabold mb-1">
          City Leaderboard
        </h3>
        <p className="text-[10px] md:text-xs mb-2 md:mb-3">
          Cities with <span className="font-bold">100</span> signups unlock a{" "}
          <span className="font-bold">Film Screening</span>. Bars fill as fans
          join.
        </p>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <RetroLoader text="Loading leaderboard..." retroMode={retroMode} />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-sm flex-1 flex items-center justify-center">
            No cities yet. Be the first to drop a pin.
          </div>
        ) : (
          <div className="flex-1 overflow-auto pr-1 space-y-1.5 md:space-y-2 max-h-[350px] md:max-h-[500px]">
            {leaderboard.map((row, i) => {
              const onClick = () => {
                if (onCityFocus) {
                  onCityFocus({
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
                  className="border border-black/20 rounded-lg p-1.5 md:p-2 hover:bg-[#fff7df] cursor-pointer"
                  onClick={onClick}
                >
                  <div className="flex items-center gap-1 md:gap-2 min-w-0">
                    <div className="franklin-font w-4 md:w-6 text-[11px] md:text-[16px] text-right font-black shrink-0">
                      {i + 1}
                    </div>
                    <div className="franklin-font flex-1 text-[11px] md:text-[16px] font-normal truncate min-w-0">
                      {row.city_name}
                      {row.city_state ? `, ${row.city_state}` : ""}
                    </div>
                    <div className="text-[9px] md:text-xs font-mono w-14 md:w-20 text-right shrink-0">
                      {row.signup_count}/{row.city_threshold}
                    </div>
                    {!unlocked && (
                      <span className="hidden sm:inline ml-1 md:ml-2 w-fit text-[9px] md:text-xs font-mono opacity-70 whitespace-nowrap shrink-0">
                        {remaining} to go
                      </span>
                    )}
                    {canShowBuy && (
                      <a
                        href={row.evey_event_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 md:ml-2 px-1.5 md:px-2 py-0.5 md:py-1 text-[9px] md:text-xs font-bold rounded bg-[#FF9D47] border border-black shadow hover:bg-[#FF9D47]/80 transition whitespace-nowrap shrink-0"
                      >
                        Buy Tickets
                      </a>
                    )}
                  </div>
                  <div className="mt-1 md:mt-2 h-2.5 md:h-4 w-full rounded-full border-2 border-black bg-gray-200 overflow-hidden relative">
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
                    <span className="py-0.5 md:py-2 text-[9px] md:text-xs font-mono opacity-90 block mt-0.5 md:mt-1">
                      Pre-sale in {formatCountdown(prepurchaseMs)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Right stacked stills (flipped) - positioned behind and inside - hidden on mobile */}
      <div
        className="hidden lg:flex items-center absolute right-0 z-0"
        style={{ marginRight: "4rem" }}
      >
        <StackedStills images={rightImages} flip />
      </div>
    </div>
  );
}
