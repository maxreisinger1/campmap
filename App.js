import React, { useEffect, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Sphere, Graticule, Marker } from "react-simple-maps";
import { supabase } from './supabase';

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const CITY_GOAL = 100;

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function exportToCSV(rows, filename = "fan_signups.csv") {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replaceAll("\"", "\"\"")}` + `"`;
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const COLORS = { bg: "#f7f1e1", ink: "#1f2937", rose: "#ef476f", gold: "#f5c518" };

const SEED_ZIPS = {
  "10001": { city: "New York", state: "NY", lat: 40.7506, lon: -73.9972 },
  "73301": { city: "Austin", state: "TX", lat: 30.2672, lon: -97.7431 },
  "90001": { city: "Los Angeles", state: "CA", lat: 34.0522, lon: -118.2437 },
  "98101": { city: "Seattle", state: "WA", lat: 47.6101, lon: -122.3344 },
  "60601": { city: "Chicago", state: "IL", lat: 41.8853, lon: -87.6216 },
  "80202": { city: "Denver", state: "CO", lat: 39.7508, lon: -104.9966 },
  "94102": { city: "San Francisco", state: "CA", lat: 37.7793, lon: -122.4193 },
  "30301": { city: "Atlanta", state: "GA", lat: 33.749, lon: -84.388 },
  "48201": { city: "Detroit", state: "MI", lat: 42.346, lon: -83.061 },
  "02108": { city: "Boston", state: "MA", lat: 42.357, lon: -71.065 },
  "78702": { city: "Austin", state: "TX", lat: 30.2672, lon: -97.7431 },
  "10010": { city: "New York", state: "NY", lat: 40.7386, lon: -73.9864 },
  "90210": { city: "Beverly Hills", state: "CA", lat: 34.0736, lon: -118.4004 },
  "33101": { city: "Miami", state: "FL", lat: 25.7743, lon: -80.1937 },
  "75201": { city: "Dallas", state: "TX", lat: 32.7875, lon: -96.8002 }
};

