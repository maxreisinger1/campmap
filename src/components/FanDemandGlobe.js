import { useState, useRef, useEffect, useMemo } from "react";
import SignupForm from "./SignupForm";
import Leaderboard from "./Leaderboard";
import GlobeMap from "./GlobeMap";
import RetroEffects from "./RetroEffects";
import Header from "./Header";
import { lookupZip } from "../utils/zipLookup";
import { clamp } from "../utils/helpers";
import { addSubmission, loadSubmissions } from "../services/SubmissionsService";
import { useLiveSubmissions } from "../hooks/useLiveSubmissions";
import Footer from "./Footer";

export default function FanDemandGlobe() {
  const [rotate, setRotate] = useState([-20, -15, 0]);
  const [zoom, setZoom] = useState(1.15);
  const [cursor, setCursor] = useState("grab");
  const [fatal, setFatal] = useState("");
  const [form, setForm] = useState({ name: "", email: "", zip: "" });
  const [message, setMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [retroMode, setRetroMode] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(false);
  const resumeTimer = useRef(null);
  const RESUME_AFTER = 1500;
  const [submissions, setSubmissions] = useLiveSubmissions([]);

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

    setLoading(true);
    try {
      console.log("Submitting form:", { name, email, zip });
      console.log("Submissions: ", submissions);
      const info = await lookupZip(z);
      const submission = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        zip: z,
        city: info.city,
        state: info.state,
        lat: Number(info.lat),
        lon: Number(info.lon),
      };
      const result = await addSubmission(submission);
      console.log("Form submitted successfully:", result);
      if (result.error)
        throw new Error(result.error.message || "Failed to submit form");
      // Optimistic - Realtime will also push it to everyone else
      setSubmissions((prev) =>
        prev.some((s) => s.id === result.submission.id)
          ? prev
          : [result.submission, ...prev]
      );
      setForm({ name: "", email: "", zip: "" });
      setMessage("Pinned! Thanks for raising your hand.");
      setHasSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
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
            setMessage={setMessage}
            loading={loading}
          />

          {/* Leaderboard */}
          <Leaderboard submissions={submissions} theme={theme} />
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

      <Footer />

      {/* Retro overlays and effects */}
      <RetroEffects retroMode={retroMode} hasSubmitted={hasSubmitted} />
    </div>
  );
}
