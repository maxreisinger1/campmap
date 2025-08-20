import React, { useEffect } from "react";

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
      className={`fixed z-50 left-1/2 -translate-x-1/2 top-8 px-6 py-3 rounded-lg border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.7)] font-mono text-lg flex items-center gap-2 animate-toast-in ${
        retroMode ? "bg-[#00ffd1] text-black" : "bg-white text-black"
      }`}
      style={{
        filter: retroMode ? "contrast(1.5) saturate(1.3)" : undefined,
        textShadow: retroMode ? "1px 1px 0 #000, 2px 2px 0 #fff" : undefined,
      }}
    >
      <span role="img" aria-label="alert">
        🕹️
      </span>
      {message}
      <button
        onClick={onClose}
        className="ml-4 px-2 py-1 border border-black rounded bg-black text-white hover:bg-white hover:text-black transition"
        style={{ fontSize: "0.9em" }}
      >
        Close
      </button>
    </div>
  );
}
