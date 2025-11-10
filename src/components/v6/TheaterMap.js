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
    name: "Albuquerque Rio 24 + XD (Albuquerque, NM)",
    city: "Albuquerque, NM",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=419&ShowtimeId=760355&CinemarkMovieId=106965&Showtime=2025-11-14T18:45:00",
    coordinates: [-106.6504, 35.0844],
  },
  {
    name: "Regal Atlantic Station (Atlanta, GA)",
    city: "Atlanta, GA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=349846&site=1346&date=11-14-2025",
    coordinates: [-84.388, 33.749],
  },
  {
    name: "Alamo Slaughter Lane 8 (Austin, TX)",
    city: "Austin, TX",
    date: "14-Nov",
    url: "https://drafthouse.com/austin/show/two-sleepy-people?cinemaId=0006&sessionId=207292",
    coordinates: [-97.7431, 30.2672],
  },
  {
    name: "Regal Stonecrest at Piper Glen (Charlotte, NC)",
    city: "Charlotte, NC",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=416635&site=0384&date=11-14-2025",
    coordinates: [-80.8431, 35.2271],
  },
  {
    name: "Regal City North (Chicago, IL)",
    city: "Chicago, IL",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=250606&site=1789&date=11-14-2025",
    coordinates: [-87.6298, 41.8781],
  },
  {
    name: "Cinemark West Plano 20 + XD (Plano, TX)",
    city: "Plano, TX",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=231&ShowtimeId=840576&CinemarkMovieId=106965&Showtime=2025-11-14T18:45:00",
    coordinates: [-96.6989, 33.0198],
  },
  {
    name: "Cinemark 17 + XD, IMAX (Dallas, TX)",
    city: "Dallas, TX",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=207&ShowtimeId=607066&CinemarkMovieId=106965&Showtime=2025-11-14T19:15:00",
    coordinates: [-96.797, 32.7767],
  },
  {
    name: "Regal UA Denver Pavilions (Denver, CO)",
    city: "Denver, CO",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=247772&site=1315&date=11-14-2025",
    coordinates: [-104.9903, 39.7392],
  },
  {
    name: "Regal Valley River Center (Eugene, OR)",
    city: "Eugene, OR",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=248818&site=0670&date=11-14-2025",
    coordinates: [-123.0868, 44.0521],
  },
  {
    name: "Regal Coldwater Crossing (Fort Wayne, IN)",
    city: "Fort Wayne, IN",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=267876&site=0169&date=11-14-2025",
    coordinates: [-85.1394, 41.0793],
  },
  {
    name: "Regal Edwards Greenway Grand Palace (Houston, TX)",
    city: "Houston, TX",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=414824&site=1051&date=11-14-2025",
    coordinates: [-95.3698, 29.7604],
  },
  {
    name: "Xscape Katy 12  (Richmond, TX)",
    city: "Richmond, TX",
    date: "14-Nov",
    url: "https://kf12.xscapetheatres.com/seats/16995/",
    coordinates: [-95.7605, 29.5822],
  },
  {
    name: "Regal Red Rock (Las Vegas, NV)",
    city: "Las Vegas, NV",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=266168&site=0659&date=11-14-2025",
    coordinates: [-115.1398, 36.1699],
  },
  {
    name: "Regal Kendall Village (Miami, FL)",
    city: "Miami, FL",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=287674&site=0996&date=11-14-2025",
    coordinates: [-80.1918, 25.7617],
  },
  {
    name: "Regal Opry Mills (Nashville, TN)",
    city: "Nashville, TN",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=401602&site=0615&date=11-14-2025",
    coordinates: [-86.7816, 36.1627],
  },
  {
    name: "Regal Union Square (New York, NY)",
    city: "New York, NY",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=275422&site=1320&date=11-14-2025",
    coordinates: [-74.006, 40.7128],
  },
  {
    name: "Universal Cinemark at CityWalk +XD (Orlando, FL)",
    city: "Orlando, FL",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=1017&ShowtimeId=230681&CinemarkMovieId=106965&Showtime=2025-11-14T18:30:00",
    coordinates: [-81.3792, 28.5383],
  },
  {
    name: "Regal UA Grant Plaza (Philadelphia, PA)",
    city: "Philadelphia, PA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=148417&site=1290&date=11-14-2025",
    coordinates: [-75.1652, 39.9526],
  },
  {
    name: "Portland Eastport Plaza (Portland, OR)",
    city: "Portland, OR",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=432&ShowtimeId=493896&CinemarkMovieId=106965&Showtime=2025-11-14T19:30:00",
    coordinates: [-122.6765, 45.5152],
  },
  {
    name: "Regal Short Pump (Richmond, VA)",
    city: "Richmond, VA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=247801&site=0730&date=11-14-2025",
    coordinates: [-77.436, 37.5407],
  },
  {
    name: "Megaplex Theatres Jordan Commons + IMAX (Sandy, UT)",
    city: "Sandy, UT",
    date: "14-Nov",
    url: "https://megaplex.com/checkout/jordancommons/0001-225653/HO00004049/two-sleepy-people",
    coordinates: [-111.891, 40.5649],
  },
  {
    name: "Regal Cielo Vista (San Antonio, TX)",
    city: "San Antonio, TX",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=305376&site=0765&date=11-14-2025",
    coordinates: [-98.4936, 29.4241],
  },
  {
    name: "Regal Stonestown Galleria (San Francisco, CA)",
    city: "San Francisco, CA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=91983&site=1464&date=11-14-2025",
    coordinates: [-122.4194, 37.7749],
  },
  {
    name: "Redwood Downtown 20 + XD (Redwood City, CA)",
    city: "Redwood City, CA",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=485&ShowtimeId=667597&CinemarkMovieId=106965&Showtime=2025-11-14T19:30:00",
    coordinates: [-122.2264, 37.4852],
  },
  {
    name: "Cinelounge - Tiburon (Tiburon, CA)",
    city: "Tiburon, CA",
    date: "14-Nov",
    url: "https://cineloungefilm.com/checkout/seats/2269170",
    coordinates: [-122.4564, 37.8736],
  },
  {
    name: "Regal Thornton Place (Seattle, WA)",
    city: "Seattle, WA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=287461&site=1937&date=11-14-2025",
    coordinates: [-122.3321, 47.6062],
  },
  {
    name: "Cineplex Cinemas Yonge-Dundas and VIP (Toronto, ON)",
    city: "Toronto, ON",
    date: "15-Nov",
    url: "https://www.cineplex.com/ticketing/preview?theatreId=7130&showtimeId=423182&dbox=false",
    coordinates: [-79.3832, 43.6532],
  },
  {
    name: "Xscape Theatres Brandywine 14 + XTR (Brandywine, MD)",
    city: "Brandywine, MD",
    date: "14-Nov",
    url: "https://bw14.xscapetheatres.com/seats/22393/",
    coordinates: [-76.8583, 38.6962],
  },
  {
    name: "Regal Gallery Place (Washington, DC)",
    city: "Washington, DC",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=242490&site=1551&date=11-14-2025",
    coordinates: [-77.0369, 38.9072],
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
    zoom: 1.9,
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

  // Improved clustering logic based on zoom level
  function clusterTheaters(theaters, zoom) {
    // At higher zoom levels, show individual theaters
    if (zoom >= 3) {
      return theaters.map((t) => ({ type: "single", theater: t }));
    }

    // Calculate clustering radius based on zoom (larger radius = more clustering at lower zoom)
    // Adjusted to be more aggressive at lower zoom levels
    const clusterRadius = zoom < 1.5 ? 12 : zoom < 2 ? 8 : zoom < 2.5 ? 5 : 3;

    const clusters = [];
    const used = new Set();

    // Sort theaters to process them in a consistent order
    const sortedTheaters = theaters.map((t, idx) => ({
      ...t,
      originalIndex: idx,
    }));

    sortedTheaters.forEach((theater, i) => {
      const originalIdx = theater.originalIndex;
      if (used.has(originalIdx)) return;

      const nearby = [originalIdx];
      used.add(originalIdx);

      sortedTheaters.forEach((other, j) => {
        const otherIdx = other.originalIndex;
        if (i === j || used.has(otherIdx)) return;

        const distance = Math.sqrt(
          Math.pow(theater.coordinates[0] - other.coordinates[0], 2) +
            Math.pow(theater.coordinates[1] - other.coordinates[1], 2)
        );

        if (distance < clusterRadius) {
          nearby.push(otherIdx);
          used.add(otherIdx);
        }
      });

      if (nearby.length === 1) {
        clusters.push({ type: "single", theater });
      } else {
        // Calculate cluster center
        const centerLon =
          nearby.reduce((sum, idx) => sum + theaters[idx].coordinates[0], 0) /
          nearby.length;
        const centerLat =
          nearby.reduce((sum, idx) => sum + theaters[idx].coordinates[1], 0) /
          nearby.length;

        clusters.push({
          type: "cluster",
          coordinates: [centerLon, centerLat],
          count: nearby.length,
          theaters: nearby.map((idx) => theaters[idx]),
        });
      }
    });

    return clusters;
  }

  function handleZoomIn() {
    if (position.zoom >= 16) return;
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

  function handleClusterClick(e, cluster) {
    e.stopPropagation();
    // Zoom in and center on cluster
    setPosition({
      coordinates: cluster.coordinates,
      zoom: position.zoom * 2,
    });
  }

  function handleResetView() {
    setPosition({ coordinates: [-98, 39], zoom: 1.3 });
  }

  const clusteredMarkers = clusterTheaters(theaters, position.zoom);

  // Calculate label font size based on zoom level
  // Smaller at low zoom, larger as you zoom in
  const getLabelFontSize = (zoom) => {
    if (zoom < 1.5) return 6;
    if (zoom < 2) return 7;
    if (zoom < 3) return 8;
    if (zoom < 4) return 9;
    if (zoom < 6) return 10;
    return 11;
  };

  const labelFontSize = getLabelFontSize(position.zoom);

  return (
    <div className="relative rounded-2xl border border-black bg-gradient-to-br from-[#fff9e8] via-[#f8efe0] to-[#efe3cf] h-full flex flex-col">
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
      <div className="w-full flex-1 select-none min-h-[520px]">
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

            {/* Theater Markers with Clustering */}
            {clusteredMarkers.map((item, i) => {
              if (item.type === "single") {
                const theater = item.theater;
                return (
                  <Marker key={`single-${i}`} coordinates={theater.coordinates}>
                    <g
                      transform="translate(-6,-6)"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => handlePinClick(e, theater.url)}
                      onMouseEnter={() => setTooltipContent(theater.name)}
                      onMouseLeave={() => setTooltipContent("")}
                    >
                      <title>{`${theater.name}\n${theater.date}\nClick to buy tickets`}</title>
                      {/* Pin drop shape */}
                      <g>
                        <circle
                          r={5}
                          fill={theme.pinFill}
                          stroke={theme.stroke}
                          strokeWidth={1.5}
                          className="transition-all hover:r-6"
                        />
                        <circle
                          r={2}
                          fill="#fff"
                          stroke={theme.stroke}
                          strokeWidth={0.8}
                        />
                      </g>
                    </g>
                    {/* City labels that scale with zoom */}
                    <text
                      textAnchor="start"
                      y={-8}
                      x={6}
                      style={{
                        fontFamily: retroMode
                          ? theme.fontFamily
                          : "ui-monospace, Menlo, monospace",
                        fontSize: labelFontSize,
                        fontWeight: 700,
                        fill: theme.stroke,
                        pointerEvents: "none",
                      }}
                    >
                      {theater.city}
                    </text>
                  </Marker>
                );
              } else {
                // Cluster marker
                const cluster = item;
                const radius = Math.min(14, 8 + cluster.count * 1.5);
                return (
                  <Marker
                    key={`cluster-${i}`}
                    coordinates={cluster.coordinates}
                  >
                    <g
                      transform="translate(-8,-8)"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => handleClusterClick(e, cluster)}
                      onMouseEnter={() =>
                        setTooltipContent(
                          `${cluster.count} theaters\nClick to zoom in`
                        )
                      }
                      onMouseLeave={() => setTooltipContent("")}
                    >
                      <title>
                        {`${cluster.count} theaters:\n${cluster.theaters
                          .map((t) => t.city)
                          .join("\n")}\n\nClick to zoom in`}
                      </title>
                      {/* Cluster circle */}
                      <circle
                        r={radius}
                        fill={theme.pinFill}
                        fillOpacity={0.85}
                        stroke={theme.stroke}
                        strokeWidth={2}
                      />
                      {/* Count text */}
                      <text
                        textAnchor="middle"
                        y={5}
                        style={{
                          fontFamily: retroMode
                            ? theme.fontFamily
                            : "ui-monospace, Menlo, monospace",
                          fontSize: 11,
                          fontWeight: 900,
                          fill: "#fff",
                          pointerEvents: "none",
                        }}
                      >
                        {cluster.count}
                      </text>
                    </g>
                  </Marker>
                );
              }
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
