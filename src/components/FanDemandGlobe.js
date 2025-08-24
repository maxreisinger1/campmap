import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { ToastProvider, useToast } from "../context/ToastContext";
import { clamp } from "../utils/helpers";
import { loadSubmissions } from "../services/SubmissionsService";
import { useLiveSubmissions } from "../hooks/useLiveSubmissions";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useSubmitSignup } from "../hooks/useSubmitSignup";

const SignupForm = lazy(() => import("./SignupForm"));
const Leaderboard = lazy(() => import("./Leaderboard"));
const Footer = lazy(() => import("./Footer"));
const Header = lazy(() => import("./Header"));
const RetroLoader = lazy(() => import("./RetroLoader"));
const GlobeMap = lazy(() => import("./GlobeMap"));
const RetroEffects = lazy(() => import("./RetroEffects"));

function FanDemandGlobeInner() {
  const [rotate, setRotate] = useState([-20, -15, 0]);
  // eslint-disable-next-line no-unused-vars
  const [transitioning, setTransitioning] = useState(false);
  const rotateAnimRef = useRef();
  // Animate globe to focus on a given lat/lon
  function animateToLocation({ lat, lon }) {
    // Orthographic: rotate = [longitude, -latitude, 0]
    const target = [-(lon || 0), -(lat || 0), 0];
    const duration = 900; // ms
    const frameRate = 1000 / 60;
    const steps = Math.round(duration / frameRate);
    const [startX, startY, startZ] = rotate;
    const [endX, endY, endZ] = target;
    let step = 0;
    if (rotateAnimRef.current) cancelAnimationFrame(rotateAnimRef.current);
    function animate() {
      step++;
      const t = Math.min(1, step / steps);
      // Ease in-out
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setRotate([
        startX + (endX - startX) * ease,
        startY + (endY - startY) * ease,
        startZ + (endZ - startZ) * ease,
      ]);
      if (t < 1) {
        rotateAnimRef.current = requestAnimationFrame(animate);
      }
    }
    animate();
  }
  const [zoom, setZoom] = useState(1.15);
  const [cursor, setCursor] = useState("grab");
  const [fatal, setFatal] = useState("");
  const [form, setForm] = useState({ name: "", email: "", zip: "" });
  // messages are shown via ToastContext
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [retroMode, setRetroMode] = useState(false);
  // const [transitioning, setTransitioning] = useState(false); // Removed unused state
  const [loading, setLoading] = useState(false);
  const resumeTimer = useRef(null);
  const RESUME_AFTER = 1500;
  const [submissions, setSubmissions] = useLiveSubmissions([]);
  const { leaderboard, loading: lbLoading } = useLeaderboard();

  const containerRef = useRef(null);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startRotate: rotate,
    factor: 0.35,
  });
  const { showToast } = useToast();
  const { submit, message: submitMessage } = useSubmitSignup();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // setSubmissions is stable from hook, safe to omit

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
    setLoading(true);
    try {
      const result = await submit(form);
      // Optimistic - Realtime will also push it to everyone else
      setSubmissions((prev) =>
        prev.some((s) => s.id === result.submission.id)
          ? prev
          : [result.submission, ...prev]
      );
      setForm({ name: "", email: "", zip: "" });
      setHasSubmitted(true);
      showToast(
        submitMessage || "Pinned! Thanks for raising your hand.",
        retroMode
      );
    } catch (err) {
      console.error("Error submitting form:", err);
      if (err.message) {
        showToast(err.message, retroMode);
      } else {
        setFatal("Submission failed");
      }
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

  // Deduplicate submissions by city (first occurrence only)
  const dedupedSubmissions = useMemo(() => {
    const seen = new Set();
    return submissions.filter((s) => {
      if (!s.city) return false;
      const key = s.city.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [submissions]);

  return (
    <div
      data-retro={retroMode ? "true" : "false"}
      className="min-h-screen w-full bg-[#f7f1e1] text-[#1f2937]"
      style={{ fontFamily: theme.fontFamily }}
    >
      {/* Header and retro toggle */}
      <Suspense fallback={null}>
        <Header
          retroMode={retroMode}
          setRetroMode={setRetroMode}
          setTransitioning={setTransitioning}
        />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Signup form */}
          <Suspense fallback={<div>Loading form…</div>}>
            <SignupForm
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              fatal={fatal}
              retroMode={retroMode}
              loading={loading}
            />
          </Suspense>

          {/* Leaderboard */}
          <Suspense fallback={<div>Loading leaderboard…</div>}>
            <Leaderboard
              leaderboard={leaderboard}
              theme={theme}
              loading={lbLoading}
              retroMode={retroMode}
              onCityFocus={animateToLocation}
            />
          </Suspense>
        </div>

        <div className="lg:col-span-3">
          {/* Globe map and controls or loader */}
          {loading ? (
            <div className="h-[600px] flex items-center justify-center">
              <Suspense fallback={<div>Loading…</div>}>
                <RetroLoader
                  text="Loading globe & pins..."
                  retroMode={retroMode}
                />
              </Suspense>
            </div>
          ) : dedupedSubmissions.length === 0 ? (
            <>
              <Suspense
                fallback={
                  <div className="h-[600px] flex items-center justify-center">
                    <Suspense fallback={<div>Loading…</div>}>
                      <RetroLoader
                        text="Loading globe…"
                        retroMode={retroMode}
                      />
                    </Suspense>
                  </div>
                }
              >
                <GlobeMap
                  rotate={rotate}
                  setRotate={setRotate}
                  zoom={zoom}
                  setZoom={setZoom}
                  retroMode={retroMode}
                  theme={theme}
                  submissions={[]}
                  jitter={jitter}
                  containerRef={containerRef}
                  cursor={cursor}
                  hasSubmitted={hasSubmitted}
                />
              </Suspense>
              <div className="mt-3 text-xs opacity-70 font-mono">
                Drag to spin, wheel to zoom. Hold <b>Shift</b> for faster spin.
              </div>
            </>
          ) : (
            <>
              <Suspense
                fallback={
                  <div className="h-[600px] flex items-center justify-center">
                    <Suspense fallback={<div>Loading…</div>}>
                      <RetroLoader
                        text="Loading globe…"
                        retroMode={retroMode}
                      />
                    </Suspense>
                  </div>
                }
              >
                <GlobeMap
                  rotate={rotate}
                  setRotate={setRotate}
                  zoom={zoom}
                  setZoom={setZoom}
                  retroMode={retroMode}
                  theme={theme}
                  submissions={dedupedSubmissions}
                  jitter={jitter}
                  containerRef={containerRef}
                  cursor={cursor}
                  hasSubmitted={hasSubmitted}
                />
              </Suspense>
              <div className="mt-3 text-xs opacity-70 font-mono">
                Drag to spin, wheel to zoom. Hold <b>Shift</b> for faster spin.
              </div>
            </>
          )}
        </div>
      </div>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {/* Retro overlays and effects (lazy loaded) */}
      <Suspense fallback={null}>
        <RetroEffects retroMode={retroMode} hasSubmitted={hasSubmitted} />
      </Suspense>
    </div>
  );
}

export default function FanDemandGlobe() {
  return (
    <ToastProvider>
      <FanDemandGlobeInner />
    </ToastProvider>
  );
}
