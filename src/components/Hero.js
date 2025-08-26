export default function Hero() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <video
        src="/images/twosleepymontage2.mp4" // replace with your actual hero image path
        alt="Two Sleepy People"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      />

      {/* Overlay (optional dark fade for readability) */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Top Bar */}
      <div className="absolute top-4 md:left-6 md:flex md:items-center md:space-x-2 flex flex-col items-center w-full md:w-auto">
        <div className="flex items-center space-x-2">
          {/* Studio Logo */}
          <img src="/images/logo.png" alt="Camp Studios" className="h-6" />
          <span className="text-xs uppercase text-white opacity-80">
            A Camp Studios Production
          </span>
        </div>
      </div>

      {/* Top Right Badge - Hidden on mobile */}
      <div className="absolute top-6 right-6 hidden md:block">
        <span className="bg-white rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase">
          In Theaters Nationwide This Fall
        </span>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Film Title */}
        <img
          src="/images/hero-text.png"
          alt="Two Sleepy People"
          className="mt-4 h-auto w-full max-w-xs md:max-w-3xl"
        />

        {/* Subtitle */}
        <p className="mt-4 text-2xl md:text-4xl inline-block font-semibold text-white tracking-wide">
          THE ROAD TO
          <img
            src="/images/counter.png"
            alt="Two Sleepy People"
            className="inline-block h-12 md:h-20"
          />
          THEATERS
        </p>

        {/* Mobile Badge - Only visible on mobile */}
        <div className="mt-6 md:hidden">
          <span className="bg-white rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase">
            In Theaters Nationwide This Fall
          </span>
        </div>
      </div>
    </section>
  );
}
