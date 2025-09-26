export default function MoviePremiere() {
  const screenings = [
    {
      date: "OCTOBER 25, 2025",
      city: "SEATTLE",
      color: "#F27F93",
      link: "https://luma.com/d8ysy36d",
    },
    {
      date: "OCTOBER 28, 2025",
      city: "SAN FRANCISCO",
      color: "#E1701C",
      link: "https://luma.com/pj2j56eb",
    },
    {
      date: "OCTOBER 29, 2025",
      city: "LOS ANGELES",
      color: "#D89B2B",
      link: "https://luma.com/hy9vyqii",
    },
    {
      date: "NOVEMBER 14, 2025",
      city: "NEW YORK CITY",
      color: "#0472BC",
      link: "https://luma.com/7xwpi1wf",
    },
  ];

  return (
    <section
      className="max-w-7xl w-full mx-auto px-4 md:px-12 lg:px-16 overflow-x-hidden"
      id="where-to-watch"
    >
      {/* Mobile layout: grid of postcards, button below, hide desktop elements */}
      <div className="block md:hidden border-t border-black border-b w-full py-12">
        <h2 className="text-[1.5rem] tracking-wider font-extrabold text-[#D42568] mb-2 text-center">
          HOW TO WATCH THE MOVIE?
        </h2>
        <p className="text-gray-800 mb-6 text-[0.75rem] font-medium text-center">
          WE’RE STARTING WITH 4 EARLY PREMIERE SCREENINGS!
          <span className="ml-1">🎟️</span>
        </p>
        <div className="px-[40px]">
          {/* 2-column grid for postcards */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <a
              href={screenings[2].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/movie-premiere-images/CS_TSP_CITYPOSTCARDS_LAV1_SQUARE.png"
                alt="Los Angeles Premiere"
                className="w-full rounded shadow"
              />
            </a>
            <a
              href={screenings[3].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/movie-premiere-images/CS_TSP_CITYPOSTCARDS_NYV1_SQUARE.png"
                alt="New York Premiere"
                className="w-full rounded shadow"
              />
            </a>
            <a
              href={screenings[0].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/movie-premiere-images/CS_TSP_CITYPOSTCARDS_SEATTLEV1_SQUARE.png"
                alt="Seattle Premiere"
                className="w-full rounded shadow"
              />
            </a>
            <a
              href={screenings[1].link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/movie-premiere-images/CS_TSP_CITYPOSTCARDS_SFV1_SQUARE 1.png"
                alt="San Francisco Premiere"
                className="w-full rounded shadow"
              />
            </a>
          </div>
          {/* Centered Buy Tickets button */}
          <div className="flex justify-center mb-4 w-full">
            <a
              href="https://luma.com/user/campstudios"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <div className="relative w-full">
                <span
                  aria-hidden
                  className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-black w-full"
                />
                <button className="bg-[#E1701C] relative text-[12px] font-semibold rounded-md border border-black px-12 py-2 text-white w-full uppercase tracking-wide">
                  Buy Premiere Tickets
                </button>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Desktop layout: unchanged, hidden on mobile */}
      <div className="w-full relative flex-row gap-10 hidden md:flex">
        {/* Top dashed border */}
        <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-pink-200" />
        <div className="mx-auto w-full flex flex-row gap-12 items-start relative z-10 py-24">
          {/* Left Column: Heading + Tickets */}
          <div className="w-1/2 px-6">
            <h2 className="text-2xl font-extrabold text-[#D42568] mb-2">
              HOW TO WATCH THE MOVIE?
            </h2>
            <p className="text-gray-800 mb-6 font-medium">
              WE’RE STARTING WITH 4 EARLY PREMIERE SCREENINGS!{" "}
              <span className="ml-1">🎟️</span>
            </p>

            {/* Screenings List */}
            <div className="space-y-4">
              {screenings.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-row items-center justify-between border-b border-[#F7BED3] pt-4 h-fit py-3"
                >
                  <p className="text-[#D42568] text-base font-semibold">
                    {s.date}
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {s.city}
                  </p>
                  <a href={s.link} target="_blank" rel="noopener noreferrer">
                    <div className="relative">
                      <span
                        aria-hidden
                        className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-md bg-black"
                      />
                      <button
                        style={{ backgroundColor: s.color }}
                        className="relative text-[9px] rounded-md border border-black px-12 py-2 text-white font-semibold uppercase tracking-wide"
                      >
                        Buy Tickets
                      </button>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Overlapping Images */}
          <div className="relative w-1/2 h-full hidden md:flex justify-center">
            {/* Wrapper gives space for all absolutely positioned images */}
            <div className="relative w-full h-full">
              {/* Outer postcards (4 edges) */}
              <div className="absolute top-20 left-10 rotate-[21deg] w-36 shadow-lg z-50">
                <img
                  src="/images/movie-premiere-images/CS_TSP_CITYPOSTCARDS_SEATTLEV1_SQUARE.png"
                  alt="Seattle Premiere"
                />
              </div>

              <div className="absolute top-12 right-10 rotate-[-30deg] w-36 shadow-lg z-40">
                <img
                  src="/images/movie-premiere-images/CS_TSP_CITYPOSTCARDS_NYV1_SQUARE.png"
                  alt="New York Premiere"
                />
              </div>

              <div className="absolute bottom-20 right-10 rotate-[3deg] w-36 shadow-lg z-40">
                <img
                  src="/images/movie-premiere-images/CS_TSP_CITYPOSTCARDS_SFV1_SQUARE 1.png"
                  alt="San Francisco Premiere"
                />
              </div>

              <div className="absolute bottom-10 left-10 rotate-[-8deg] w-36 shadow-lg z-20">
                <img
                  src="/images/movie-premiere-images/CS_TSP_CITYPOSTCARDS_LAV1_SQUARE.png"
                  alt="Los Angeles Premiere"
                />
              </div>

              {/* Middle stack (3 images) */}
              <div className="absolute top-56 left-20 rotate-[7deg] shadow-lg">
                <img
                  src="/images/movie-premiere-images/audience_1.png"
                  alt="Cinema Exterior"
                  className="object-cover"
                  style={{ width: 230, height: 170 }}
                  width={230}
                  height={170}
                />
              </div>

              <div className="absolute top-52 right-12 rotate-[-11deg] w-60 shadow-lg z-20">
                <img
                  src="/images/movie-premiere-images/audience_2.png"
                  alt="Audience"
                  style={{ width: 220, height: 160 }}
                  width={220}
                  height={160}
                />
              </div>

              <div className="absolute top-24 left-40 rotate-[-1deg] w-60 shadow-lg">
                <img
                  src="/images/movie-premiere-images/audience_3.jpg"
                  alt="Cinema Interior"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom dashed border */}
        <div className="absolute bottom-0 left-0 w-full border-t-2 border-dashed border-pink-200" />
      </div>
    </section>
  );
}
