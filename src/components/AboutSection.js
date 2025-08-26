export default function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto pb-16 px-10 md:px-12 lg:px-16 overflow-x-hidden">
      <div className="mb-8 text-center">
        <span className="inline-block bg-[#D42568] border border-black border-w-[0.66px] max-h-[40px] max-w-[200px] text-white text-[14px] font-normal uppercase px-[15px] py-2 rounded">
          About the Film
        </span>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden gap-[50px]">
        {/* Mobile: Main Poster Only (centered, no stills behind) */}
        <div className="flex flex-col md:hidden items-center justify-center gap-[13px]">
          <img
            src="/images/cover.jpg"
            alt="Two Sleepy People Poster"
            className="w-[177.75px] border border-black rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.3)] rotate-[-3.72deg]"
          />

          {/* Mobile: Tagline */}
          <div className="flex justify-center">
            <img
              src="/images/every-night-text.png"
              alt="Every night they're married. Every morning, they're strangers."
              className="w-80 h-auto"
            />
          </div>
        </div>

        {/* Mobile: About Film Content */}
        <div>
          {/* Story Box */}
          <div className="bg-white border border-black rounded-lg p-6 mb-6">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold italic">So what's it about?</span>
              <br />
              Syd and Lucy are coworkers by day — strangers, really. But every
              night, they wake up in the same dream, living as a married couple
              in the lives they always wanted. As they search for a way out, the
              dream begins to fracture, revealing pieces of a past they've both
              tried to forget.
            </p>
          </div>

          {/* Credits */}
          <p className="text-sm leading-relaxed mb-6">
            Made with a small crew, no studio backing, and a whole lot of Google
            Docs, <span className="italic">Two Sleepy People</span> was written
            and filmed in just <span className="font-mono">100</span> days. The
            process was fast, scrappy, and entirely creator-led.
          </p>
          <p className="text-sm leading-relaxed mb-8">
            Written &amp; directed by Baron Ryan{" "}
            <a
              href="https://www.instagram.com/americanbaron/?hl=en"
              className="text-blue-600 underline"
            >
              (@americanbaron)
            </a>
            , this isn't just another indie film,{" "}
            <span className="italic font-semibold">
              but Internet Cinema's debut.
            </span>
          </p>

          {/* CTA Buttons with retro offset shadow - Mobile Full Width */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Pink button */}
            <div className="relative w-full">
              <span
                aria-hidden
                className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-[#3e2a35]"
              />
              <button className="relative text-[11px] rounded-md border border-black bg-[#D42568] px-16 py-2 text-white font-semibold uppercase tracking-wide w-full">
                Trailer Coming Soon
              </button>
            </div>

            {/* Orange button */}
            <div className="relative w-full">
              <span
                aria-hidden
                className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-[#5a3b1f]"
              />
              <a href="https://campstudios.com/">
                <button className="relative text-[11px] rounded-md border border-black bg-orange-500 px-16 py-2 text-white font-semibold uppercase tracking-wide w-full">
                  Learn More From Camp Studios
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile: Three Still Images (bigger and centered with overlapping) */}
        <div className="relative flex flex-col items-center">
          <img
            src="/images/still-1.jpg"
            alt="Film still"
            className="w-full border border-black rounded-[10px] shadow-md relative z-20"
          />
          <img
            src="/images/still-3.jpg"
            alt="Film still"
            className="w-[286px] border border-black rounded-[10px] shadow-md -mt-2 relative z-10 rotate-[-14.37deg]"
          />
          <img
            src="/images/still-2.jpg"
            alt="Film still"
            className="w-full border border-black rounded-[10px] shadow-md -mt-2 relative z-20"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row gap-12 items-start">
        {/* Left: Poster + vertical stack behind */}
        <div className="relative mx-auto md:mx-0 flex flex-col gap-8 items-center h-full md:w-2/5">
          <div className="relative items-center justify-center">
            {/* Stacked stills in a single vertical column behind poster */}
            <div className="absolute -left-6 md:-left-8 lg:-left-12 xl:-left-16 2xl:-left-24 flex flex-col -gap-8">
              <img
                src="/images/still-1.jpg"
                alt="Film still"
                className="w-20 md:w-24 lg:w-28 xl:w-32 2xl:w-36 border border-black rounded-[10px] rotate-[13.27deg] shadow-md"
              />
              <img
                src="/images/still-2.jpg"
                alt="Film still"
                className="w-24 md:w-28 lg:w-32 xl:w-36 2xl:w-40 border border-black rounded-[10px] shadow-md z-10"
              />
              <img
                src="/images/still-3.jpg"
                alt="Film still"
                className="w-20 md:w-24 lg:w-28 xl:w-32 2xl:w-36 border border-black rounded-[10px] rotate-[-14.38deg] shadow-md"
              />
            </div>

            {/* Main Poster (smaller + subtle skew) */}
            <img
              src="/images/cover.jpg"
              alt="Two Sleepy People Poster"
              className="relative z-10 w-32 md:w-40 lg:w-48 xl:w-56 2xl:w-64 border border-black rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.3)] rotate-[-3.72deg]"
            />
          </div>

          {/* Tagline */}
          <img
            src="/images/every-night-text.png"
            alt="Every night they’re married. Every morning, they’re strangers."
            className="mt-4 w-72 md:w-80 h-auto"
          />
        </div>

        {/* Right: About Film */}
        <div className="md:w-3/5">
          {/* Story Box */}
          <div className="bg-white border border-black rounded-lg p-6 mb-6">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold italic">So what’s it about?</span>
              <br />
              Syd and Lucy are coworkers by day — strangers, really. But every
              night, they wake up in the same dream, living as a married couple
              in the lives they always wanted. As they search for a way out, the
              dream begins to fracture, revealing pieces of a past they’ve both
              tried to forget.
            </p>
          </div>

          {/* Credits */}
          <p className="text-sm leading-relaxed mb-6">
            Made with a small crew, no studio backing, and a whole lot of Google
            Docs, <span className="italic">Two Sleepy People</span> was written
            and filmed in just <span className="font-mono">100</span> days. The
            process was fast, scrappy, and entirely creator-led.
          </p>
          <p className="text-sm leading-relaxed mb-8">
            Written &amp; directed by Baron Ryan{" "}
            <a
              href="https://www.instagram.com/americanbaron/?hl=en"
              className="text-blue-600 underline"
            >
              (@americanbaron)
            </a>
            , this isn’t just another indie film,{" "}
            <span className="italic font-semibold">
              but Internet Cinema’s debut.
            </span>
          </p>

          {/* CTA Buttons with retro offset shadow */}
          <div className="flex flex-wrap gap-6">
            {/* Pink button */}
            <div className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-[#3e2a35]"
              />
              <button className="relative text-[11px] rounded-md border border-black bg-[#D42568] px-16 py-2 text-white font-semibold uppercase tracking-wide">
                Trailer Coming Soon
              </button>
            </div>

            {/* Orange button */}
            <div className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-[#5a3b1f]"
              />
              <a href="https://campstudios.com/">
                <button className="relative text-[11px] rounded-md border border-black bg-orange-500 px-16 py-2 text-white font-semibold uppercase tracking-wide">
                  Learn More From Camp Studios
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
