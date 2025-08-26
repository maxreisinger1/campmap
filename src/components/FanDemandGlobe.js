/**
 * @fileoverview Main globe component integrating map, submissions, and leaderboard
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { ToastProvider, useToast } from "../context/ToastContext";
import { clamp } from "../utils/helpers";
import { loadSubmissions } from "../services/SubmissionsService";
import { useLiveSubmissions } from "../hooks/useLiveSubmissions";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { useSubmitSignup } from "../hooks/useSubmitSignup";
import Hero from "./Hero";
import AboutSection from "./AboutSection";
import SignupsCounter from "./SignupsCounter";

const SignupForm = lazy(() => import("./SignupForm"));
const Leaderboard = lazy(() => import("./Leaderboard"));
const Footer = lazy(() => import("./Footer"));
const RetroLoader = lazy(() => import("./RetroLoader"));
const GlobeMap = lazy(() => import("./GlobeMap"));
const RetroEffects = lazy(() => import("./RetroEffects"));

/**
 * Inner component containing the main globe functionality.
 *
 * Manages globe rotation, submission handling, leaderboard display, and user interactions.
 * Includes globe animation, form submission, real-time updates, and visual mode switching.
 *
 * @component
 * @returns {JSX.Element} Complete globe interface with all features
 */