async function lookupZip(z) {
  if (SEED_ZIPS[z]) return SEED_ZIPS[z];
  
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${z}`);
    if (!res.ok) throw new Error("ZIP lookup failed");
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) throw new Error("ZIP not found");
    return {
      city: place["place name"],
      state: place["state abbreviation"],
      lat: Number(place.latitude),
      lon: Number(place.longitude)
    };
  } catch (error) {
    console.error('ZIP lookup error:', error);
    throw new Error("Couldn't resolve that ZIP right now. Try a different one or use 'Load demo pins'.");
  }
}

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
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startRotate: rotate, factor: 0.35 });

  // Load submissions from Supabase on component mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    try {
      console.log('Loading submissions from Supabase...');
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error loading submissions:', error);
        throw error;
      }
      
      console.log('Successfully loaded submissions:', data);
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setFatal(`Failed to load submissions: ${error.message}`);
    }
  }

  useEffect(() => {
    const onErr = (e) => setFatal(String(e?.message || e));
    const onRej = (e) => setFatal(String(e.reason?.message || e.reason || "Promise error"));
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);
    return () => { window.removeEventListener("error", onErr); window.removeEventListener("unhandledrejection", onRej); };
  }, []);

  const leaderboard = useMemo(() => {
    const m = new Map();
    for (const s of submissions) m.set(`${s.city}, ${s.state}`, (m.get(`${s.city}, ${s.state}`) || 0) + 1);
    return Array.from(m.entries()).map(([place, count]) => ({ place, count })).sort((a, b) => b.count - a.count || a.place.localeCompare(b.place));
  }, [submissions]);

  const focus = (lat, lon) => setRotate([-lon, -lat, 0]);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const down = (e) => { setCursor("grabbing"); dragRef.current = { ...dragRef.current, dragging: true, startX: e.clientX, startY: e.clientY, startRotate: rotate }; el.setPointerCapture?.(e.pointerId); };
    const move = (e) => { if (!dragRef.current.dragging) return; const dx = e.clientX - dragRef.current.startX; const dy = e.clientY - dragRef.current.startY; const f = e.shiftKey ? dragRef.current.factor * 1.8 : dragRef.current.factor; const [rx, ry] = dragRef.current.startRotate; setRotate([rx + dx * f, clamp(ry - dy * f, -89, 89), 0]); };
    const up = (e) => { dragRef.current.dragging = false; setCursor("grab"); el.releasePointerCapture?.(e.pointerId); };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => { el.removeEventListener("pointerdown", down); window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
  }, [rotate]);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const onWheel = (e) => { e.preventDefault(); setZoom((z) => clamp(z * (e.deltaY > 0 ? 0.95 : 1.05), 0.9, 2.2)); };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const autoSpeed = retroMode ? 0.12 : 0.06;
  useEffect(() => {
    if (!autoRotate) return;
    const id = setInterval(() => { setRotate(([x, y, z]) => [x + autoSpeed, y, z]); }, 30);
    return () => clearInterval(id);
  }, [autoRotate, autoSpeed]);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const onDown = () => { setAutoRotate(false); if (resumeTimer.current) clearTimeout(resumeTimer.current); };
    const onUp = () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); resumeTimer.current = setTimeout(() => setAutoRotate(true), RESUME_AFTER); };
    const onWheel = () => { setAutoRotate(false); if (resumeTimer.current) clearTimeout(resumeTimer.current); resumeTimer.current = setTimeout(() => setAutoRotate(true), RESUME_AFTER); };
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
    e.preventDefault(); setMessage("");
    const { name, email, zip } = form;
    if (!name.trim()) return setMessage("Please enter your name.");
    if (!EMAIL_RE.test(email)) return setMessage("Please enter a valid email.");
    const z = String(zip || "").trim(); if (z.length < 5) return setMessage("Enter a 5-digit ZIP.");
    try {
      const info = await lookupZip(z);
      const submission = { 
        name: name.trim(), 
        email: email.trim().toLowerCase(), 
        zip: z, 
        city: info.city, 
        state: info.state, 
        lat: Number(info.lat), 
        lon: Number(info.lon) 
      };
      
                      const { data, error } = await supabase
                  .from('submissions')
                  .insert([submission])
                  .select();
      
      if (error) throw error;
      
      setSubmissions((prev) => [data[0], ...prev]); 
      setForm({ name: "", email: "", zip: "" }); 
      setMessage("Pinned! Thanks for raising your hand."); 
      setHasSubmitted(true);
    } catch (err) {
      setMessage("Couldn't resolve that ZIP right now. Try a different one or use 'Load demo pins'.");
    }
  }

  async function resetData() {
    try {
                          const { error } = await supabase
                      .from('submissions')
                      .delete()
                      .neq('id', 0); // Delete all rows
      
      if (error) throw error;
      
      setSubmissions([]);
      setMessage("All data reset successfully");
    } catch (error) {
      console.error('Error resetting data:', error);
      setMessage("Failed to reset data");
    }
  }

  async function seedDemo() {
    try {
      console.log('Starting to seed demo data...');
      const zips = Object.keys(SEED_ZIPS);
      console.log('ZIP codes to seed:', zips);
      
      const sample = zips.map((z) => { 
        const info = SEED_ZIPS[z]; 
        return { 
          name: `Fan ${z}`, 
          email: `fan${z}@example.com`, 
          zip: z, 
          city: info.city, 
          state: info.state, 
          lat: info.lat, 
          lon: info.lon 
        }; 
      });
      
      console.log('Sample data to insert:', sample);
      
      const { data, error } = await supabase
        .from('submissions')
        .insert(sample)
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Successfully inserted data:', data);
      setSubmissions((prev) => [...data, ...prev]); 
      setMessage("Loaded sample pins.");
    } catch (error) {
      console.error('Error seeding demo data:', error);
      setMessage(`Failed to load demo pins: ${error.message}`);
    }
  }

  const jitter = (i) => (i % 2 ? 0.2 : -0.2) * ((i % 5) + 1);

  const theme = useMemo(() => {
    if (!retroMode) return {
      ocean: "#e7f6f2",
      land: "#d2d2d2",
      stroke: "#111",
      barFill: "linear-gradient(90deg,rgba(0,0,0,0.15),transparent 6px),repeating-linear-gradient(90deg,#c8facc,#c8facc 12px,#aaf0b4 12px,#aaf0b4 24px)",
      fontFamily: "inherit"
    };
    return {
      ocean: "#dff5f2",
      land: "#26d0c9",
      stroke: "#0e2a47",
      barFill: "linear-gradient(90deg, rgba(14,42,71,0.15), transparent 6px), repeating-linear-gradient(90deg,#ffd36e,#ffd36e 12px,#ffb84a 12px,#ffb84a 24px)",
      fontFamily: '"Barlow", "Futura", ui-sans-serif, system-ui'
    };
  }, [retroMode]);

  return (
    <div className="min-h-screen w-full" data-retro={retroMode ? "true" : "false"} style={{ background: COLORS.bg, color: COLORS.ink, fontFamily: theme.fontFamily }}>
      {(
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;700;900&family=Press+Start+2P&display=swap');
          [data-retro="true"] .blink { animation: blink 1s steps(2, start) infinite; }
          @keyframes blink { to { visibility: hidden; } }
          [data-retro="true"] .retro-btn { box-shadow: 4px 4px 0 #000; border-width: 3px; }
          .scanlines { pointer-events:none; position:absolute; inset:0; background: repeating-linear-gradient( to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 2px, transparent 2px, transparent 4px ); mix-blend-mode: overlay; opacity: 0.28; }
          .halftone { pointer-events:none; position:absolute; inset:0; background-image: radial-gradient(rgba(0,0,0,0.08) 1px, transparent 1px); background-size: 6px 6px; opacity: 0.35; }
          .grain { pointer-events:none; position:absolute; inset:0; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"3\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23n)\" opacity=\"0.08\"/></svg>'); opacity: .6; mix-blend-mode: overlay; }
          .chrome { background-image: linear-gradient(180deg, #fff, #e9ecef 40%, #cfd4da 60%, #fff); border: 2px solid #0e2a47; box-shadow: 0 4px 0 #0e2a47; }
          .orbit { position:absolute; border:2px solid rgba(14,42,71,.35); border-radius:9999px; animation: spin 24s linear infinite; }
          .orbit .dot { position:absolute; width:8px; height:8px; background:#ff6f3d; border-radius:9999px; top:-4px; left:50%; transform:translateX(-50%); box-shadow:0 0 8px rgba(255,111,61,.6); }
          @keyframes spin { to { transform: rotate(360deg); } }
          .fade-layer { transition: opacity 480ms ease; }
        `}</style>
      )}

      <div className="relative border-b border-black/20">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ letterSpacing: "-0.5px" }}>
            <span className="inline-block -skew-x-6 mr-2 px-2 py-1 border border-black bg-[conic-gradient(at_30%_30%,#fff,rgba(0,0,0,0)_35%)] shadow-[4px_4px_0_0_rgba(0,0,0,0.6)]">CAMP</span>
            <span className="inline-block">— Fan Demand Globe</span>
          </h1>
          <button
            onClick={() => { setTransitioning(true); setRetroMode((v) => !v); setTimeout(() => setTransitioning(false), 500); }}
            className={`text-xs md:text-sm uppercase tracking-wider font-mono opacity-90 retro-btn px-3 py-1 border border-black active:translate-y-[1px] rounded-full ${retroMode ? 'bg-[#00b7c2] text-white hover:bg-[#00a4ad]' : 'bg-white hover:bg-amber-100'}`}
          >
            MVP • Retro Edition
          </button>
        </div>
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 3px)", opacity: 0.25 }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-2xl p-4 md:p-5 border border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.6)]">
            <div className="absolute -top-2 -left-2 h-4 w-4 bg-black" />
            <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-black" />

            <h2 className="text-xl md:text-2xl font-extrabold mb-3">Bring the movie to <span className="underline decoration-amber-500">your city</span></h2>
            <p className="text-sm mb-4 opacity-80">Pop in your details and drop a pin. We'll use this to plan screenings and send you updates.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${retroMode ? 'blink' : ''}`}>Name</label>
                <input className={`w-full rounded-md border ${retroMode ? 'border-black bg-[#fffef4]' : 'border-black/40 bg-[#fffcf5]'} px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`} placeholder="Jane Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${retroMode ? 'blink' : ''}`}>Email</label>
                <input className={`w-full rounded-md border ${retroMode ? 'border-black bg-[#fffef4]' : 'border-black/40 bg-[#fffcf5]'} px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`} placeholder="jane@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase mb-1 ${retroMode ? 'blink' : ''}`}>ZIP (US - MVP)</label>
                <input className={`w-full rounded-md border ${retroMode ? 'border-black bg-[#fffef4]' : 'border-black/40 bg-[#fffcf5]'} px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`} placeholder="73301" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value.replace(/[^0-9]/g, "").slice(0, 5) })} />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button type="submit" className={`rounded-md border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${retroMode ? 'bg-[#00ffd1] hover:bg-[#00e1ba]' : 'bg-lime-300/80 hover:bg-lime-300'}`}>Drop Pin</button>
                <button type="button" onClick={() => { setForm({ name: "", email: "", zip: "" }); setMessage(""); }} className={`rounded-md border-2 border-black px-3 py-2 font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${retroMode ? 'bg-white hover:bg-amber-50' : 'bg-white hover:bg-gray-50'}`}>Clear</button>
                <button type="button" onClick={seedDemo} className="ml-auto text-xs underline">Load demo pins</button>
              </div>
              {message && <div className="text-sm font-mono text-emerald-700">{message}</div>}
              {fatal && <div className="mt-2 text-xs font-mono text-rose-700">Error: {fatal}</div>}
            </form>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-black bg-[#faf5e6] p-2">
                <div className="text-xs uppercase tracking-widest opacity-70">Signups</div>
                <div className="text-xl font-extrabold">{submissions.length}</div>
              </div>
              <div className="rounded-md border border-black bg-[#faf5e6] p-2">
                <div className="text-xs uppercase tracking-widest opacity-70">Cities</div>
                <div className="text-xl font-extrabold">{leaderboard.length}</div>
              </div>
              <div className="rounded-md border border-black bg-[#faf5e6] p-2">
                <div className="text-xs uppercase tracking-widest opacity-70">Latest</div>
                <div className="text-xs font-bold truncate">{submissions[0] ? `${submissions[0].city}` : "—"}</div>
              </div>
            </div>

            <div className="mt-3 flex gap-2 items-center">
              <button onClick={() => exportToCSV(submissions)} className="text-xs underline">Export CSV</button>
              <button onClick={resetData} className="text-xs underline text-rose-700">Reset data</button>
              <span className="ml-auto text-[11px] font-mono opacity-70">Goal per city: <b>{CITY_GOAL}</b> for a <span className="px-1 py-0.5 rounded bg-yellow-200 border border-black">Premiere</span></span>
            </div>
          </div>

          <div className="relative rounded-2xl p-4 md:p-5 border border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.6)]">
            <h3 className="text-lg md:text-xl font-extrabold mb-1">City Leaderboard</h3>
            <p className="text-xs mb-3 opacity-70">First city to <b>{CITY_GOAL}</b> signups unlocks a <span className="font-bold">Premiere Night</span>. Bars fill as fans join.</p>
            {leaderboard.length === 0 ? (
              <div className="text-sm opacity-70">No cities yet. Be the first to drop a pin.</div>
            ) : (
              <div className="max-h-[360px] overflow-auto pr-1 space-y-2">
                {leaderboard.map((row, i) => {
                  const sub = submissions.find((s) => `${s.city}, ${s.state}` === row.place);
                  const onClick = () => sub && focus(sub.lat, sub.lon);
                  const pct = Math.min(1, row.count / CITY_GOAL);
                  const remaining = Math.max(0, CITY_GOAL - row.count);
                  const unlocked = pct >= 1;
                  return (
                    <div key={row.place} className="border border-black/20 rounded-lg p-2 hover:bg-[#fff7df] cursor-pointer" onClick={onClick}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 text-right font-black">{i + 1}</div>
                        <div className="flex-1 font-bold">{row.place}</div>
                        <div className="text-xs font-mono w-20 text-right">{row.count}/{CITY_GOAL}</div>
                        {unlocked ? (
                          <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border-2 border-black bg-[conic-gradient(at_50%_50%,#fff_0_25%,#ffe08a_25%_50%,#fff_50%_75%,#ffe08a_75%_100%)] shadow-[2px_2px_0_0_rgba(0,0,0,0.6)]">⭐ Premiere</span>
                        ) : (
                          <span className="ml-2 text-xs font-mono opacity-70">{remaining} to go</span>
                        )}
                      </div>
                      <div className="mt-2 h-4 w-full rounded-full border-2 border-black bg-[repeating-linear-gradient(45deg,#fff,#fff_6px,#f3efe4_6px,#f3efe4_12px)] overflow-hidden relative">
                        <div className="absolute inset-0 pointer-events-none" style={{
                          backgroundImage: `radial-gradient(circle at 6px 7px, ${COLORS.gold} 2px, transparent 2.5px), radial-gradient(circle at calc(100% - 6px) 7px, ${COLORS.gold} 2px, transparent 2.5px)`,
                          backgroundSize: '12px 14px, 12px 14px',
                          backgroundRepeat: 'repeat-y'
                        }} />
                        <div className="h-full border-r-2 border-black transition-[width] duration-700 ease-out" style={{ width: `${pct * 100}%`, background: theme.barFill }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="relative rounded-2xl border border-black bg-gradient-to-br from-[#fff9e8] via-[#f8efe0] to-[#efe3cf] shadow-[12px_12px_0_0_rgba(0,0,0,0.65)] overflow-hidden">
            <div className="absolute z-10 top-3 left-3 flex items-center gap-2 bg-white/85 backdrop-blur rounded-md border border-black p-2">
              <button title="Rotate Left" onClick={() => setRotate(([x, y, z]) => [x - 15, y, z])} className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${retroMode ? 'bg-[#00ffd1] hover:bg-[#00e1ba]' : 'bg-[#d2f8d2] hover:bg-[#c2f5c2]'}`}>◀</button>
              <button title="Rotate Right" onClick={() => setRotate(([x, y, z]) => [x + 15, y, z])} className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${retroMode ? 'bg-[#00ffd1] hover:bg-[#00e1ba]' : 'bg-[#d2f8d2] hover:bg-[#c2f5c2]'}`}>▶</button>
              <button title="Rotate Up" onClick={() => setRotate(([x, y, z]) => [x, y - 10, z])} className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${retroMode ? 'bg-[#00ffd1] hover:bg-[#00e1ba]' : 'bg-[#d2f8d2] hover:bg-[#c2f5c2]'}`}>▲</button>
              <button title="Rotate Down" onClick={() => setRotate(([x, y, z]) => [x, y + 10, z])} className={`px-2 py-1 text-xs font-bold border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.6)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${retroMode ? 'bg-[#00ffd1] hover:bg-[#00e1ba]' : 'bg-[#d2f8d2] hover:bg-[#c2f5c2]'}`}>▼</button>
              <div className="h-6 w-px bg-black/20 mx-1" />
              <label className="text-xs font-bold">Zoom</label>
              <input type="range" min={0.9} max={2.2} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
            </div>

            <div className="fade-layer absolute inset-0 pointer-events-none" style={{opacity: retroMode ? 1 : 0}}>
              <div className="scanlines" />
              <div className="halftone" />
              <div className="grain" />
              <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                <div className="orbit" style={{width:'70%',height:'70%'}}><div className="dot"/></div>
                <div className="orbit" style={{width:'85%',height:'85%', animationDuration:'32s'}}><div className="dot"/></div>
                <div className="orbit" style={{width:'100%',height:'100%', animationDuration:'40s'}}><div className="dot"/></div>
              </div>
            </div>

            <div
              className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-500"
              style={{
                opacity: hasSubmitted ? 0 : 1,
                pointerEvents: hasSubmitted ? "none" : "auto",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                backgroundImage: `radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.7) 70%), url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"><filter id=\"g\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"1.2\" numOctaves=\"4\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23g)\" opacity=\"0.12\"/></svg>')`,
                backgroundSize: "cover",
                backgroundBlendMode: "overlay"
              }}
            />

            <div ref={containerRef} className="w-full h-[520px] md:h-[600px] select-none" style={{ cursor }}>
              <ComposableMap projection="geoOrthographic" projectionConfig={{ scale: 220 * zoom, rotate }}>
                <Sphere stroke={theme.stroke} strokeWidth={0.75} fill={theme.ocean} />
                <Graticule stroke={theme.stroke} strokeOpacity={retroMode ? 0.2 : 0.08} />
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography key={geo.rsmKey} geography={geo} fill={theme.land} stroke={theme.stroke} strokeWidth={0.3} style={{ default: { outline: "none" }, hover: { fill: retroMode ? "#00e1ba" : "#c7c7c7" }, pressed: { fill: retroMode ? "#00c7a3" : "#bbb" } }} />
                    ))
                  }
                </Geographies>
                {submissions.map((s, i) => (
                  <Marker key={s.id} coordinates={[s.lon + jitter(i) * 0.1, s.lat + jitter(i) * 0.1]}>
                    <g transform="translate(-6,-6)">
                      <circle r={5.5} fill={retroMode ? "#ff00a6" : COLORS.rose} stroke={theme.stroke} strokeWidth={1.25} />
                      <circle r={2} fill="#fff" stroke={theme.stroke} strokeWidth={1} />
                    </g>
                    <text textAnchor="start" y={-10} x={8} style={{ fontFamily: retroMode ? theme.fontFamily : 'ui-monospace, Menlo, monospace', fontSize: retroMode ? 9 : 10, fontWeight: 800 }}>{s.city}</text>
                  </Marker>
                ))}
              </ComposableMap>
            </div>
          </div>

          <div className="mt-3 text-xs opacity-70 font-mono">
            Drag to spin, wheel to zoom. Hold <b>Shift</b> for faster spin.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8 mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="text-xs font-mono opacity-70">© {new Date().getFullYear()} Camp Studios — All vibes reserved.</div>
        <div className="text-xs font-mono">Roadmap: <span className="underline">Global postcode geocoding</span> • <span className="underline">Auth + DB (Supabase)</span> • <span className="underline">Spam protection</span> • <span className="underline">Public city pages</span></div>
      </div>
    </div>
  );
}
