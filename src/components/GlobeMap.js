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
          max={2.2}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
      </div>

      <div
        ref={containerRef}
        className="w-full flex-1 select-none min-h-[520px] p-4"
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
                    hover: { fill: retroMode ? "#00e1ba" : "#c7c7c7" },
                    pressed: { fill: retroMode ? "#00c7a3" : "#bbb" },
                  }}
                />
              ))
            }
          </Geographies>
          {submissions.map((s, i) => (
            <Marker
              key={s.id}
              coordinates={[s.lon + jitter(i) * 0.1, s.lat + jitter(i) * 0.1]}
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
