import { useState, useEffect } from "react";

// Parse CSV data
const parseCSV = (csvText) => {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current);

    const row = {};
    headers.forEach((header, i) => {
      row[header.trim()] = values[i]?.trim() || "";
    });

    return {
      area: row["Area"],
      name: row["Theater Long Name"],
      address: row["Address"],
      city: row["City"],
      url: row["Link"],
    };
  });
};

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

export default function TheaterTable({ onOpenCreditsModal }) {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/targeted-theaters.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const parsedData = parseCSV(csvText);
        setTheaters(parsedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading theaters:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-[800px] relative bg-[#000000] mx-auto py-8 md:py-10 pb-12 md:pb-32 px-4 md:px-12 lg:px-16 overflow-hidden">
        <div className="w-full bg-white shadow-2xl relative h-[500px] flex flex-col rounded-lg border-2 border-black max-w-4xl mx-auto items-center justify-center">
          <p className="text-xl font-semibold text-gray-600">
            Loading theaters...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[600px] md:min-h-[800px] flex flex-col justify-center items-center relative bg-[#000000] mx-auto py-6 md:py-10 pb-8 md:pb-32 px-3 md:px-12 lg:px-16 overflow-hidden">
      <div className="text-center w-full mb-6 md:mb-10 mt-4 md:mt-6 space-y-2 md:space-y-4 max-w-4xl mx-auto">
        <h2 className="text-center text-[#ffffff] font-bold text-[22px] sm:text-[36px] tracking-wide uppercase px-2">
          PRE-SALE TICKETS FOR JAN 23 ARE OFFICIALLY ON SALE
        </h2>

        <span className="text-center text-[#ffffff] font-bold text-sm sm:text-2xl tracking-wide uppercase">
          SCROLL THROUGH THE LIST TO FIND YOUR CITY
        </span>
      </div>

      <div
        className="w-full bg-white shadow-lg md:shadow-2xl relative h-[450px] sm:h-[500px] flex flex-col rounded-lg border-2 border-black max-w-4xl mx-auto"
        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
      >
        <div className="px-3 sm:px-4 md:px-6 pt-3 md:pt-4 flex-shrink-0">
          <div className="grid grid-cols-3 gap-2">
            <h2
              className="text-xs sm:text-sm md:text-xl lg:text-2xl text-start font-extrabold"
              style={{ color: "#0f1724" }}
            >
              Cities
            </h2>
            <h2
              className="text-xs sm:text-sm md:text-xl lg:text-2xl font-extrabold text-center flex-1"
              style={{ color: "#0f1724" }}
            >
              Theater Location
            </h2>
            <h2
              className="text-xs sm:text-sm md:text-xl lg:text-2xl text-end font-extrabold"
              style={{ color: "#0f1724" }}
            >
              Ticket Link
            </h2>
          </div>

          <div className="mt-2 md:mt-4 border-t-2 border-black" />
        </div>

        <div className="overflow-y-auto flex-1 px-3 sm:px-4 md:px-6 pb-6 md:pb-8">
          <div className="mt-3 md:mt-6">
            {theaters.map((t, i) => {
              const palette = buttonPalettes[i % buttonPalettes.length];
              return (
                <div
                  key={i}
                  className="grid grid-cols-12 items-center gap-1 sm:gap-2 md:gap-4 py-2 md:py-3 border-b"
                  style={{ borderColor: thinPink }}
                >
                  <div className="col-span-4">
                    <div
                      className="text-pink-600 font-bold text-xs sm:text-sm md:text-base tracking-tight sm:tracking-normal md:tracking-wide leading-tight"
                      style={{ color: accentPink }}
                    >
                      {t.area}
                    </div>
                  </div>

                  <div className="col-span-4 text-center text-xs sm:text-sm md:text-base font-medium text-[#0f1724]">
                    <div className="font-semibold leading-tight">{t.name}</div>
                  </div>

                  <div className="col-span-4 flex justify-end">
                    <div className="relative">
                      <span
                        aria-hidden
                        className="absolute inset-0 translate-x-[1px] translate-y-[1px] sm:translate-x-[2px] sm:translate-y-[2px] rounded-[4px] sm:rounded-[6px] bg-black opacity-75"
                      />
                      <a href={t.url} target="_blank" rel="noopener noreferrer">
                        <button
                          className={`relative px-2 sm:px-4 md:px-10 py-1 sm:py-1.5 rounded-[4px] sm:rounded-[6px] border border-black sm:border-2 text-[8px] sm:text-[9px] md:text-[10px] font-semibold underline uppercase ${palette.bg} ${palette.text} hover:opacity-90 transition whitespace-nowrap`}
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

      <div className="max-w-4xl w-full flex mx-auto flex-col sm:flex-row gap-2 sm:gap-10 justify-center items-center mt-8">
        <div className="relative w-full sm:w-auto">
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[2px] translate-y-[2px] rounded-xl bg-black opacity-75"
          />
          <a
            href="https://www.fandango.com/two-sleepy-people-2025-243090/movie-overview"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className={`text-[14px] sm:w-auto w-full relative px-4 sm:px-12 py-4 rounded-xl border-2 border-black font-bold underline uppercase bg-[#E1701C] text-white hover:opacity-90 transition`}
            >
              Find All Showings On Fandango
            </button>
          </a>
        </div>

        <div className="relative w-full sm:w-auto">
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[2px] translate-y-[2px] rounded-xl bg-black opacity-75"
          />
          <a
            href="https://docs.google.com/spreadsheets/d/1lEfrY6je36FeQSYljG80S-OAhg8DttpMB-mIoZUuka8/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className={`relative px-4 sm:w-auto w-full sm:px-12 py-4 rounded-xl border-2 border-black text-[14px] font-bold underline uppercase bg-[#598CCC] text-white hover:opacity-90 transition cursor-pointer`}
            >
              Don't See Showings Near Your City?
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
