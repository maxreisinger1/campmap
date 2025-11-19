/**
 * @fileoverview Interactive 3D globe map component with geographic visualization
 * @author Creator Camp Team
 * @version 1.0.0
 */

import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Marker,
} from "react-simple-maps";

/**
 * URL for world geographic data used in the globe visualization.
 * @constant {string}
 */
const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Interactive globe map component with rotation, zoom, city pin markers, and zoom-in clustering.
 *
 * Renders a 3D globe using react-simple-maps with world geography and city pins
 * from the database. Each pin shows its city label and aggregated count at the
 * exact coordinates. All clustering logic has been removed as requested.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<number>} props.rotate - Globe rotation [longitude, latitude, roll]
 * @param {Function} props.setRotate - Function to update globe rotation
 * @param {number} props.zoom - Current zoom level
 * @param {Function} props.setZoom - Function to update zoom level
 * @param {boolean} props.retroMode - Whether retro styling is enabled
 * @param {string} props.theme - Visual theme for styling
 * @param {Array} props.submissions - Array of city pins with coordinates
 *   Expected shape: { id, city, state, lat, lon, count }
 * @param {number} props.jitter - (unused) Amount of position jittering for markers
 * @param {React.RefObject} props.containerRef - Reference to container element
 * @param {string} props.cursor - CSS cursor style
 * @param {boolean} props.hasSubmitted - Whether user has submitted
 * @returns {JSX.Element} Interactive globe with controls and markers
 *
 * @example
 * ```javascript
 * <GlobeMap
 *   rotate={[0, 0, 0]}
 *   setRotate={setRotation}
 *   zoom={150}
 *   setZoom={setZoom}
 *   retroMode={false}
 *   theme="modern"
 *   submissions={submissionData}
 *   jitter={0.1}
 *   containerRef={mapRef}
 *   cursor="grab"
 *   hasSubmitted={false}
 * />
 * ```
 */
