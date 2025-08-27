export default function Hero() {
  return (
    <section className="relative w-full h-[389px] md:h-[800px] overflow-hidden">
      {/* Background Image */}
      <video
        src="/images/twosleepymontage2.mp4"
        alt="Two Sleepy People"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        preload="auto"
      />

      {/* Overlay (optional dark fade for readability) */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Mobile Top Bar - Centered */}
      <div className="flex md:hidden justify-center items-center pt-[25px] px-4 absolute inset-x-0 top-0 w-full">
        <div className="flex flex-row items-center space-x-2">
          {/* Studio Logo */}
          <img src="/images/logo.png" alt="Camp Studios" className="h-[12px]" />
          <span className="text-[7px] uppercase text-white">
            A Camp Studios Production
          </span>
        </div>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-10 md:px-4">
        {/* Desktop: Logo and production text above film title */}
        <div className="hidden md:flex flex-row items-center mb-[30px] gap-6">
          <img src="/images/logo.png" alt="Camp Studios" className="h-6 mb-1" />
          <span className="text-xs uppercase text-white tracking-widest">A Camp Studios Production</span>
        </div>
        {/* Film Title */}
        <h1
          className="bg-[#D42568] textured-text border border-black border-w-[2px] max-h-[120px] text-white text-[24px] md:text-[72px] font-normal uppercase px-[13px] md:px-[76px] py-[10px] md:py-5 rounded"
          style={{
            fontFamily: "'Grange Heavy', sans-serif",
            fontWeight: 700,
            lineHeight: "106%",
            letterSpacing: "-1%",
          }}
        >
          Two Sleepy People
        </h1>
        <p
          className="mt-[10px] md:mt-[22px] text-[18px] md:text-[41px] inline-block text-white tracking-wide md:tracking-widest"
          style={{
            fontWeight: 500,
            lineHeight: "106%",
          }}
        >
          THE ROAD TO
          <img
            src="/images/counter.png"
            alt="Two Sleepy People"
            className="inline-block h-12 md:h-20"
          />
          THEATERS
        </p>
        {/* Badge always visible below the subtitle, now a button */}
        <div className="mt-2 flex justify-center w-full">
          <button
            className="bg-white rounded-full px-10 py-1 text-[9.5px] md:text-xs font-semibold tracking-wide uppercase transition-colors duration-200 hover:bg-[#F2A268] focus:bg-[#F2A268] outline-none border-none cursor-pointer"
            style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)' }}
            onClick={() => {
              const el = document.getElementById('signup-form');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            type="button"
          >
            Vote To Watch In A City Near You
          </button>
        </div>
      </div>
    </section>
  );
}
