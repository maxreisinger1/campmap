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
    <section
      id="about-the-film"
      className="max-w-7xl mx-auto border-t-[5px] border-dashed border-[#D42568]/30 py-8 md:py-10 pb-12 md:pb-16 px-4 md:px-12 lg:px-16 overflow-x-hidden mt-10 md:mt-20"
    >
      {/* Mobile layout: About label, trailer, story box in order */}

      <h2 className="text-center text-[#D7266A] font-bold text-2xl md:text-3xl mb-8 md:mb-10 tracking-wide uppercase">
        About the film
      </h2>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="md:hidden w-full mx-auto flex flex-col min-h-[60vh] items-center justify-center">
          {/* Trailer */}
          <div
            className="w-full overflow-hidden rounded-lg border-2 border-black mb-6"
            style={{ height: 220 }}
          >
            <iframe
              src="https://www.youtube.com/embed/TWpm8baVm9g"
              title="Two Sleepy People Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-2 border-black"
            />
          </div>
          {/* Story Box */}
          <div className="bg-white border border-black rounded-lg p-4 md:p-6">
            <p className="text-xs md:text-sm leading-relaxed">
              <span className="font-semibold italic mb-4 block">
                How "Two Sleepy People" Came To Be
              </span>
              <span className="mb-4 block">
                This movie isn’t a big studio film. It was made in 100 days for
                $100K with a small crew of friends, fellow creators, and a
                director who grew up teaching himself how to tell stories
                online. It’s scrappy, personal, and the first of its kind: a
                fully creator-made feature trying to break into real theaters
                across the world.
              </span>
              <span>
                <span className="font-semibold italic">Two Sleepy People</span>{" "}
                is a story about a couple that’s married every night, but by
                morning — they’re strangers. Written & directed by Baron Ryan
                (@americanbaron), this is{" "}
                <span className="font-semibold italic">
                  Internet Cinema’s debut.
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Desktop layout: keep original, hide on mobile */}
        <div
          className="hidden md:block w-full md:w-[40%] mx-auto"
          ref={leftBoxRef}
        >
          <div className="relative mb-6 md:mb-8 text-center w-full">
            <span
              aria-hidden
              className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-black"
            />
            <div className="bg-[#D42568] relative text-[11px] rounded-md border border-black px-8 py-2 text-white font-semibold uppercase tracking-wide">
              The Origins of Two Sleepy People
            </div>
          </div>
          {/* Story Box */}
          <div className="bg-white border border-black rounded-lg p-4 md:p-6">
            <p className="text-xs md:text-sm leading-relaxed">
              <span className="font-semibold italic mb-4 block">
                How "Two Sleepy People" Came To Be
              </span>
              <span className="mb-4 block">
                This movie isn’t a big studio film. It was made in 100 days for
                $100K with a small crew of friends, fellow creators, and a
                director who grew up teaching himself how to tell stories
                online. It’s scrappy, personal, and the first of its kind: a
                fully creator-made feature trying to break into real theaters
                across the world.
              </span>
              <span>
                <span className="font-semibold italic">Two Sleepy People</span>{" "}
                is a story about a couple that’s married every night, but by
                morning — they’re strangers. Written & directed by Baron Ryan
                (@americanbaron), this is{" "}
                <span className="font-semibold italic">
                  Internet Cinema’s debut.
                </span>
              </span>
            </p>
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-[60%] mx-auto flex-col">
          <div className="relative mb-6 md:mb-8 text-center w-full">
            <span
              aria-hidden
              className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-black"
            />
            <div className="bg-[#D42568] relative text-[11px] rounded-md border border-black px-8 py-2 text-white font-semibold uppercase tracking-wide">
              Official Trailer
            </div>
          </div>
          <div
            className="w-full overflow-hidden rounded-lg border border-black flex-1"
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
      </div>
    </section>
  );
}