export default function GlobeMap({
  rotate,
  setRotate,
  zoom,
  setZoom,
  retroMode,
  theme,
  submissions,
  jitter,
  containerRef,
  cursor,
  hasSubmitted,
}) {
  // Clustering across all zoom levels: group nearby pins by on-screen proximity
  // so dense areas remain readable. The proximity is a constant screen radius
  // in pixels, converted to degrees given current zoom/projection. As you zoom
  // out, the degree radius grows (bigger clusters). As you zoom in, it shrinks
  // (smaller clusters until singles).

  // Compute an angular (degree) radius approximating a fixed pixel radius at current zoom
  // For d3-geo orthographic: pixels per degree ~ scale * PI/180, where scale = 200 * zoom
  function degreesRadiusForPixels(px, zoomVal) {
    const pixelsPerDegree = 200 * zoomVal * (Math.PI / 180);
    return px / Math.max(1e-6, pixelsPerDegree);
  }

  function clusterOnZoomIn(points, zoomVal, targetPx = 18) {
    if (!Array.isArray(points) || points.length === 0) return [];
    const radiusDeg = degreesRadiusForPixels(targetPx, zoomVal);

    const used = new Array(points.length).fill(false);
    const clusters = [];

    for (let i = 0; i < points.length; i++) {
      if (used[i]) continue;
      const a = points[i];
      const groupIdx = [i];
      used[i] = true;
      for (let j = i + 1; j < points.length; j++) {
        if (used[j]) continue;
        const b = points[j];
        const dLat = a.lat - b.lat;
        const dLon = a.lon - b.lon;
        const distDeg = Math.hypot(dLat, dLon);
        if (distDeg <= radiusDeg) {
          used[j] = true;
          groupIdx.push(j);
        }
      }

      if (groupIdx.length === 1) {
        const p = points[i];
        clusters.push({ type: "single", item: p });
      } else {
        // Aggregate group: average position and sum counts
        let sumLat = 0;
        let sumLon = 0;
        let totalCount = 0;
        const members = [];
        for (const idx of groupIdx) {
          const p = points[idx];
          sumLat += p.lat;
          sumLon += p.lon;
          totalCount += Number(p.count || 0);
          members.push(p);
        }
        const lat = sumLat / groupIdx.length;
        const lon = sumLon / groupIdx.length;
        clusters.push({
          type: "cluster",
          lat,
          lon,
          totalCount,
          size: groupIdx.length,
          members,
        });
      }
    }

    return clusters;
  }

  return (
    <div className="relative rounded-2xl border border-black bg-gradient-to-br from-[#fff9e8] via-[#f8efe0] to-[#efe3cf] shadow-[6px_6px_0_0_rgba(0,0,0,0.6)] md:shadow-[8px_8px_0_0_rgba(0,0,0,0.6)] h-full flex flex-col">
      <div className="absolute z-10 top-2 left-2 right-2 md:top-3 md:left-3 md:right-auto md:w-auto flex flex-row md:items-center gap-2 bg-white/85 backdrop-blur rounded-md border border-black p-2 md:p-2">
        {/* Mobile: Rotation controls in a single horizontal line */}
        <div className="flex md:hidden">
          <div className="flex gap-1">
            <button
              title="Rotate Left"
              onClick={() => setRotate(([x, y, z]) => [x - 15, y, z])}
              className={`px-1 py-1 text-xs font-bold border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                retroMode
                  ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                  : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
              }`}
            >
              ◀
            </button>
            <button
              title="Rotate Right"
              onClick={() => setRotate(([x, y, z]) => [x + 15, y, z])}
              className={`px-1 py-1 text-xs font-bold border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                retroMode
                  ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                  : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
              }`}
            >
              ▶
            </button>
            <button
              title="Rotate Up"
              onClick={() => setRotate(([x, y, z]) => [x, y - 10, z])}
              className={`px-1 py-1 text-xs font-bold border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                retroMode
                  ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                  : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
              }`}
            >
              ▲
            </button>
            <button
              title="Rotate Down"
              onClick={() => setRotate(([x, y, z]) => [x, y + 10, z])}
              className={`px-1 py-1 text-xs font-bold border border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
                retroMode
                  ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                  : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
              }`}
            >
              ▼
            </button>
          </div>
        </div>

        {/* Mobile: Zoom controls */}
        <div className="flex md:hidden items-center gap-1 flex-1">
          <label className="text-xs font-bold">Zoom</label>
          <input
            type="range"
            min={0.9}
            max={100}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 min-w-0"
          />
        </div>

        {/* Desktop: Original horizontal layout */}
        <div className="hidden md:flex items-center gap-2">
          <button
            title="Rotate Left"
            onClick={() => setRotate(([x, y, z]) => [x - 15, y, z])}
            className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
            }`}
          >
            ◀
          </button>
          <button
            title="Rotate Right"
            onClick={() => setRotate(([x, y, z]) => [x + 15, y, z])}
            className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
            }`}
          >
            ▶
          </button>
          <button
            title="Rotate Up"
            onClick={() => setRotate(([x, y, z]) => [x, y - 10, z])}
            className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
            }`}
          >
            ▲
          </button>
          <button
            title="Rotate Down"
            onClick={() => setRotate(([x, y, z]) => [x, y + 10, z])}
            className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                : "bg-[#d2f8d2] hover:bg-[#c2f5c2]"
            }`}
          >
            ▼
          </button>
          <div className="h-6 w-px bg-black/20 mx-1" />
          <label className="text-xs font-bold">Zoom</label>
          <input
            type="range"
            min={0.9}
            max={100}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full flex-1 select-none min-h-[400px] md:min-h-[520px]"
        style={{ cursor }}
      >
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ scale: 200 * zoom, rotate }}
          width={800}
          height={600}
          style={{ width: "100%", height: "100%", borderRadius: "16px" }}
        >
          <Sphere stroke={theme.stroke} strokeWidth={0.75} fill={theme.ocean} />
          <Graticule
            stroke={theme.stroke}
            strokeOpacity={retroMode ? 0.2 : 0.08}
          />
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={theme.land}
                  stroke={theme.stroke}
                  strokeWidth={0.3}
                  style={{
                    default: { outline: "none" },
                    hover: {
                      fill: retroMode ? "#00e1ba" : "#c7c7c7",
                      outline: "none",
                    },
                    pressed: {
                      fill: retroMode ? "#00c7a3" : "#bbb",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          {Array.isArray(submissions) &&
            submissions.length > 0 &&
            clusterOnZoomIn(submissions, zoom).map((c, i) => {
              if (c.type === "single") {
                const item = c.item;
                const lat = Number(item.lat);
                const lon = Number(item.lon);
                if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
                const key = item.id || `${lat}-${lon}-s-${i}`;
                const label = `${item.city || ""}${
                  item.state ? ", " + item.state : ""
                } (${item.count ?? 0})`;
                const showLabel = zoom >= 1.4; // hide labels when very zoomed out to reduce clutter
                return (
                  <Marker key={key} coordinates={[lon, lat]}>
                    <g transform="translate(-6,-6)">
                      <title>{label}</title>
                      <circle
                        r={5.5}
                        fill={retroMode ? "#ff00a6" : "#ef476f"}
                        stroke={theme.stroke}
                        strokeWidth={1.25}
                      />
                      <circle
                        r={2}
                        fill="#fff"
                        stroke={theme.stroke}
                        strokeWidth={1}
                      />
                    </g>
                    {showLabel && (
                      <text
                        textAnchor="start"
                        y={-10}
                        x={8}
                        style={{
                          fontFamily: retroMode
                            ? theme.fontFamily
                            : "ui-monospace, Menlo, monospace",
                          fontSize: retroMode ? 9 : 10,
                          fontWeight: 800,
                        }}
                      >
                        {label}
                      </text>
                    )}
                  </Marker>
                );
              }
              // cluster bubble
              const key = `c-${c.lat}-${c.lon}-${i}`;
              return (
                <Marker key={key} coordinates={[c.lon, c.lat]}>
                  <g transform="translate(-8,-8)">
                    <title>
                      {(() => {
                        const header = `${c.size} cities • ${c.totalCount} signups`;
                        const topN = 6;
                        const list = (c.members || [])
                          .slice()
                          .sort((a, b) => (b.count || 0) - (a.count || 0))
                          .map(
                            (m) =>
                              `${m.city || ""}${
                                m.state ? ", " + m.state : ""
                              } (${m.count ?? 0})`
                          );
                        const more =
                          list.length > topN
                            ? `\n+${list.length - topN} more…`
                            : "";
                        return `${header}\n${list
                          .slice(0, topN)
                          .join("\n")}${more}`;
                      })()}
                    </title>
                    <circle
                      r={Math.min(14, 6 + Math.sqrt(c.totalCount) * 1.2)}
                      fill={retroMode ? "#ff00a6" : "#ef476f"}
                      fillOpacity={0.78}
                      stroke={theme.stroke}
                      strokeWidth={1.5}
                    />
                    <text
                      textAnchor="middle"
                      y={4}
                      style={{
                        fontFamily: retroMode
                          ? theme.fontFamily
                          : "ui-monospace, Menlo, monospace",
                        fontSize: 11,
                        fontWeight: 900,
                        fill: "#fff",
                      }}
                    >
                      {c.totalCount}
                    </text>
                  </g>
                </Marker>
              );
            })}
        </ComposableMap>
      </div>

      {/* Instructions text in bottom right corner */}
      <div className="absolute z-10 bottom-3 left-3 text-xs opacity-70 font-mono p-2">
        Drag to spin, wheel to zoom. Hold <b>Shift</b> for faster spin.
      </div>
    </div>
  );
}