function FanDemandGlobeInner() {
  const [rotate, setRotate] = useState([-20, -15, 0]);
  // eslint-disable-next-line no-unused-vars
  const [transitioning, setTransitioning] = useState(false);
  const rotateAnimRef = useRef();

  /**
   * Animates the globe to focus on a specific geographic location.
   *
   * Smoothly rotates the globe to center the given latitude and longitude
   * coordinates using eased animation over 900ms. Cancels any ongoing
   * animation before starting a new one.
   *
   * @function animateToLocation
   * @param {Object} location - Target location coordinates
   * @param {number} location.lat - Latitude coordinate
   * @param {number} location.lon - Longitude coordinate
   */
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

  /**
   * Enhanced city focus function that finds coordinates from submissions data.
   * Used when clicking on cities in the leaderboard for better user experience.
   *
   * @function focusOnCity
   * @param {Object} cityData - Target city data from leaderboard
   * @param {string} cityData.city - City name
   * @param {string} cityData.state - State/region name
   * @param {number} [cityData.lat] - Latitude coordinate (if available)
   * @param {number} [cityData.lon] - Longitude coordinate (if available)
   */
  function focusOnCity(cityData) {
    // If we already have coordinates, use them directly
    if (cityData.lat && cityData.lon) {
      setAutoRotate(false);
      setZoom(7.5); // Maximum zoom for close city view
      animateToLocation({ lat: cityData.lat, lon: cityData.lon });

      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setAutoRotate(true), 4000);
      return;
    }

    // Otherwise, find coordinates from submissions data
    const cityName = cityData.city?.toLowerCase();
    const stateName = cityData.state?.toLowerCase();

    const matchingSubmission = dedupedSubmissions.find((submission) => {
      const submissionCity = submission.city?.toLowerCase();
      const submissionState = submission.state?.toLowerCase();

      // Try exact city match first
      if (submissionCity === cityName) {
        // If state is provided, match state too
        if (stateName && submissionState) {
          return submissionState === stateName;
        }
        return true;
      }
      return false;
    });

    if (
      matchingSubmission &&
      matchingSubmission.lat &&
      matchingSubmission.lon
    ) {
      setAutoRotate(false);
      setZoom(7.5); // Maximum zoom for close city view
      animateToLocation({
        lat: matchingSubmission.lat,
        lon: matchingSubmission.lon,
      });

      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setAutoRotate(true), 4000);
    } else {
      // No matching submission found with coordinates
      showToast(
        `❌ No coordinates found for ${cityData.city}${
          cityData.state ? `, ${cityData.state}` : ""
        }`,
        retroMode
      );
    }
  }
  const [zoom, setZoom] = useState(1.15);
  const [cursor, setCursor] = useState("grab");
  const [fatal, setFatal] = useState("");
  const [form, setForm] = useState({ name: "", email: "", zip: "" });
  // messages are shown via ToastContext
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [retroMode] = useState(false);
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
      setZoom((z) => clamp(z * (e.deltaY > 0 ? 0.95 : 1.05), 0.9, 7.5));
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

      // Show a toast notification for the submission
      showToast(
        submitMessage ||
          "🎬 Pin dropped! Your city is now on the map. Zooming in...",
        retroMode
      );

      // Animate to the submitted location for a more tangible experience
      if (result.submission.lat && result.submission.lon) {
        // First zoom in closer for better city view
        setZoom(2.8);
        // Then animate to the location
        setTimeout(() => {
          animateToLocation({
            lat: result.submission.lat,
            lon: result.submission.lon,
          });
        }, 300);
      }
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
      className="min-h-screen flex flex-col justify-center items-center w-full bg-[#f7f1e1] text-[#1f2937] overflow-x-hidden"
      style={{ fontFamily: theme.fontFamily }}
    >
      <Hero />

      <div className="text-center my-6 md:mt-[90px] max-w-[1280px] mx-auto px-10 md:px-12 lg:px-16 xl:px-0">
        <div className="mb-[28px] text-center">
          <span className="inline-block bg-pink-600 border border-black border-w-[0.66px] max-h-[40px] max-w-[200px] text-white text-[14px] font-normal uppercase px-[15px] py-2 rounded">
            The Two Sleepy Tour
          </span>
        </div>

        <div>
          <h2 className="text-pink-600 text-2xl md:text-5xl font-bold tracking-wider mb-[15px]">
            WANT TO WATCH THE FILM?
          </h2>
          <span className="text-xs md:text-base text-black font-extralight tracking-widest">
            VOTE BELOW, TO SEE IT IN A THEATER NEAR YOU{" "}
            <span className="font-bold">THIS FALL.</span>
          </span>
        </div>
      </div>

      {/* Signup form - Full width */}
      <div className="max-w-[1280px] mx-auto px-10 md:px-12 lg:px-16 xl:px-0 py-6">
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
      </div>

      <SignupsCounter count={submissions.length} />

      {/* Leaderboard and Globe - Side by side with equal height */}
      <div className="max-w-[1280px] mx-auto px-10 md:px-12 lg:px-16 xl:px-0 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[600px]">
          {/* Globe - 60% width (3/5) - First on mobile, second on desktop */}
          <div className="lg:col-span-3 flex flex-col order-1 lg:order-2">
            {/* Globe map and controls or loader */}
            {loading ? (
              <div className="h-full flex items-center justify-center min-h-[600px]">
                <Suspense fallback={<div>Loading…</div>}>
                  <RetroLoader
                    text="Loading globe & pins..."
                    retroMode={retroMode}
                  />
                </Suspense>
              </div>
            ) : dedupedSubmissions.length === 0 ? (
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center min-h-[600px]">
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
            ) : (
              <Suspense
                fallback={
                  <div className="h-full flex items-center justify-center min-h-[600px]">
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
            )}
          </div>

          {/* Leaderboard - 40% width (2/5) - Second on mobile, first on desktop */}
          <div className="lg:col-span-2 flex flex-col order-2 lg:order-1">
            <Suspense fallback={<div>Loading leaderboard…</div>}>
              <Leaderboard
                leaderboard={leaderboard}
                theme={theme}
                loading={lbLoading}
                retroMode={retroMode}
                onCityFocus={focusOnCity}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="w-full h-[2px] bg-black/20 max-w-[1280px] mx-auto px-10 md:px-12 lg:px-16 xl:px-0 my-10" />

      <AboutSection />

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

/**
 * Main FanDemandGlobe component with toast context provider.
 *
 * Wraps the inner globe component with ToastProvider to enable notification
 * functionality throughout the globe interface. This is the component that
 * should be imported and used in other parts of the application.
 *
 * @component
 * @returns {JSX.Element} Globe component with toast context
 *
 * @example
 * ```javascript
 * import FanDemandGlobe from './components/FanDemandGlobe';
 *
 * function App() {
 *   return <FanDemandGlobe />;
 * }
 * ```
 */
export default function FanDemandGlobe() {
  return (
    <ToastProvider>
      <FanDemandGlobeInner />
    </ToastProvider>
  );
}
