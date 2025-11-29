/**
 * @fileoverview Interactive flat theater map with pin markers
 * @author Creator Camp Team
 * @version 1.0.0
 */

import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

/**
 * URL for world geographic data used in the map visualization.
 * @constant {string}
 */
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Theater locations with coordinates
 */
const theaters = [
  {
    name: "Alamo Slaughter Lane 8 (Austin, TX)",
    city: "Austin, TX",
    date: "5-Dec",
    url: "https://drafthouse.com/austin/show/two-sleepy-people?cinemaId=0006&sessionId=207292",
    coordinates: [-97.856, 30.194],
  },
  {
    name: "Alamo Drafthouse Seaport (Boston, MA)",
    city: "Boston, MA",
    date: "5-Dec",
    url: "https://drafthouse.com/boston/show/two-sleepy-people?cinemaId=0006&sessionId=207292",
    coordinates: [-71.0446, 42.3487],
  },
  {
    name: "AMC River East 21 with Dolby, Prime (Chicago, IL)",
    city: "Chicago, IL",
    date: "5-Dec",
    url: "https://www.amctheatres.com/showtimes/138520146/seats",
    coordinates: [-87.6197, 41.8903],
  },
  {
    name: "Alamo Lake Highlands 8 (Dallas, TX)",
    city: "Dallas, TX",
    date: "5-Dec",
    url: "https://drafthouse.com/dfw/show/two-sleepy-people?cinemaId=0706",
    coordinates: [-96.736, 32.872],
  },
  {
    name: "Regal UA Denver Pavilions (Denver, CO)",
    city: "Denver, CO",
    date: "5-Dec",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=1315&id=249830",
    coordinates: [-104.9903, 39.7474],
  },
  {
    name: "Ann Arbor 20 IMAX (Ypsilanti, MI)",
    city: "Ypsilanti, MI",
    date: "5-Dec",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=1097&ShowtimeId=458723&CinemarkMovieId=106965&Showtime=2025-12-05T19:05:00",
    coordinates: [-83.6631, 42.2467],
  },
  {
    name: "Regal Irvine Spectrum (Irvine, CA)",
    city: "Irvine, CA",
    date: "5-Dec",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=1010&id=362389",
    coordinates: [-117.743, 33.6507],
  },
  {
    name: "AMC Burbank 16 (Burbank, CA)",
    city: "Burbank, CA",
    date: "5-Dec",
    url: "https://www.amctheatres.com/showtimes/138520498/seats",
    coordinates: [-118.3082, 34.1808],
  },
  {
    name: "AMC Empire 25 with IMAX,Dolby,Prime (New York, NY)",
    city: "New York, NY",
    date: "5-Dec",
    url: "https://www.amctheatres.com/showtimes/138520502/seats",
    coordinates: [-73.9881, 40.7563],
  },
  {
    name: "Regal Union Square (New York, NY)",
    city: "New York, NY",
    date: "5-Dec",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=278457&site=1320&date=12-05-2025",
    coordinates: [-73.9916, 40.7322],
  },
  {
    name: "Portland Eastport Plaza (Portland, OR)",
    city: "Portland, OR",
    date: "5-Dec",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=432&ShowtimeId=497017&CinemarkMovieId=106965&Showtime=2025-12-05T19:30:00",
    coordinates: [-122.573, 45.487],
  },
  {
    name: "Regal Bridgeport Village (Tigard, OR)",
    city: "Tigard, OR",
    date: "5-Dec",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=0652&id=323413",
    coordinates: [-122.755, 45.397],
  },
  {
    name: "AMC Southpoint 17 with IMAX, Dolby (Durham, NC)",
    city: "Durham, NC",
    date: "5-Dec",
    url: "https://www.amctheatres.com/showtimes/138520612/seats",
    coordinates: [-78.939, 35.902],
  },
  {
    name: "Regal Alamo Quarry (San Antonio, TX)",
    city: "San Antonio, TX",
    date: "5-Dec",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=0939&id=277547",
    coordinates: [-98.481, 29.487],
  },
  {
    name: "Regal Cielo Vista (San Antonio, TX)",
    city: "San Antonio, TX",
    date: "5-Dec",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=0765&id=307002",
    coordinates: [-98.583, 29.466],
  },
  {
    name: "Regal Edwards Mira Mesa (San Diego, CA)",
    city: "San Diego, CA",
    date: "5-Dec",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=1043&id=338707",
    coordinates: [-117.117, 32.939],
  },
  {
    name: "AMC Mission Valley 20 with IMAX, Dolby (San Diego, CA)",
    city: "San Diego, CA",
    date: "5-Dec",
    url: "https://www.amctheatres.com/showtimes/138520499/seats",
    coordinates: [-117.146, 32.774],
  },
  {
    name: "AMC Metreon 16 with IMAX, Dolby (San Francisco, CA)",
    city: "San Francisco, CA",
    date: "5-Dec",
    url: "https://www.amctheatres.com/showtimes/138520605/seats",
    coordinates: [-122.404, 37.784],
  },
  {
    name: "AMC Pacific Place 11 (Seattle, WA)",
    city: "Seattle, WA",
    date: "5-Dec",
    url: "https://www.amctheatres.com/showtimes/138520531/seats",
    coordinates: [-122.333, 47.611],
  },
  {
    name: "Imagine Cinemas Carlton (Toronto, ON)",
    city: "Toronto, ON",
    date: "5-Dec",
    url: "https://omniwebticketing6.com/imaginecinemas/carlton/?schdate=2025-12-05&perfix=131238",
    coordinates: [-79.383, 43.661],
  },
  {
    name: "Regal Gallery Place (Washington, DC)",
    city: "Washington, DC",
    date: "5-Dec",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=1551&id=244262",
    coordinates: [-77.0219, 38.8997],
  },
  {
    name: "AMC Georgetown 14 with IMAX, Dolby (Washington, DC)",
    city: "Washington, DC",
    date: "5-Dec",
    url: "https://www.amctheatres.com/showtimes/138520608/seats",
    coordinates: [-77.0707, 38.9047],
  },
  {
    name: "Studio Movie Grill Plano (Plano, TX)",
    city: "Plano, TX",
    date: "5-Dec",
    url: "https://www.studiomoviegrill.com/quicktickets/texas/plano/2025/12/5",
    coordinates: [-96.781, 33.027],
  },
  {
    name: "Megaplex Theatres Jordan Commons + IMAX (Sandy, UT)",
    city: "Sandy, UT",
    date: "5-Dec",
    url: "https://megaplex.com/jordancommons",
    coordinates: [-111.887, 40.579],
  },
];

