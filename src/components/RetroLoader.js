import React from "react";
import "../styles/RetroLoader.css";

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
