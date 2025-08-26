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
      <div className="absolute top-4 left-6 flex items-center space-x-2">
        {/* Studio Logo */}
        <img src="/images/logo.png" alt="Camp Studios" className="h-6" />
        <span className="text-xs uppercase text-white opacity-80">
          A Camp Studios Production
        </span>
      </div>

      {/* Top Right Badge */}
      <div className="absolute top-6 right-6">
        <span className="bg-white rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase">
          In Theaters Nationwide This Fall
        </span>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {/* Film Title */}
        <img
          src="/images/hero-text.png"
          alt="Two Sleepy People"
          className="mt-4 max-w-3xl h-auto"
        />

        {/* Subtitle */}
        <p className="mt-4 text-4xl inline-block font-semibold text-white tracking-wide">
          THE ROAD TO
          <img
            src="/images/counter.png"
            alt="Two Sleepy People"
            className="inline-block h-20"
          />
          THEATERS
        </p>
      </div>
    </section>
  );
}