/**
 * Interactive flat map component with theater pin markers.
 *
 * Renders a flat 2D map using react-simple-maps with theater locations
 * displayed as pins. Users can zoom and pan to explore different theaters.
 * Clicking on a pin opens the theater's ticket URL in a new tab.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.retroMode - Whether retro styling is enabled
 * @returns {JSX.Element} Interactive flat map with theater markers
 */
export default function TheaterMap({ retroMode = false }) {
  // Start with a zoomed-in view focused on US/Canada
  const [position, setPosition] = useState({
    coordinates: [-98, 39],
    zoom: 2,
  });
  const [tooltipContent, setTooltipContent] = useState("");

  const theme = {
    ocean: retroMode ? "#dff5f2" : "#e7f6f2",
    land: retroMode ? "#26d0c9" : "#d2d2d2",
    stroke: retroMode ? "#0e2a47" : "#111",
    pinFill: retroMode ? "#ff00a6" : "#ef476f",
    fontFamily: retroMode
      ? '"Barlow", "Futura", ui-sans-serif, system-ui'
      : "inherit",
  };

  // Calculate pin size based on zoom level (inverse scaling: smaller when zoomed in deeper)
  // Keeps pins readable at wide view while reducing clutter at close zoom
  const getPinRadius = (zoom) => {
    // Base inverse scaling formula
    const raw = 6 / zoom; // zoom grows -> radius shrinks
    // Clamp to sensible bounds
    return Math.max(2.2, Math.min(4.2, raw));
  };

  const pinRadius = getPinRadius(position.zoom);

  function handleZoomIn() {
    if (position.zoom >= 25) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  }

  function handleMoveEnd(newPosition) {
    setPosition(newPosition);
  }

  function handlePinClick(e, url) {
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleResetView() {
    setPosition({ coordinates: [-98, 39], zoom: 2 });
  }

  // Calculate label font size based on zoom level
  // Smaller at low zoom, moderate at high zoom to reduce clutter
  const getLabelFontSize = (zoom) => {
    if (zoom < 1) return 9;
    if (zoom < 2) return 8;
    if (zoom < 3) return 7;
    if (zoom < 4) return 6;
    if (zoom < 6) return 5;
    return 4; // keep slightly smaller at max zoom
  };

  // Determine if labels should be shown based on zoom level
  // const shouldShowLabels = (zoom) => {
  //   return zoom >= 2.5; // Only show labels when zoomed in enough
  // };

  const labelFontSize = getLabelFontSize(position.zoom);
  const showLabels = true; //shouldShowLabels(position.zoom);

  // Calculate which labels to show to avoid overlap
  // Uses a greedy algorithm to prioritize labels with more space
  const getVisibleLabels = (theaterList, zoom) => {
    if (!showLabels) return new Set();
    // At higher zooms, show all labels (we'll stack-offset them instead)
    if (zoom >= 5) return new Set(theaterList.map((t) => t.name));

    const visible = new Set();

    // Distance in degrees for label spacing (approximate)
    const minDistance = zoom < 3 ? 3 : zoom < 4 ? 2.5 : zoom < 6 ? 2 : 1.5;

    // Sort by longitude (west to east) for consistent rendering
    const sorted = [...theaterList].sort(
      (a, b) => a.coordinates[0] - b.coordinates[0]
    );

    sorted.forEach((theater, idx) => {
      const coords = theater.coordinates;
      let tooClose = false;

      // Check against already visible labels
      for (const visibleIdx of visible) {
        const otherCoords = sorted[visibleIdx].coordinates;
        const distance = Math.sqrt(
          Math.pow(coords[0] - otherCoords[0], 2) +
            Math.pow(coords[1] - otherCoords[1], 2)
        );

        if (distance < minDistance) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        visible.add(idx);
      }
    });

    // Create a map of theater names to visibility
    const visibilityMap = new Set();
    visible.forEach((idx) => {
      visibilityMap.add(sorted[idx].name);
    });

    return visibilityMap;
  };

  // For close-by theaters at high zoom, compute vertical stacking offsets for labels
  const getGroupingThreshold = (zoom) => {
    if (zoom < 3) return 3.5;
    if (zoom < 5) return 2.5;
    if (zoom < 8) return 1.5;
    return 1.0; // tight threshold at very high zoom
  };

  const computeLabelOffsets = (theaterList, zoom, baseLineHeight) => {
    const threshold = getGroupingThreshold(zoom);
    const assigned = new Array(theaterList.length).fill(false);
    const groups = [];

    // Build groups of nearby theaters by degree distance
    for (let i = 0; i < theaterList.length; i++) {
      if (assigned[i]) continue;
      assigned[i] = true;
      const group = [i];
      const a = theaterList[i].coordinates;
      for (let j = i + 1; j < theaterList.length; j++) {
        if (assigned[j]) continue;
        const b = theaterList[j].coordinates;
        const dist = Math.sqrt(
          Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2)
        );
        if (dist <= threshold) {
          assigned[j] = true;
          group.push(j);
        }
      }
      groups.push(group);
    }

    // Build offset map
    const offsets = new Map();
    const unit = Math.max(baseLineHeight + 2, 10); // pixels between stacked labels

    groups.forEach((idxs) => {
      if (idxs.length === 1) {
        offsets.set(theaterList[idxs[0]].name, 0);
        return;
      }
      // Sort within group by latitude (north to south) for consistent stacking
      idxs.sort(
        (i1, i2) =>
          theaterList[i2].coordinates[1] - theaterList[i1].coordinates[1]
      );

      // Centered stacking: e.g., for 3 -> [-unit, 0, +unit]; for 4 -> [-1.5u, -0.5u, +0.5u, +1.5u]
      const n = idxs.length;
      for (let k = 0; k < n; k++) {
        const centeredIndex = k - (n - 1) / 2;
        const offsetPx = centeredIndex * unit;
        offsets.set(theaterList[idxs[k]].name, offsetPx);
      }
    });

    return offsets; // Map<theater.name, offsetPx>
  };

  const visibleLabels = getVisibleLabels(theaters, position.zoom);
  const labelOffsets = computeLabelOffsets(
    theaters,
    position.zoom,
    getLabelFontSize(position.zoom)
  );

  return (
    <div className="relative rounded-2xl border border-black bg-gradient-to-br from-[#fff9e8] via-[#f8efe0] to-[#efe3cf] h-[500px] lg:h-full flex flex-col">
      {/* Controls */}
      <div className="absolute z-10 top-2 left-2 right-2 md:top-3 md:left-3 md:right-auto md:w-auto flex flex-row md:items-center gap-2 bg-white/85 backdrop-blur rounded-md border border-black p-2 md:p-2">
        <div className="flex items-center gap-2">
          <button
            title="Zoom In"
            onClick={handleZoomIn}
            className={`px-3 py-1 text-sm font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
            }`}
          >
            +
          </button>
          <button
            title="Zoom Out"
            onClick={handleZoomOut}
            className={`px-3 py-1 text-sm font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
            }`}
          >
            −
          </button>
          <button
            title="Reset View"
            onClick={handleResetView}
            className={`px-3 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
            }`}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="w-full flex-1 select-none">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 400,
            center: [-98, 39],
          }}
          width={800}
          height={600}
          style={{ width: "100%", height: "100%", borderRadius: "16px" }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies
                  .filter((geo) => {
                    // Only show US and Canada for cleaner map
                    const name = geo.properties.name;
                    return (
                      name === "United States of America" || name === "Canada"
                    );
                  })
                  .map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={theme.land}
                      stroke={theme.stroke}
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: theme.land,
                          outline: "none",
                        },
                        pressed: {
                          fill: theme.land,
                          outline: "none",
                        },
                      }}
                    />
                  ))
              }
            </Geographies>

            {/* Theater Markers - All Individual Pins */}
            {theaters.map((theater, i) => {
              const innerRadius = Math.max(1, pinRadius * 0.45);
              return (
                <Marker key={`theater-${i}`} coordinates={theater.coordinates}>
                  <g
                    transform={`translate(-${pinRadius},-${pinRadius})`}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => handlePinClick(e, theater.url)}
                    onMouseEnter={() => setTooltipContent(theater.name)}
                    onMouseLeave={() => setTooltipContent("")}
                  >
                    <title>{`${theater.name}\n${theater.date}\nClick to buy tickets`}</title>
                    {/* Pin drop shape that scales with zoom */}
                    <g>
                      <circle
                        r={pinRadius}
                        fill={theme.pinFill}
                        stroke={theme.stroke}
                        strokeWidth={Math.max(0.6, pinRadius * 0.28)}
                        className="transition-all"
                      />
                      <circle
                        r={innerRadius}
                        fill="#fff"
                        stroke={theme.stroke}
                        strokeWidth={Math.max(0.4, pinRadius * 0.14)}
                      />
                    </g>
                  </g>
                  {/* City labels that scale with zoom - only show when zoomed in and not overlapping */}
                  {showLabels && visibleLabels.has(theater.name) && (
                    <text
                      textAnchor="start"
                      y={
                        (-20 + (labelOffsets.get(theater.name) || 0)) /
                        position.zoom
                      }
                      x={12 / position.zoom}
                      style={{
                        fontFamily: retroMode
                          ? theme.fontFamily
                          : "ui-monospace, Menlo, monospace",
                        fontSize: labelFontSize,
                        fontWeight: 600,
                        fill: theme.stroke,
                        pointerEvents: "none",
                        paintOrder: "stroke",
                        stroke: "#fff",
                        strokeWidth: 2,
                        strokeLinejoin: "round",
                      }}
                    >
                      {theater.city}
                    </text>
                  )}
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Instructions */}
      <div className="absolute z-10 bottom-3 left-3 text-xs opacity-70 font-mono p-2">
        Drag to pan, scroll to zoom. <b>Click pins</b> to buy tickets.
      </div>

      {/* Tooltip */}
      {tooltipContent && (
        <div className="absolute z-20 top-16 left-3 bg-white/95 backdrop-blur border-2 border-black p-3 rounded-md shadow-[4px_4px_0_0_rgba(0,0,0,0.6)] max-w-xs">
          <p className="text-xs font-bold">{tooltipContent}</p>
        </div>
      )}
    </div>
  );
}
