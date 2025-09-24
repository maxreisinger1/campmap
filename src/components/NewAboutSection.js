import { useRef, useEffect, useState } from "react";

export default function AboutSection() {
  // Create a ref to measure the left box height

  const leftBoxRef = useRef(null);
  const [leftBoxHeight, setLeftBoxHeight] = useState(0);

  useEffect(() => {
    if (leftBoxRef.current) {
      setLeftBoxHeight(leftBoxRef.current.offsetHeight);
    }
  }, []);

  return (
    <section className="max-w-7xl mx-auto pb-16 px-[60px] md:px-12 lg:px-16 overflow-x-hidden flex flex-col md:flex-row gap-6 md:gap-10 mt-14 md:mt-20">
      {/* Mobile layout: About label, trailer, story box in order */}
      <div className="md:hidden w-full mx-auto flex flex-col min-h-[80vh] items-center justify-center">
        {/* About label */}
        <div className="relative md:mb-4 text-center md:w-full w-fit flex items-center justify-center h-full mb-10">
          <div className="bg-[#D42568] relative text-[11px] rounded-md border border-black px-8 py-2 text-white font-semibold uppercase tracking-wide">
            About Two Sleepy People
          </div>
        </div>
        {/* Trailer */}
        <div
          className="w-full overflow-hidden border border-black mb-4"
          style={{ height: 220 }}
        >
          <iframe
            src="https://www.youtube.com/embed/TWpm8baVm9g"
            title="Two Sleepy People Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
        {/* Story Box */}
        <div className="bg-white border border-black rounded-lg p-6">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold italic mb-4 block">
              How "Two Sleepy People" Came To Be
            </span>
            <span className="mb-4 block">
              This movie isn’t a studio film. It was made in 100 days with
              $100K, a crew of friends, and a director who grew up teaching
              himself online. It’s scrappy, personal, and the first of its kind:
              an internet-made feature trying to break into real theaters.
            </span>
            <span>
              <span className="font-semibold italic">Two Sleepy People</span> is
              a story about a couple that’s married every night, but by morning
              — they’re strangers. Written & directed by Baron Ryan
              (@americanbaron), this is{" "}
              <span className="font-semibold italic">
                Internet Cinema’s debut.
              </span>
            </span>
          </p>
        </div>
      </div>

      {/* Desktop layout: keep original, hide on mobile */}
      <div className="hidden md:block w-1/2 mx-auto" ref={leftBoxRef}>
        <div className="relative mb-8 text-center w-full">
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-black"
          />
          <div className="bg-[#D42568] relative text-[11px] rounded-md border border-black px-8 py-2 text-white font-semibold uppercase tracking-wide">
            About the film
          </div>
        </div>
        {/* Story Box */}
        <div className="bg-white border border-black rounded-lg p-6">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold italic mb-4 block">
              How "Two Sleepy People" Came To Be
            </span>
            <span className="mb-4 block">
              This movie isn’t a studio film. It was made in 100 days with
              $100K, a crew of friends, and a director who grew up teaching
              himself online. It’s scrappy, personal, and the first of its kind:
              an internet-made feature trying to break into real theaters.
            </span>
            <span>
              <span className="font-semibold italic">Two Sleepy People</span> is
              a story about a couple that’s married every night, but by morning
              — they’re strangers. Written & directed by Baron Ryan
              (@americanbaron), this is{" "}
              <span className="font-semibold italic">
                Internet Cinema’s debut.
              </span>
            </span>
          </p>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 mx-auto flex-col">
        <div className="relative mb-8 text-center w-full">
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-black"
          />
          <div className="bg-[#D42568] relative text-[11px] rounded-md border border-black px-8 py-2 text-white font-semibold uppercase tracking-wide">
            Trailer
          </div>
        </div>
        <div
          className="w-full overflow-hidden border border-black flex-1"
          style={{ height: leftBoxHeight ? leftBoxHeight - 56 : "auto" }} // 56px is the height of the label + margin
        >
          <iframe
            src="https://www.youtube.com/embed/TWpm8baVm9g"
            title="Two Sleepy People Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
