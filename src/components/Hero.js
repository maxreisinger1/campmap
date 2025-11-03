import { useCallback } from "react";

export default function Hero() {
  const handleWhereToWatchClick = useCallback((e) => {
    e.preventDefault();
    const el = document.getElementById("where-to-watch");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <section className="relative w-full h-screen min-h-[600px] md:h-[800px] overflow-hidden pt-20">
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
      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-10 md:px-4">
        {/* Desktop: Logo and production text above film title */}
        {/* <div className="hidden md:flex flex-row items-center mb-[30px] gap-6">
          <img src="/images/logo.png" alt="Camp Studios" className="h-6 mb-1" />
          <span className="text-xs uppercase text-white tracking-widest">
            A Camp Studios Production
          </span>
        </div> */}
        {/* Film Title */}
        <img
          src="/images/Two Sleepy Favicon-New.png"
          alt="Two Sleepy People"
          className="max-w-[250px] md:max-w-[300px] h-auto w-full"
          style={{ transform: "rotate(-3deg)" }}
        />
        {/* Mobile: Only show shorter heading */}
        <h1 className="my-8 text-white text-xl font-normal uppercase md:hidden">
          <span className="font-semibold">American Baron’s Debut Film</span>
          <br />
          In Select Theaters Nationwide Theaters{" "}
        </h1>
        {/* Desktop: Only show full heading */}
        <h1 className="mb-6 mt-8 text-white text-[30px] tracking-wider font-normal uppercase hidden md:block">
          <span className="font-semibold">American Baron’s Debut Film</span>
          <br />
          In Select Theaters Nationwide Theaters{" "}
        </h1>
        {/* <h1
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
        </p> */}
        <div
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full px-4 md:px-0"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <a
            href="https://luma.com/user/campstudios?fbclid=PAZXh0bgNhZW0CMTEAAacMmCGn-1gD5YctVP26FvGSnkgV-ymsx9XecPu4t-0foFiol0dYvIQUA2UYdQ_aem_o2Fgqc02z1QGsFiT083Lgg"
            className="w-full sm:w-auto"
          >
            <button
              className="w-full sm:w-auto py-3 px-8 md:py-[8px] md:px-[36px] text-xs uppercase md:text-base font-semibold bg-white hover:bg-[#F2A268] rounded-full border-2 border-black transition-colors duration-200"
              onClick={handleWhereToWatchClick}
            >
              Where Can I Watch?
            </button>
          </a>
          <a href="#faq" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto py-3 px-8 md:py-[8px] md:px-[36px] text-xs uppercase md:text-base font-semibold bg-white hover:bg-[#F2A268] transition-colors duration-200 rounded-full border-2 border-black">
              Frequently Asked Q's
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
