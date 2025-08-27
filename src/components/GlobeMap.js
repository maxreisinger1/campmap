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
 * Interactive globe map component with rotation, zoom, and submission markers.
 *
 * Renders a 3D globe using react-simple-maps with world geography, submission
 * markers, and interactive controls. Supports different visual themes, zoom
 * levels, and rotation states with smooth animations.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<number>} props.rotate - Globe rotation [longitude, latitude, roll]
 * @param {Function} props.setRotate - Function to update globe rotation
 * @param {number} props.zoom - Current zoom level
 * @param {Function} props.setZoom - Function to update zoom level
 * @param {boolean} props.retroMode - Whether retro styling is enabled
 * @param {string} props.theme - Visual theme for styling
 * @param {Array} props.submissions - Array of user submissions with coordinates
 * @param {number} props.jitter - Amount of position jittering for markers
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
  // Clustering function to group nearby submissions when zoomed out
  const clusterSubmissions = (submissions, zoom) => {
    const CLUSTER_DISTANCE = zoom < 1.8 ? 8 : 3; // Larger clustering when zoomed out
    const clusters = [];
    const processed = new Set();

    submissions.forEach((submission, index) => {
      if (processed.has(index)) return;

      const cluster = {
        ...submission,
        count: 1,
        submissions: [submission],
      };

      // Find nearby submissions to cluster
      submissions.forEach((other, otherIndex) => {
        if (otherIndex === index || processed.has(otherIndex)) return;

        const distance = Math.sqrt(
          Math.pow(submission.lat - other.lat, 2) +
            Math.pow(submission.lon - other.lon, 2)
        );

        if (distance < CLUSTER_DISTANCE) {
          cluster.count++;
          cluster.submissions.push(other);
          processed.add(otherIndex);
        }
      });

      processed.add(index);
      clusters.push(cluster);
    });

    return clusters;
  };

  const clusters = clusterSubmissions(submissions, zoom);
  const showClustering = zoom < 1.8; // Show clustering when zoomed out
  // --- Simple label collision avoidance for city names (when not clustering) ---
  // Only show city label if it does not overlap with another label in a lat/lon grid cell
  // This is a fast, approximate solution for readability
  // Micro-clustering for dense areas at higher zoom
  // If 3+ submissions are within a small radius, show a single cluster marker and label
  const MICRO_CLUSTER_RADIUS = 1.5; // degrees, tune as needed
  const MICRO_CLUSTER_MIN = 3;
  function microCluster(submissions) {
    const clusters = [];
    const used = new Set();
    for (let i = 0; i < submissions.length; i++) {
      if (used.has(i)) continue;
      const s = submissions[i];
      const group = [i];
      for (let j = i + 1; j < submissions.length; j++) {
        if (used.has(j)) continue;
        const o = submissions[j];
        const d = Math.sqrt(
          Math.pow(s.lat - o.lat, 2) + Math.pow(s.lon - o.lon, 2)
        );
        if (d < MICRO_CLUSTER_RADIUS) {
          group.push(j);
        }
      }
      if (group.length >= MICRO_CLUSTER_MIN) {
        // Make a cluster
        const members = group.map(idx => submissions[idx]);
        const avgLat = members.reduce((sum, m) => sum + m.lat, 0) / members.length;
        const avgLon = members.reduce((sum, m) => sum + m.lon, 0) / members.length;
        clusters.push({
          type: 'micro',
          lat: avgLat,
          lon: avgLon,
          count: members.length,
          city: members[0].city || 'Cluster',
        });
        group.forEach(idx => used.add(idx));
      } else {
        // Not enough for a cluster, show as single
        clusters.push({
          type: 'single',
          ...s,
        });
        used.add(i);
      }
    }
    return clusters;
  }

  return (
    <div className="relative rounded-2xl border border-black bg-gradient-to-br from-[#fff9e8] via-[#f8efe0] to-[#efe3cf] shadow-[12px_12px_0_0_rgba(0,0,0,0.65)] h-full flex flex-col">
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
        className="w-full flex-1 select-none min-h-[520px]"
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
          {showClustering
            ? clusters.map((cluster, i) => (
                <Marker
                  key={`cluster-${cluster.id}-${i}`}
                  coordinates={[
                    cluster.lon + jitter(i) * 0.05,
                    cluster.lat + jitter(i) * 0.05,
                  ]}
                >
                  <g transform="translate(-8,-8)">
                    {cluster.count > 1 ? (
                      // Cluster visualization
                      <>
                        <circle
                          r={Math.min(12, 6 + cluster.count * 0.8)}
                          fill={retroMode ? "#ff00a6" : "#ef476f"}
                          fillOpacity={0.7}
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
                          {cluster.count}
                        </text>
                      </>
                    ) : (
                      // Single pin
                      <>
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
                      </>
                    )}
                  </g>
                  {cluster.count === 1 && zoom > 1.4 && (
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
                      {cluster.city}
                    </text>
                  )}
                </Marker>
              ))
            : microCluster(submissions).map((item, i) => {
                if (item.type === 'micro') {
                  return (
                    <Marker
                      key={`micro-${item.lat}-${item.lon}-${i}`}
                      coordinates={[
                        item.lon + jitter(i) * 0.1,
                        item.lat + jitter(i) * 0.1,
                      ]}
                    >
                      <g transform="translate(-8,-8)">
                        <circle
                          r={Math.min(12, 6 + item.count * 0.8)}
                          fill={retroMode ? "#ff00a6" : "#ef476f"}
                          fillOpacity={0.7}
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
                          {item.count}
                        </text>
                      </g>
                      <text
                        textAnchor="start"
                        y={-14}
                        x={12}
                        style={{
                          fontFamily: retroMode
                            ? theme.fontFamily
                            : "ui-monospace, Menlo, monospace",
                          fontSize: retroMode ? 9 : 10,
                          fontWeight: 800,
                        }}
                      >
                        {item.city} ({item.count})
                      </text>
                    </Marker>
                  );
                } else {
                  // Single pin
                  const showLabel = zoom > 1.4;
                  return (
                    <Marker
                      key={item.id}
                      coordinates={[
                        item.lon + jitter(i) * 0.1,
                        item.lat + jitter(i) * 0.1,
                      ]}
                    >
                      <g transform="translate(-6,-6)">
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
                          {item.city}
                        </text>
                      )}
                    </Marker>
                  );
                }
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
