const theaters = [
  {
    name: "Albuquerque Rio 24 + XD (Albuquerque, NM)",
    city: "Albuquerque, NM",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=419&ShowtimeId=760355&CinemarkMovieId=106965&Showtime=2025-11-14T18:45:00",
  },
  {
    name: "Regal Atlantic Station (Atlanta, GA)",
    city: "Atlanta, GA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=349846&site=1346&date=11-14-2025",
  },
  {
    name: "Alamo Slaughter Lane 8 (Austin, TX)",
    city: "Austin, TX",
    date: "14-Nov",
    url: "https://drafthouse.com/austin/show/two-sleepy-people?cinemaId=0006&sessionId=207292",
  },
  {
    name: "Regal Stonecrest at Piper Glen (Charlotte, NC)",
    city: "Charlotte, NC",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=416635&site=0384&date=11-14-2025",
  },
  {
    name: "Regal City North (Chicago, IL)",
    city: "Chicago, IL",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=250606&site=1789&date=11-14-2025",
  },
  {
    name: "Cinemark West Plano 20 + XD (Plano, TX)",
    city: "Plano, TX",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=231&ShowtimeId=840576&CinemarkMovieId=106965&Showtime=2025-11-14T18:45:00",
  },
  {
    name: "Cinemark 17 + XD, IMAX (Dallas, TX)",
    city: "Dallas, TX",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=207&ShowtimeId=607066&CinemarkMovieId=106965&Showtime=2025-11-14T19:15:00",
  },
  {
    name: "Regal UA Denver Pavilions (Denver, CO)",
    city: "Denver, CO",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=247772&site=1315&date=11-14-2025",
  },
  {
    name: "Regal Valley River Center (Eugene, OR)",
    city: "Eugene, OR",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=248818&site=0670&date=11-14-2025",
  },
  {
    name: "Regal Coldwater Crossing (Fort Wayne, IN)",
    city: "Fort Wayne, IN",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=267876&site=0169&date=11-14-2025",
  },
  {
    name: "Regal Edwards Greenway Grand Palace (Houston, TX)",
    city: "Houston, TX",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=414824&site=1051&date=11-14-2025",
  },
  {
    name: "Xscape Katy 12  (Richmond, TX)",
    city: "Richmond, TX",
    date: "14-Nov",
    url: "https://kf12.xscapetheatres.com/seats/16995/",
  },
  {
    name: "Regal Red Rock (Las Vegas, NV)",
    city: "Las Vegas, NV",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=266168&site=0659&date=11-14-2025",
  },
  {
    name: "Regal Kendall Village (Miami, FL)",
    city: "Miami, FL",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=287674&site=0996&date=11-14-2025",
  },
  {
    name: "Regal Opry Mills (Nashville, TN)",
    city: "Nashville, TN",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=401602&site=0615&date=11-14-2025",
  },
  {
    name: "Regal Union Square (New York, NY)",
    city: "New York, NY",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=275422&site=1320&date=11-14-2025",
  },
  {
    name: "Universal Cinemark at CityWalk +XD (Orlando, FL)",
    city: "Orlando, FL",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=1017&ShowtimeId=230681&CinemarkMovieId=106965&Showtime=2025-11-14T18:30:00",
  },
  {
    name: "Regal UA Grant Plaza (Philadelphia, PA)",
    city: "Philadelphia, PA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=148417&site=1290&date=11-14-2025",
  },
  {
    name: "Portland Eastport Plaza (Portland, OR)",
    city: "Portland, OR",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=432&ShowtimeId=493896&CinemarkMovieId=106965&Showtime=2025-11-14T19:30:00",
  },
  {
    name: "Regal Short Pump (Richmond, VA)",
    city: "Richmond, VA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=247801&site=0730&date=11-14-2025",
  },
  {
    name: "Megaplex Theatres Jordan Commons + IMAX (Sandy, UT)",
    city: "Sandy, UT",
    date: "14-Nov",
    url: "https://megaplex.com/checkout/jordancommons/0001-225653/HO00004049/two-sleepy-people",
  },
  {
    name: "Regal Cielo Vista (San Antonio, TX)",
    city: "San Antonio, TX",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=305376&site=0765&date=11-14-2025",
  },
  {
    name: "Regal Stonestown Galleria (San Francisco, CA)",
    city: "San Francisco, CA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=91983&site=1464&date=11-14-2025",
  },
  {
    name: "Redwood Downtown 20 + XD (Redwood City, CA)",
    city: "Redwood City, CA",
    date: "14-Nov",
    url: "https://www.cinemark.com/TicketSeatMap/?TheaterId=485&ShowtimeId=667597&CinemarkMovieId=106965&Showtime=2025-11-14T19:30:00",
  },
  {
    name: "Cinelounge - Tiburon (Tiburon, CA)",
    city: "Tiburon, CA",
    date: "14-Nov",
    url: "https://cineloungefilm.com/checkout/seats/2269170",
  },
  {
    name: "Regal Thornton Place (Seattle, WA)",
    city: "Seattle, WA",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=287461&site=1937&date=11-14-2025",
  },
  {
    name: "Cineplex Cinemas Yonge-Dundas and VIP (Toronto, ON)",
    city: "Toronto, ON",
    date: "15-Nov",
    url: "https://www.cineplex.com/ticketing/preview?theatreId=7130&showtimeId=423182&dbox=false",
  },
  {
    name: "Xscape Theatres Brandywine 14 + XTR (Brandywine, MD)",
    city: "Brandywine, MD",
    date: "14-Nov",
    url: "https://bw14.xscapetheatres.com/seats/22393/",
  },
  {
    name: "Regal Gallery Place (Washington, DC)",
    city: "Washington, DC",
    date: "14-Nov",
    url: "https://www.regmovies.com/movies/two-sleepy-people-ho00020070?id=242490&site=1551&date=11-14-2025",
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
                          className={`relative px-10 py-1.5 rounded-[6px] border-2 border-black text-[8px] font-semibold underline uppercase ${palette.bg} ${palette.text} hover:opacity-90 transition`}
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
