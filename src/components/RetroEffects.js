import React from "react";

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
