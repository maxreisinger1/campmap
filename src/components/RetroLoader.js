/**
 * @fileoverview Retro-styled loading component with animated bars
 * @author Creator Camp Team
 * @version 1.0.0
 */

import React from "react";
import "../styles/RetroLoader.css";

/**
 * Retro-styled loading indicator with animated bars and customizable text.
 *
 * Displays four animated loading bars with different styling based on retro mode.
 * The component includes custom CSS animations and typography that adapts to
 * the current visual theme.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.text="Loading..."] - Text to display below the loader
 * @param {boolean} props.retroMode - Whether to use retro styling
 * @returns {JSX.Element} Animated loading component
 *
 * @example
 * ```javascript
 * <RetroLoader text="Processing signup..." retroMode={true} />
 * ```
 */
export default function RetroLoader({ text = "Loading...", retroMode }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`retro-loader ${retroMode ? "retro" : ""}`}>
        <div className="loader-bar" />
        <div className="loader-bar" />
        <div className="loader-bar" />
        <div className="loader-bar" />
      </div>
      <div
        className={`mt-4 text-base font-mono font-bold ${
          retroMode ? "text-yellow-500" : "text-gray-700"
        }`}
        style={retroMode ? { fontFamily: '"Press Start 2P", monospace' } : {}}
      >
        {text}
      </div>
    </div>
  );
}
