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
      />

      {/* Overlay (optional dark fade for readability) */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Top Bar */}
      <div className="justify-between items-start p-4 md:px-[144px] md:pt-12 absolute inset-x-0 top-0 w-full hidden md:flex flex-row">
        <div className="flex flex-row items-center space-x-2">
          {/* Studio Logo */}
          <img src="/images/logo.png" alt="Camp Studios" className="h-6" />
          <span className="text-xs uppercase text-white">
            A Camp Studios Production
          </span>
        </div>

        {/* Top Right Badge - Hidden on mobile */}
        <span className="bg-white rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase">
          In Theaters Nationwide This Fall
        </span>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-10 md:px-4">
        {/* Film Title */}
        <h1
          className="bg-pink-600 border border-black border-w-[2px] max-h-[120px] text-white text-[20px] md:text-[72px] font-normal uppercase px-[76px] py-5 rounded"
          style={{
            fontFamily: "Grange Heavy, sans-serif",
            fontWeight: 900,
            lineHeight: "106%",
            letterSpacing: "-1%",
          }}
        >
          Two Sleepy People
        </h1>

        {/* Subtitle */}
        <p
          className="mt-[22px] text-xl md:text-[41px] inline-block text-white"
          style={{
            fontWeight: 500,
            lineHeight: "106%",
            letterSpacing: "-17%",
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

        {/* Mobile Badge - Only visible on mobile */}
        <div className="mt-2 md:hidden">
          <span className="bg-white rounded-full px-10 py-1 text-[9.5px] font-semibold tracking-wide uppercase">
            In Theaters Nationwide This Fall
          </span>
        </div>
      </div>
    </section>
  );
}
