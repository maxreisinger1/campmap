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
      className="bg-[#DB286D] mx-auto w-full py-8 md:py-10 pb-12 md:pb-32 px-4 md:px-12 lg:px-16 overflow-x-hidden"
    >
      {/* Mobile layout: About label, trailer, story box in order */}

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 max-w-7xl mx-auto">
        <h2 className="text-white w-full justify-center flex flex-col text-center uppercase font-bold tracking-tight items-center sm:hidden">
          <span
            className="text-[28px] text-center font-bold opacity-[0.6]"
            style={{
              fontFamily: "'Adobe Garamond Pro', serif",
            }}
          >
            3.
          </span>
          <span
            className="font-bold text-[28px] tracking-tighter"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            About Two Sleepy People
          </span>
        </h2>

        <div className="md:hidden w-full mx-auto flex flex-col min-h-[60vh] items-center justify-center">
          <div className="relative mb-6 md:mb-8 text-center w-full sm:hidden">
            <span
              aria-hidden
              className="absolute inset-0 translate-x-[4px] translate-y-[4px] bg-black"
            />
            <div className="bg-[#F3EFE4] relative text-[11px] border border-black px-8 py-2 text-black font-bold uppercase tracking-wide">
              Official Trailer
            </div>
          </div>

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
          <div className="text-black px-6 py-7 rounded-lg border border-black flex flex-col bg-white justify-between gap-4 font-normal text-[13px] md:text-sm leading-relaxed">
            <p>
              <span className="font-bold italic">Two Sleepy People</span> is a
              story about two coworkers who, after taking a new line of
              melatonin gummies, are trapped in the same dream every night.
            </p>

            <p>
              <span className="font-bold">
                It’s a 90-minute romantic dramedy
              </span>{" "}
              written & directed by{" "}
              <span className="font-bold">Baron Ryan</span> (
              <a
                href="https://www.instagram.com/americanbaron"
                className="underline"
              >
                @americanbaron
              </a>
              ), a best-selling author best known for his surrealist Tiktoks and
              poetic skits. <span className="font-bold">Caroline Grossman</span>{" "}
              (
              <a
                href="https://www.instagram.com/caroline_konstnar"
                className="underline"
              >
                @caroline_konstnar
              </a>
              ), comedian & fellow internet creator, co-wrote and stars in the
              movie.
            </p>

            <p>
              <span className="font-bold">This movie was made with just:</span>
              <ul className="list-disc list-inside ml-4">
                <li>
                  a small group of friends from the internet (
                  <a href="" className="underline">
                    @creatorcamp
                  </a>
                  )
                </li>
                <li>100 days of writing, filming, & editing </li>
                <li>$100k scraped from savings + sponsors</li>
                <li>
                  And <span className="font-bold">zero film experience.</span>
                </li>
              </ul>
            </p>

            <p className="font-semibold">
              It’s Eternal Sunshine meets Severance.
              <br />
              Made by the internet generation.
            </p>
          </div>

          <div className="relative mt-6 mb-6 text-center w-full sm:hidden">
            <span
              aria-hidden
              className="absolute inset-0 translate-x-[4px] translate-y-[4px] bg-black"
            />
            <div className="bg-[#F3EFE4] relative text-[11px] border border-black px-8 py-2 text-black font-bold uppercase tracking-wide">
              Official Movie Pages
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4">
            <a
              href="https://www.instagram.com/creatorcamp/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/v9/socials/cc-ig.png"
                alt="Director Baron Ryan"
              />
            </a>
            <a
              href="https://www.instagram.com/twosleepymovie/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/v9/socials/tsp-ig.png"
                alt="Written and Directed by"
              />
            </a>
          </div>
        </div>

        {/* Desktop layout: keep original, hide on mobile */}
        <div
          className="hidden md:block w-full md:w-[50%] mx-auto"
          ref={leftBoxRef}
        >
          <div className="relative mb-6 md:mb-8 text-left w-full">
            <h2 className="text-white inline-flex text-left uppercase font-bold tracking-tight items-center gap-4">
              <span
                className="text-[70px] text-center font-bold opacity-[0.6]"
                style={{
                  fontFamily: "'Adobe Garamond Pro', serif",
                }}
              >
                3
              </span>
              <span className="font-semibold text-[38px] text-left tracking-wider leading-[1.1]">
                The Making Of
                <br />
                TWO Sleepy People
              </span>
            </h2>
          </div>
          {/* Story Box */}
          <div className="uppercase text-white flex flex-col justify-between gap-4 font-normal text-[13px] md:text-sm leading-relaxed">
            <p>
              <span className="font-bold italic">Two Sleepy People</span> is a
              story about two coworkers who, after taking a new line of
              melatonin gummies, are trapped in the same dream every night.
            </p>

            <p>
              <span className="font-bold">
                It’s a 90-minute romantic dramedy
              </span>{" "}
              written & directed by{" "}
              <span className="font-bold">Baron Ryan</span> (
              <a
                href="https://www.instagram.com/americanbaron"
                className="underline"
              >
                @americanbaron
              </a>
              ), a best-selling author best known for his surrealist Tiktoks and
              poetic skits. <span className="font-bold">Caroline Grossman</span>{" "}
              (
              <a
                href="https://www.instagram.com/caroline_konstnar"
                className="underline"
              >
                @caroline_konstnar
              </a>
              ), comedian & fellow internet creator, co-wrote and stars in the
              movie.
            </p>

            <p>
              <span className="font-bold">This movie was made with just:</span>
              <ul className="list-disc list-inside ml-4">
                <li>
                  a small group of friends from the internet (
                  <a href="" className="underline">
                    @creatorcamp
                  </a>
                  )
                </li>
                <li>100 days of writing, filming, & editing </li>
                <li>$100k scraped from savings + sponsors</li>
                <li>
                  And <span className="font-bold">zero film experience.</span>
                </li>
              </ul>
            </p>

            <p className="font-semibold">
              It’s Eternal Sunshine meets Severance.
              <br />
              Made by the internet generation.
            </p>
          </div>

          <div className="flex flex-row gap-1 mt-8">
            <a
              href="https://www.instagram.com/creatorcamp/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/v9/socials/cc-ig.png"
                alt="Director Baron Ryan"
                className=""
              />
            </a>
            <a
              href="https://www.instagram.com/twosleepymovie/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/v9/socials/tsp-ig.png"
                alt="Written and Directed by"
              />
            </a>
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-[50%] mx-auto flex-col">
          <div className="relative mb-6 md:mb-8 text-center w-full">
            <span
              aria-hidden
              className="absolute inset-0 translate-x-[4px] translate-y-[4px] bg-black"
            />
            <div className="bg-white relative text-[11px] border border-black px-8 py-2 text-[#D42568] font-semibold uppercase tracking-wide">
              Official Trailer
            </div>
          </div>
          <div
            className="w-full overflow-hidden border-2 border-black flex-1"
            style={{ height: leftBoxHeight ? leftBoxHeight - 56 : "auto" }} // 56px is the height of the label + margin
          >
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/QX0aO-O00V8?si=fcRwnRDFfG8XZcqW"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="flex flex-row items-center justify-center gap-2 px-2 mt-6">
            <a
              href="https://letterboxd.com/film/two-sleepy-people/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/v9/socials/letterboxd.png"
                alt="Director Baron Ryan"
              />
            </a>
            <a>
              <img
                src="/images/v9/socials/rating.png"
                alt="Written and Directed by"
              />
            </a>
            <a>
              <img
                src="/images/v9/socials/IMDb-rating.png"
                alt="Director Baron Ryan"
              />
            </a>
            <a>
              <img
                src="/images/v9/socials/IMDb-logo.png"
                alt="Written and Directed by"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
