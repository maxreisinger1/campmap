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
  return (
    <div className="relative rounded-2xl border border-black bg-gradient-to-br from-[#fff9e8] via-[#f8efe0] to-[#efe3cf] shadow-[12px_12px_0_0_rgba(0,0,0,0.65)] h-full flex flex-col">
      <div className="absolute z-10 top-3 left-3 flex items-center gap-2 bg-white/85 backdrop-blur rounded-md border border-black p-2">
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
          max={7.5}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
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
          style={{ width: "100%", height: "100%" }}
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
            : submissions.map((s, i) => (
                <Marker
                  key={s.id}
                  coordinates={[
                    s.lon + jitter(i) * 0.1,
                    s.lat + jitter(i) * 0.1,
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
                    {s.city}
                  </text>
                </Marker>
              ))}
        </ComposableMap>
      </div>

      {/* Instructions text in bottom right corner */}
      <div className="absolute z-10 bottom-3 left-3 text-xs opacity-70 font-mono p-2">
        Drag to spin, wheel to zoom. Hold <b>Shift</b> for faster spin.
      </div>
    </div>
  );
}
