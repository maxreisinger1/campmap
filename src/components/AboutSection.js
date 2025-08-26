export default function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto pb-16 px-8 md:px-12 lg:px-16">
      {/* Badge centered above BOTH columns */}
      <div className="mb-8 text-center">
        <span className="inline-block bg-pink-600 border border-black border-w-[0.66px] text-white font-semibold uppercase px-10 py-2 rounded">
          About the Film
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Left: Poster + vertical stack behind */}
        <div className="relative mx-auto md:mx-0 flex flex-col gap-8 items-center h-full md:w-2/5">
          <div className="relative items-center justify-center">
            {/* Stacked stills in a single vertical column behind poster */}
            <div className="absolute -left-32 flex flex-col -gap-8">
              <img
                src="/images/still-1.jpg"
                alt="Film still"
                className="w-44 rotate-[13.27deg] shadow-md"
              />
              <img
                src="/images/still-2.jpg"
                alt="Film still"
                className="w-48 shadow-md z-10"
              />
              <img
                src="/images/still-3.jpg"
                alt="Film still"
                className="w-44 rotate-[-14.38deg] shadow-md"
              />
            </div>

            {/* Main Poster (smaller + subtle skew) */}
            <img
              src="/images/cover.jpg"
              alt="Two Sleepy People Poster"
              className="relative z-10 w-72 shadow-[0_4px_6px_rgba(0,0,0,0.3)] rotate-[-3.72deg]"
            />
          </div>

          {/* Tagline */}
          <img
            src="/images/every-night-text.png"
            alt="Every night they’re married. Every morning, they’re strangers."
            className="mt-4 w-80 h-auto"
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
              <button className="relative text-[11px] rounded-md border border-black bg-pink-600 px-16 py-2 text-white font-semibold uppercase tracking-wide">
                Trailer Coming Soon
              </button>
            </div>

            {/* Orange button */}
            <div className="relative inline-block">
              <span
                aria-hidden
                className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-[#5a3b1f]"
              />
              <button className="relative text-[11px] rounded-md border border-black bg-orange-500 px-16 py-2 text-white font-semibold uppercase tracking-wide">
                Learn More From Camp Studios
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
