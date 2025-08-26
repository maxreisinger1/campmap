/**
 * @fileoverview Retro-styled toast notification component with auto-dismiss
 * @author Creator Camp Team
 * @version 1.0.0
 */

import React, { useEffect } from "react";

/**
 * Toast notification component with retro styling and auto-dismiss functionality.
 *
 * Displays temporary messages with distinctive retro effects when enabled.
 * Automatically dismisses after 3.5 seconds and provides manual close option.
 * The component applies different styling based on retro mode.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display in the toast
 * @param {boolean} props.show - Whether the toast is visible
 * @param {Function} props.onClose - Callback function when toast is closed
 * @param {boolean} props.retroMode - Whether to apply retro styling effects
 * @returns {JSX.Element|null} Toast notification or null if not shown
 *
 * @example
 * ```javascript
 * <RetroToast
 *   message="Signup successful!"
 *   show={isToastVisible}
 *   onClose={handleToastClose}
 *   retroMode={isRetroMode}
 * />
 * ```
 */
export default function RetroToast({ message, show, onClose, retroMode }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed z-50 left-1/2 -translate-x-1/2 top-8 px-8 py-5 rounded-lg border-2 border-black shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] font-mono text-xl flex items-center gap-3 animate-toast-in max-w-md text-center ${
        retroMode ? "bg-[#00ffd1] text-black" : "bg-white text-black"
      }`}
      style={{
        filter: retroMode ? "contrast(1.5) saturate(1.3)" : undefined,
        textShadow: retroMode ? "1px 1px 0 #000, 2px 2px 0 #fff" : undefined,
      }}
    >
      <span role="img" aria-label="alert" className="text-2xl">
        �
      </span>
      <div className="font-bold">{message}</div>
      <button
        onClick={onClose}
        className="ml-4 px-3 py-2 border-2 border-black rounded bg-black text-white hover:bg-white hover:text-black transition font-bold"
        style={{ fontSize: "0.9em" }}
      >
        ✕
      </button>
    </div>
  );
}
