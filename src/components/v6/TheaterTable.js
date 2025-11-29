const theaters = [
  {
    name: "Alamo Slaughter Lane 8 (Austin, TX)",
    city: "Austin, TX",
    url: "https://drafthouse.com/austin/show/two-sleepy-people?cinemaId=0006&sessionId=207292",
  },
  {
    name: "Alamo Drafthouse Seaport (Boston, MA)",
    city: "Boston, MA",
    url: "https://drafthouse.com/boston/show/two-sleepy-people?cinemaId=0006&sessionId=207292",
  },
  {
    name: "AMC River East 21 with Dolby, Prime (Chicago, IL)",
    city: "Chicago, IL",
    url: "https://www.amctheatres.com/showtimes/138520146/seats",
  },
  {
    name: "Alamo Lake Highlands 8 (Dallas, TX)",
    city: "Dallas, TX",
    url: "https://drafthouse.com/dfw/show/two-sleepy-people?cinemaId=0706",
  },
  {
    name: "Regal UA Denver Pavilions (Denver, CO)",
    city: "Denver, CO",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=1315&id=249830",
  },
  {
    name: "Ann Arbor 20 IMAX (Ypsilanti, MI)",
    city: "Ypsilanti, MI",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=1097&ShowtimeId=458723&CinemarkMovieId=106965&Showtime=2025-12-05T19:05:00",
  },
  {
    name: "Regal Irvine Spectrum (Irvine, CA)",
    city: "Irvine, CA",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=1010&id=362389",
  },
  {
    name: "AMC Burbank 16 (Burbank, CA)",
    city: "Burbank, CA",
    url: "https://www.amctheatres.com/showtimes/138520498/seats",
  },
  {
    name: "AMC Empire 25 with IMAX,Dolby,Prime (New York, NY)",
    city: "New York, NY",
    url: "https://www.amctheatres.com/showtimes/138520502/seats",
  },
  {
    name: "Regal Union Square (New York, NY)",
    city: "New York, NY",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=278457&site=1320&date=12-05-2025",
  },
  {
    name: "Portland Eastport Plaza (Portland, OR)",
    city: "Portland, OR",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=432&ShowtimeId=497017&CinemarkMovieId=106965&Showtime=2025-12-05T19:30:00",
  },
  {
    name: "Regal Bridgeport Village (Tigard, OR)",
    city: "Tigard, OR",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=0652&id=323413",
  },
  {
    name: "AMC Southpoint 17 with IMAX, Dolby (Durham, NC)",
    city: "Durham, NC",
    url: "https://www.amctheatres.com/showtimes/138520612/seats",
  },
  {
    name: "Regal Alamo Quarry (San Antonio, TX)",
    city: "San Antonio, TX",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=0939&id=277547",
  },
  {
    name: "Regal Cielo Vista (San Antonio, TX)",
    city: "San Antonio, TX",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=0765&id=307002",
  },
  {
    name: "Regal Edwards Mira Mesa (San Diego, CA)",
    city: "San Diego, CA",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=1043&id=338707",
  },
  {
    name: "AMC Mission Valley 20 with IMAX, Dolby (San Diego, CA)",
    city: "San Diego, CA",
    url: "https://www.amctheatres.com/showtimes/138520499/seats",
  },
  {
    name: "AMC Metreon 16 with IMAX, Dolby (San Francisco, CA)",
    city: "San Francisco, CA",
    url: "https://www.amctheatres.com/showtimes/138520605/seats",
  },
  {
    name: "AMC Pacific Place 11 (Seattle, WA)",
    city: "Seattle, WA",
    url: "https://www.amctheatres.com/showtimes/138520531/seats",
  },
  {
    name: "Imagine Cinemas Carlton (Toronto, ON)",
    city: "Toronto, ON",
    url: "https://omniwebticketing6.com/imaginecinemas/carlton/?schdate=2025-12-05&perfix=131238",
  },
  {
    name: "Regal Gallery Place (Washington, DC)",
    city: "Washington, DC",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?date=12-05-2025&site=1551&id=244262",
  },
  {
    name: "AMC Georgetown 14 with IMAX, Dolby (Washington, DC)",
    city: "Washington, DC",
    url: "https://www.amctheatres.com/showtimes/138520608/seats",
  },
  {
    name: "Studio Movie Grill Plano (Plano, TX)",
    city: "Plano, TX",
    url: "https://www.studiomoviegrill.com/quicktickets/texas/plano/2025/12/5",
  },
  {
    name: "Megaplex Theatres Jordan Commons + IMAX (Sandy, UT)",
    city: "Sandy, UT",
    url: "https://megaplex.com/jordancommons",
  },
];

const accentPink = "#d95b85";
const thinPink = "rgba(217,91,133,0.12)";

const buttonPalettes = [
  { bg: "bg-[#F27F93]", text: "text-white", shadow: "shadow-pink-700/60" },
  {
    bg: "bg-[#E1701C]",
    text: "text-white",
    shadow: "shadow-orange-700/60",
  },
  { bg: "bg-[#D89B2B]", text: "text-white", shadow: "shadow-yellow-700/60" },
  { bg: "bg-[#0472BC]", text: "text-white", shadow: "shadow-blue-700/60" },
  { bg: "bg-[#2F7238]", text: "text-white", shadow: "shadow-green-700/60" },
  { bg: "bg-[#DD7587]", text: "text-white", shadow: "shadow-rose-700/60" },
];

export default function TheaterTable() {
  return (
    <div className="flex items-center justify-center h-full overflow-hidden">
      <div
        className="w-full bg-white shadow-2xl relative h-full flex flex-col"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="px-6 pt-8 flex-shrink-0">
          <div className="grid grid-cols-3 mb-6">
            <h2
              className="text-2xl text-start font-extrabold"
              style={{ color: "#0f1724" }}
            >
              Cities
            </h2>
            <h2
              className="text-2xl font-extrabold text-center flex-1"
              style={{ color: "#0f1724" }}
            >
              Theater Location
            </h2>
            <h2
              className="text-2xl text-end font-extrabold"
              style={{ color: "#0f1724" }}
            >
              Ticket Link
            </h2>
          </div>

          <div
            className="border-t"
            style={{ borderColor: "rgba(0,0,0,0.25)" }}
          />
        </div>

        <div className="overflow-y-auto flex-1 px-6 pb-8">
          <div className="mt-6">
            {theaters.map((t, i) => {
              const palette = buttonPalettes[i % buttonPalettes.length];
              return (
                <div
                  key={i}
                  className="grid grid-cols-12 items-center gap-4 py-3 border-b"
                  style={{ borderColor: thinPink }}
                >
                  <div className="col-span-4">
                    <div
                      className="text-pink-600 font-semibold text-xs tracking-wide"
                      style={{ color: accentPink }}
                    >
                      {t.city}
                    </div>
                  </div>

                  <div className="col-span-4 text-center text-xs font-medium text-[#0f1724]">
                    {t.name.replace(/\s*\(.*\)$/, "")}
                  </div>

                  <div className="col-span-4 flex justify-end">
                    <div className="relative">
                      <span
                        aria-hidden
                        className="absolute inset-0 translate-x-[2px] translate-y-[2px] rounded-[6px] bg-black opacity-75"
                      />
                      <a href={t.url} target="_blank" rel="noopener noreferrer">
                        <button
                          className={`relative px-4 sm:px-10 py-1.5 rounded-[6px] border-2 border-black text-[8px] font-semibold underline uppercase ${palette.bg} ${palette.text} hover:opacity-90 transition`}
                        >
                          Buy Tickets
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
