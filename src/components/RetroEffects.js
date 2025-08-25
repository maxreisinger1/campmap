/**
 * @fileoverview Retro visual effects overlay component for nostalgic styling
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Retro effects overlay component providing nostalgic visual styling.
 *
 * Renders scanlines, halftone patterns, grain effects, and orbiting dots
 * to create a retro computer terminal aesthetic. Only visible when retro
 * mode is enabled.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.retroMode - Whether retro effects should be visible
 * @param {boolean} props.hasSubmitted - Whether user has submitted (affects styling)
 * @returns {JSX.Element|null} Retro effects overlay or null if disabled
 *
 * @example
 * ```javascript
 * <RetroEffects
 *   retroMode={isRetroMode}
 *   hasSubmitted={userHasSubmitted}
 * />
 * ```
 */
export default function RetroEffects({ retroMode, hasSubmitted }) {
  if (!retroMode) return null;
  return (
    <div
      className="fade-layer absolute inset-0 pointer-events-none"
      style={{ opacity: retroMode ? 1 : 0 }}
    >
      <div className="scanlines" />
      <div className="halftone" />
      <div className="grain" />
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <div className="orbit" style={{ width: "70%", height: "70%" }}>
          <div className="dot" />
        </div>
        <div
          className="orbit"
          style={{ width: "85%", height: "85%", animationDuration: "32s" }}
        >
          <div className="dot" />
        </div>
        <div
          className="orbit"
          style={{ width: "100%", height: "100%", animationDuration: "40s" }}
        >
          <div className="dot" />
        </div>
      </div>
    </div>
  );
}
