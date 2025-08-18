import { useState, useRef, useEffect, useMemo } from "react";
import SignupForm from "./SignupForm";
import Leaderboard from "./Leaderboard";
import GlobeMap from "./GlobeMap";
import RetroEffects from "./RetroEffects";
import Header from "./Header";
import { exportToCSV } from "../utils/csv";
import { lookupZip } from "../utils/zipLookup";
import { clamp } from "../utils/helpers";
import { SEED_ZIPS } from "../services/testdata";
import {
  addSubmission,
  loadSubmissions,
  seedSubmissions,
} from "../services/SubmissionsService";
import { supabase } from "../services/supabase";

const CITY_GOAL = 100;

export default function FanDemandGlobe() {
  const [rotate, setRotate] = useState([-20, -15, 0]);
  const [zoom, setZoom] = useState(1.15);
  const [cursor, setCursor] = useState("grab");
  const [fatal, setFatal] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", zip: "" });
  const [message, setMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [retroMode, setRetroMode] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const resumeTimer = useRef(null);
  const RESUME_AFTER = 1500;

  const containerRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startRotate: rotate,
    factor: 0.35,
  });

  // Load submissions from Supabase on component mount
  useEffect(() => {
    const loadSubmissionsOnMount = async () => {
      try {
        const data = await loadSubmissions();
        setSubmissions(data);
      } catch (error) {
        setFatal(String(error.message || error));
      }
    };

    loadSubmissionsOnMount();
  }, []);

  useEffect(() => {
    const onErr = (e) => setFatal(String(e?.message || e));
    const onRej = (e) =>
      setFatal(String(e.reason?.message || e.reason || "Promise error"));
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => {
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, []);

  const leaderboard = useMemo(() => {
    const m = new Map();
    for (const s of submissions)
      m.set(`${s.city}, ${s.state}`, (m.get(`${s.city}, ${s.state}`) || 0) + 1);
    return Array.from(m.entries())
      .map(([place, count]) => ({ place, count }))
      .sort((a, b) => b.count - a.count || a.place.localeCompare(b.place));
  }, [submissions]);

  const focus = (lat, lon) => setRotate([-lon, -lat, 0]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const down = (e) => {
      setCursor("grabbing");
      dragRef.current = {
        ...dragRef.current,
        dragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startRotate: rotate,
      };
      el.setPointerCapture?.(e.pointerId);
    };
    const move = (e) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const f = e.shiftKey
        ? dragRef.current.factor * 1.8
        : dragRef.current.factor;
      const [rx, ry] = dragRef.current.startRotate;
      setRotate([rx + dx * f, clamp(ry - dy * f, -89, 89), 0]);
    };
    const up = (e) => {
      dragRef.current.dragging = false;
      setCursor("grab");
      el.releasePointerCapture?.(e.pointerId);
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [rotate]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      setZoom((z) => clamp(z * (e.deltaY > 0 ? 0.95 : 1.05), 0.9, 2.2));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const autoSpeed = retroMode ? 0.12 : 0.06;
  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => {
      setRotate(([x, y, z]) => [x + autoSpeed, y, z]);
    }, 30);
    return () => clearInterval(id);
  }, [autoRotate, autoSpeed]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onDown = () => {
      setAutoRotate(false);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
    const onUp = () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setAutoRotate(true), RESUME_AFTER);
    };
    const onWheel = () => {
      setAutoRotate(false);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setAutoRotate(true), RESUME_AFTER);
    };
    const onTouchStart = onDown;
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const { name, email, zip } = form;
    if (!name.trim()) return setMessage("Please enter your name.");
    if (!EMAIL_RE.test(email)) return setMessage("Please enter a valid email.");
    const z = String(zip || "").trim();
    if (z.length < 5) return setMessage("Enter a 5-digit ZIP.");

    try {
      console.log("Submitting form:", { name, email, zip });
      const info = await lookupZip(z);
      const submission = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        zip: z,
        city: info.city,
        state: info.state,
        city_id: "7b103d22-0dd7-4889-96cf-ca04d0055b15",
        lat: Number(info.lat),
        lon: Number(info.lon),
      };
      const { data, error } = await supabase.functions.invoke("submit_signup", {
        body: submission,
      });

      if (error) throw error.message || "Failed to submit form";

      setSubmissions((prev) => [data.submission, ...prev]); // 👈 correct
      setForm({ name: "", email: "", zip: "" });
      setMessage("Pinned! Thanks for raising your hand.");
      setHasSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  }

  async function seedDemo() {
    try {
      const zips = Object.keys(SEED_ZIPS);
      const sample = zips.map((z) => {
        const info = SEED_ZIPS[z];
        return {
          name: `Fan ${z}`,
          email: `fan${z}@example.com`,
          zip: z,
          city: info.city,
          state: info.state,
          lat: info.lat,
          lon: info.lon,
        };
      });
      const data = await seedSubmissions(sample);
      setSubmissions((prev) => [...data, ...prev]);
      setMessage("Loaded sample pins.");
    } catch (error) {
      setMessage(`Failed to load demo pins: ${error.message}`);
    }
  }

  const jitter = (i) => (i % 2 ? 0.2 : -0.2) * ((i % 5) + 1);

  const theme = useMemo(() => {
    if (!retroMode)
      return {
        ocean: "#e7f6f2",
        land: "#d2d2d2",
        stroke: "#111",
        barFill:
          "linear-gradient(90deg,rgba(0,0,0,0.15),transparent 6px),repeating-linear-gradient(90deg,#c8facc,#c8facc 12px,#aaf0b4 12px,#aaf0b4 24px)",
        fontFamily: "inherit",
      };
    return {
      ocean: "#dff5f2",
      land: "#26d0c9",
      stroke: "#0e2a47",
      barFill:
        "linear-gradient(90deg, rgba(14,42,71,0.15), transparent 6px), repeating-linear-gradient(90deg,#ffd36e,#ffd36e 12px,#ffb84a 12px,#ffb84a 24px)",
      fontFamily: '"Barlow", "Futura", ui-sans-serif, system-ui',
    };
  }, [retroMode]);

  return (
    <div
      data-retro={retroMode ? "true" : "false"}
      className="min-h-screen w-full bg-[#f7f1e1] text-[#1f2937]"
      style={{ fontFamily: theme.fontFamily }}
    >
      {/* Global styles and retro effects */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;700;900&family=Press+Start+2P&display=swap');
        [data-retro="true"] .blink { animation: blink 1s steps(2, start) infinite; }
        @keyframes blink { to { visibility: hidden; } }
        [data-retro="true"] .retro-btn { box-shadow: 4px 4px 0 #000; border-width: 3px; }
        .scanlines { pointer-events:none; position:absolute; inset:0; background: repeating-linear-gradient( to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px ); mix-blend-mode: overlay; opacity: 0.28; }
        .halftone { pointer-events:none; position:absolute; inset:0; background-image: radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px); background-size: 6px 6px; opacity: 0.35; }
        .grain { pointer-events:none; position:absolute; inset:0; background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.08"/></svg>'); opacity: .6; mix-blend-mode: overlay; }
        .chrome { background-image: linear-gradient(180deg, #fff, #e9ecef 40%, #cfd4da 60%, #fff); border: 2px solid #0e2a47; box-shadow: 0 4px 0 #0e2a47; }
        .orbit { position:absolute; border:2px solid rgba(14,42,71,.35); border-radius:9999px; animation: spin 24s linear infinite; }
        .orbit .dot { position:absolute; width:8px; height:8px; background:#ff6f3d; border-radius:9999px; top:-4px; left:50%; transform:translateX(-50%); box-shadow:0 0 8px rgba(255,111,61,.6); }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-layer { transition: opacity 480ms ease; }
      `}</style>

      {/* Header and retro toggle */}
      <Header
        retroMode={retroMode}
        setRetroMode={setRetroMode}
        setTransitioning={setTransitioning}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Signup form */}
          <SignupForm
            form={form}
            setForm={setForm}
            handleSubmit={handleSubmit}
            message={message}
            fatal={fatal}
            retroMode={retroMode}
            seedDemo={seedDemo}
            setMessage={setMessage}
          />

          {/* Leaderboard */}
          <Leaderboard
            leaderboard={leaderboard}
            submissions={submissions}
            CITY_GOAL={CITY_GOAL}
            focus={focus}
            theme={theme}
          />
        </div>

        <div className="lg:col-span-3">
          {/* Globe map and controls */}
          <GlobeMap
            rotate={rotate}
            setRotate={setRotate}
            zoom={zoom}
            setZoom={setZoom}
            retroMode={retroMode}
            theme={theme}
            submissions={submissions}
            jitter={jitter}
            containerRef={containerRef}
            cursor={cursor}
            hasSubmitted={hasSubmitted}
          />
          <div className="mt-3 text-xs opacity-70 font-mono">
            Drag to spin, wheel to zoom. Hold <b>Shift</b> for faster spin.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8 mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="text-xs font-mono opacity-70">
          © {new Date().getFullYear()} Camp Studios — All vibes reserved.
        </div>
        <div className="text-xs font-mono">
          Roadmap: <span className="underline">Global postcode geocoding</span>{" "}
          • <span className="underline">Auth + DB (Supabase)</span> •{" "}
          <span className="underline">Spam protection</span> •{" "}
          <span className="underline">Public city pages</span>
        </div>
      </div>

      {/* Retro overlays and effects */}
      <RetroEffects retroMode={retroMode} hasSubmitted={hasSubmitted} />
    </div>
  );
}
