export default function Header({ retroMode, setRetroMode, setTransitioning }) {
  return (
    <div className="relative border-b border-black/20" role="banner">
      <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-between">
        <h1
          className="text-2xl md:text-3xl font-black tracking-tight"
          style={{ letterSpacing: "-0.5px" }}
        >
          <span className="inline-block -skew-x-6 mr-2 px-2 py-1 border border-black bg-[conic-gradient(at_30%_30%,#fff,rgba(0,0,0,0)_35%)] shadow-[4px_4px_0_0_rgba(0,0,0,0.6)]">
            CAMP
          </span>
          <span className="inline-block">— Fan Demand Globe</span>
        </h1>
        <button
          onClick={() => {
            setTransitioning(true);
            setRetroMode((retroMode) => !retroMode);
            setTimeout(() => setTransitioning(false), 500);
          }}
          className={`text-xs md:text-sm uppercase tracking-wider font-mono opacity-90 retro-btn px-3 py-1 border border-black active:translate-y-[1px] rounded-full ${
            retroMode
              ? "bg-[#00b7c2] text-white hover:bg-[#00a4ad]"
              : "bg-white hover:bg-amber-100"
          }`}
        >
          MVP • Retro Edition
        </button>
      </div>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 3px)",
          opacity: 0.25,
        }}
      />
    </div>
  );
}
