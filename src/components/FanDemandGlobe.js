/**
 * @fileoverview Main globe component integrating map, submissions, and leaderboard
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { useState, useRef, useEffect, useMemo, lazy, Suspense } from "react";
import { ToastProvider, useToast } from "../context/ToastContext";
import { clamp } from "../utils/helpers";
import { useLiveSubmissions } from "../hooks/useLiveSubmissions";
import { useCityPins } from "../hooks/useCityPins";
import { useSubmitSignup } from "../hooks/useSubmitSignup";
import { useLeaderboard } from "../hooks/useLeaderboard";

const Hero = lazy(() => import("./v9/Hero"));
const SignupsCounter = lazy(() => import("./SignupsCounter"));
const SignupForm = lazy(() => import("./SignupForm"));
const CreditsModal = lazy(() => import("./CreditsModal"));
const Footer = lazy(() => import("./v9/Footer"));
const RetroLoader = lazy(() => import("./RetroLoader"));
const GlobeMap = lazy(() => import("./GlobeMap"));
const RetroEffects = lazy(() => import("./RetroEffects"));
const NewAboutSection = lazy(() => import("./NewAboutSection"));
const BuyTicketsSection = lazy(() => import("./v6/BuyTicketsSection"));
const FAQSection = lazy(() => import("./v9/FAQSection"));
const Leaderboard = lazy(() => import("./Leaderboard"));
const HollywoodSection = lazy(() => import("./v9/HollywoodSection"));
const StepsSection = lazy(() => import("./v9/StepsSection"));
const MakingSection = lazy(() => import("./v9/MakingSection"));

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

  const [zoom, setZoom] = useState(1.15);
  const [cursor, setCursor] = useState("grab");
  const [fatal, setFatal] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", zip: "" });
  // messages are shown via ToastContext
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [retroMode] = useState(false);
  // const [transitioning, setTransitioning] = useState(false); // Removed unused state
  const [loading, setLoading] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const resumeTimer = useRef(null);
  const RESUME_AFTER = 1500;
  const [submissions, setSubmissions] = useLiveSubmissions([]);
  const { pins: dbPins, loading: pinsLoading } = useCityPins();
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

  // Basic ZIP code validation (US and international, 3-10 chars, alphanumeric)
  function isValidZip(zip) {
    return typeof zip === "string" && /^[A-Za-z0-9\- ]{3,10}$/.test(zip.trim());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // Client-side ZIP code validation
    if (!isValidZip(form.zip)) {
      showToast("Please enter a valid postal/ZIP code.", retroMode);
      return;
    }
    setLoading(true);
    try {
      const result = await submit(form);
      // Optimistic - Realtime will also push it to everyone else
      setSubmissions((prev) =>
        prev.some((s) => s.id === result.submission.id)
          ? prev
          : [result.submission, ...prev]
      );
      setForm({ name: "", email: "", phone: "", zip: "" });
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
      // Show user-friendly error messages for common backend errors
      if (err.message) {
        if (err.message.toLowerCase().includes("postal code not found")) {
          showToast(
            "Sorry, we couldn't find that postal/ZIP code. Please check and try again.",
            retroMode
          );
        } else if (
          err.message.toLowerCase().includes("too many submissions") ||
          err.message.toLowerCase().includes("rate limit")
        ) {
          showToast(
            "You've submitted too many times. Please wait before trying again.",
            retroMode
          );
        } else {
          showToast(err.message, retroMode);
        }
      } else {
        setFatal("Submission failed");
      }
    } finally {
      setLoading(false);
    }
  }

  // Handler for credits modal submission
  async function handleCreditsModalSubmit(formData) {
    // Client-side ZIP code validation
    if (!isValidZip(formData.zip)) {
      showToast("Please enter a valid postal/ZIP code.", retroMode);
      return { success: false, error: "Please enter a valid postal/ZIP code." };
    }

    setLoading(true);
    try {
      const result = await submit(formData);
      // Optimistic - Realtime will also push it to everyone else
      setSubmissions((prev) =>
        prev.some((s) => s.id === result.submission.id)
          ? prev
          : [result.submission, ...prev]
      );
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

      return { success: true };
    } catch (err) {
      console.error("Error submitting form:", err);
      // Show user-friendly error messages for common backend errors
      let errorMessage = "Submission failed";
      if (err.message) {
        if (err.message.toLowerCase().includes("postal code not found")) {
          errorMessage =
            "Sorry, we couldn't find that postal/ZIP code. Please check and try again.";
        } else if (
          err.message.toLowerCase().includes("too many submissions") ||
          err.message.toLowerCase().includes("rate limit")
        ) {
          errorMessage =
            "You've submitted too many times. Please wait before trying again.";
        } else {
          errorMessage = err.message;
        }
        showToast(errorMessage, retroMode);
      } else {
        setFatal("Submission failed");
      }
      return { success: false, error: errorMessage };
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
      className="min-h-screen flex flex-col justify-center items-center w-full bg-[#f7f1e1] text-[#1f2937] overflow-x-hidden"
      style={{ fontFamily: theme.fontFamily }}
    >
      <Suspense
        fallback={
          <div className="h-40 w-full flex flex-col items-center justify-center py-8">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-200"></div>
            </div>
            <div
              className={`text-sm font-mono uppercase tracking-wider ${
                retroMode ? "text-yellow-500" : "text-[#1f2937]"
              }`}
            >
              Loading Hero Section...
            </div>
          </div>
        }
      >
        <Hero onOpenCreditsModal={() => setIsCreditsModalOpen(true)} />
      </Suspense>

      {/* Credits Modal */}
      <Suspense fallback={null}>
        <CreditsModal
          isOpen={isCreditsModalOpen}
          onClose={() => setIsCreditsModalOpen(false)}
          onSubmit={handleCreditsModalSubmit}
          loading={loading}
        />
      </Suspense>

      {/* <div className="text-center md:mb-[40px] mt-[56px] md:mt-[90px] w-full">
        <div className="max-w-[1280px] mx-auto px-4 md:px-12 lg:px-16">
          <div className="flex-col items-center justify-center mb-6 md:mb-12">
            <div className="w-full">
              <h2 className="text-pink-600 text-[24px] md:text-2xl font-normal leading-tight tracking-wider uppercase mb-3 md:mb-[2px]">
                <span className="font-bold">WANT TO WATCH THE FILM?</span> DROP A PIN Below TO Bring
                Two Sleepy People To Your City.
              </h2>
              <div className="max-w-6xl mx-auto">
                <span className="text-[11px] md:text-[13px] text-black uppercase font-medium md:font-extralight tracking-wider">
                  Over The next Two Months, We’ll Be Working With Theaters
                  internationally To Screen The Movie In Cities With The Most
                  Votes.
                </span>
              </div>
            </div>
          </div> */}

      {/* Globe and Signup Form - Side by side */}
      {/* <div id="signup" className="w-full py-6"> */}
      {/* Mobile: Counter before form */}
      {/* <div className="block md:hidden mb-6">
              <Suspense fallback={<div>Loading counter…</div>}>
                <SignupsCounter count={submissions.length} />
              </Suspense>
            </div> */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 min-h-0"> */}
      {/* Signup Form - 50% width */}
      {/* <div className="flex fl§ex-col w-full">
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
              </div> */}

      {/* Globe - 50% width */}
      {/* <div className="flex flex-col w-full"> */}
      {/* Globe map and controls or loader */}
      {/* {pinsLoading ? (
                  <div className="h-full flex items-center justify-center min-h-[400px] md:min-h-[600px]">
                    <Suspense fallback={<div>Loading…</div>}>
                      <RetroLoader
                        text="Loading globe & pins..."
                        retroMode={retroMode}
                      />
                    </Suspense>
                  </div>
                ) : dbPins.length === 0 ? (
                  <Suspense
                    fallback={
                      <div className="h-full flex items-center justify-center min-h-[400px] md:min-h-[600px]">
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
                      submissions={dbPins}
                      jitter={jitter}
                      containerRef={containerRef}
                      cursor={cursor}
                      hasSubmitted={hasSubmitted}
                    />
                  </Suspense>
                ) : (
                  <Suspense
                    fallback={
                      <div className="h-full flex items-center justify-center min-h-[400px] md:min-h-[600px]">
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
                      submissions={dbPins}
                      jitter={jitter}
                      containerRef={containerRef}
                      cursor={cursor}
                      hasSubmitted={hasSubmitted}
                    />
                  </Suspense>
                )}
              </div>
            </div> */}

      {/* Desktop: Counter after grid */}
      {/* <div className="hidden md:block mt-6">
              <Suspense fallback={<div>Loading counter…</div>}>
                <SignupsCounter count={submissions.length} />
              </Suspense>
            </div>
          </div> */}

      {/* <Leaderboard
            leaderboard={leaderboard}
            theme={theme}
            loading={lbLoading}
            retroMode={retroMode}
          />
        </div>
      </div> */}

      {/* <Suspense
        fallback={
          <div className="h-40 w-full flex flex-col items-center justify-center py-8">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-200"></div>
            </div>
            <div
              className={`text-sm font-mono uppercase tracking-wider ${
                retroMode ? "text-yellow-500" : "text-[#1f2937]"
              }`}
            >
              Loading Movie Premiere Section...
            </div>
          </div>
        }
      >
        <BuyTicketsSection />
      </Suspense> */}

      {/* New About Section */}
      <Suspense
        fallback={
          <div className="h-40 w-full flex flex-col items-center justify-center py-8">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-200"></div>
            </div>
            <div
              className={`text-sm font-mono uppercase tracking-wider ${
                retroMode ? "text-yellow-500" : "text-[#1f2937]"
              }`}
            >
              Loading Hollywood Section...
            </div>
          </div>
        }
      >
        <HollywoodSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-40 w-full flex flex-col items-center justify-center py-8">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-200"></div>
            </div>
            <div
              className={`text-sm font-mono uppercase tracking-wider ${
                retroMode ? "text-yellow-500" : "text-[#1f2937]"
              }`}
            >
              Loading Steps Section...
            </div>
          </div>
        }
      >
        <StepsSection
          signupCount={submissions.length}
          onOpenCreditsModal={() => setIsCreditsModalOpen(true)}
        />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-40 w-full flex flex-col items-center justify-center py-8">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-200"></div>
            </div>
            <div
              className={`text-sm font-mono uppercase tracking-wider ${
                retroMode ? "text-yellow-500" : "text-[#1f2937]"
              }`}
            >
              Loading Hollywood Section...
            </div>
          </div>
        }
      >
        <MakingSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="h-40 w-full flex flex-col items-center justify-center py-8">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-200"></div>
            </div>
            <div
              className={`text-sm font-mono uppercase tracking-wider ${
                retroMode ? "text-yellow-500" : "text-[#1f2937]"
              }`}
            >
              Loading About Section...
            </div>
          </div>
        }
      >
        <FAQSection />
      </Suspense>

      {/* <Suspense
        fallback={
          <div className="h-40 w-full flex flex-col items-center justify-center py-8">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-[#D42568] rounded-full animate-bounce delay-200"></div>
            </div>
            <div
              className={`text-sm font-mono uppercase tracking-wider ${
                retroMode ? "text-yellow-500" : "text-[#1f2937]"
              }`}
            >
              Loading Movie Premiere Section...
            </div>
          </div>
        }
      >
        <MoviePremiere />
      </Suspense> */}

      {/* <div className="w-full max-w-7xl mx-auto border-b-[5px] border-dashed border-[#D42568]/30" /> */}

      {/* <div className="w-full h-[2px] md:block hidden bg-black/20 max-w-[1280px] mx-auto px-10 md:px-12 lg:px-16 xl:px-0 mt-[72px]" /> */}
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
