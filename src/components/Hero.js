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
    <section className="relative w-full h-[420px] md:h-[800px] overflow-hidden">
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
          className="max-w-[300px] h-[100px] md:h-auto"
          style={{ transform: "rotate(-3deg)" }}
        />
        {/* Mobile: Only show shorter heading */}
        <h1 className="my-4 text-white text-[16px] font-normal uppercase md:hidden">
          In Theaters On November 14th
        </h1>
        {/* Desktop: Only show full heading */}
        <h1 className="mb-6 mt-8 text-white text-[30px] tracking-wider font-normal uppercase hidden md:block">
          <span className="font-semibold">Baron Ryan’s</span> Debut Film In
          Theaters <span className="font-semibold">On November 14th</span>
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
          className="flex flex-col md:flex-row gap-4 justify-center w-full"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <a href="https://luma.com/user/campstudios?fbclid=PAZXh0bgNhZW0CMTEAAacMmCGn-1gD5YctVP26FvGSnkgV-ymsx9XecPu4t-0foFiol0dYvIQUA2UYdQ_aem_o2Fgqc02z1QGsFiT083Lgg">
            <button
              className="py-[10px] px-[28px] md:py-[12px] md:px-[36px] text-[12px] md:text-[16px] font-semibold bg-white hover:bg-[#F2A268] transition-colors duration-200 rounded-[10px] border-2 border-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Buy Premiere Tickets
            </button>
          </a>
          <a href="#where-to-watch">
            <button
              className="py-[10px] px-[28px] md:py-[12px] md:px-[36px] text-[12px] md:text-[16px] font-semibold bg-white hover:bg-[#F2A268] rounded-[10px] border-2 border-black"
              style={{ fontFamily: "'Inter', sans-serif" }}
              onClick={handleWhereToWatchClick}
            >
              Where Can I Watch?
            </button>
          </a>
        </div>
      </div>

      <div className="hidden absolute bottom-0 md:flex items-end w-full p-4 md:p-8 z-50">
        <div className="flex flex-row w-full items-center max-w-7xl mx-auto">
          <div className="flex flex-1 items-center justify-around gap-6">
            {/* Left logos */}
            <a href="https://www.notion.so/">
              <img
                src="/images/partners/notion_logo.svg"
                alt="Partner 1"
                className="max-h-8 h-auto w-auto"
              />
            </a>
            <a href="https://www.epidemicsound.com/campaign/ambassador-sign-up/?_us=Affiliate&_usx=cc2spNOV25&utm_source=ambassador&utm_medium=affiliate&utm_campaign=cc2spNOV25&utm_content=cam_NOV_25">
              <img
                src="/images/partners/epidemic_sound_logo.svg"
                alt="Partner 2"
                className="max-h-6 h-auto w-auto"
              />
            </a>
          </div>
          <div className="flex flex-col justify-center items-center px-8">
            <span className="text-white text-xs md:text-base font-medium uppercase text-center">
              THE PARTNERS HELPING BRING OUR TOUR TO LIFE
            </span>
          </div>
          <div className="flex flex-1 items-center justify-around gap-6">
            {/* Right logos */}
            <a href="https://shopusa.fujifilm-x.com/?srsltid=AfmBOoqoFWwV">
              <img
                src="/images/partners/fujifilm_logo.svg"
                alt="Partner 3"
                className="max-h-6 h-auto w-auto"
              />
            </a>
            <a href="https://www.rivian.com/">
              <img
                src="/images/partners/rivian_logo.svg"
                alt="Partner 4"
                className="max-h-6 h-auto w-auto"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="md:hidden absolute bottom-0 flex items-end w-full p-4 z-50">
        <div className="flex flex-row w-full items-center max-w-7xl mx-auto justify-around">
          <a href="https://www.notion.so/">
            <img
              src="/images/partners/notion_logo.svg"
              alt="Partner 1"
              className="max-h-3 h-auto w-auto"
            />
          </a>
          <a href="https://www.epidemicsound.com/campaign/ambassador-sign-up/?_us=Affiliate&_usx=cc2spNOV25&utm_source=ambassador&utm_medium=affiliate&utm_campaign=cc2spNOV25&utm_content=cam_NOV_25">
            <img
              src="/images/partners/epidemic_sound_logo.svg"
              alt="Partner 2"
              className="max-h-3 h-auto w-auto"
            />
          </a>
          <a href="https://shopusa.fujifilm-x.com/?srsltid=AfmBOoqoFWwV">
            <img
              src="/images/partners/fujifilm_logo.svg"
              alt="Partner 3"
              className="max-h-3 h-auto w-auto"
            />
          </a>
          <a href="https://www.rivian.com/">
            <img
              src="/images/partners/rivian_logo.svg"
              alt="Partner 4"
              className="max-h-3 h-auto w-auto"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
