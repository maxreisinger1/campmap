import { useEffect, useRef } from "react";

export default function BuyTicketsSection() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const injectWidgetScript = (container, src, slug) => {
      if (!container) return;

      // Avoid duplicate injections in Fast Refresh / re-renders
      if (container.dataset.widgetLoaded === "true") return;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = src;
      script.setAttribute("data-slug", slug);
      script.async = true;

      container.appendChild(script);
      container.dataset.widgetLoaded = "true";

      // After the script loads, ensure any injected iframes fill the height
      script.onload = () => {
        setTimeout(() => {
          const iframe = container.querySelector("iframe");
          if (iframe) {
            iframe.style.height = "600px";
            iframe.style.minHeight = "600px";
          }
        }, 100);
      };
    };

    injectWidgetScript(
      mapContainerRef.current,
      "https://gathr.com/assets/widgets/films/map.js",
      "two-sleepy-people"
    );

    // Cleanup in case the component unmounts (e.g., route changes, HMR)
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = "";
        delete mapContainerRef.current.dataset.widgetLoaded;
      }
    };
  }, []);

  return (
    <section
      id="buy-tickets"
      className="max-w-7xl w-full mx-auto px-4 md:px-12 lg:px-16 overflow-x-hidden py-8 md:pt-20"
    >
      <div>
        <h2 className="text-start text-[#D7266A] font-bold text-xl md:text-2xl lg:text-3xl tracking-wide uppercase">
          Buy Your Tickets Below! - In Theaters For ONE-NIGHT-ONLY (November
          14th)
        </h2>
        <p className="text-gray-800 text-xs md:text-sm my-4 font-medium uppercase leading-relaxed">
          <span className="font-semibold">
            You’ve Helped Unlock 24 Screenings Across the US!
          </span>{" "}
          Browse the list of Limited active screenings Below To Buy Tickets, Or
          Enter Your Location To find A Screening near To You on the map And
          Select A Pin. Fill Up These ScreenIngS To Help Us Get INto Even More
          Theaters WorldWide! 🎟️
        </p>
      </div>
      <div className="w-full flex flex-col lg:flex-row justify-between gap-6 lg:gap-4">
        <div className="flex flex-col w-full lg:w-1/2 h-auto lg:max-h-[600px]">
          <div
            className="w-full bg-[#3C4959] rounded-lg border border-black overflow-hidden h-[500px] lg:flex-1"
            style={{ minHeight: "400px" }}
          >
            <iframe
              src="https://gathr.com/widgets/films/two-sleepy-people/list?embed=1"
              className="w-full h-full"
              style={{
                border: 0,
                borderRadius: "5px",
              }}
              title="Gathr Film List"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            <a
              href="https://www.fandango.com/two-sleepy-people-2025-243090/movie-overview"
              target="_blank"
            >
              <button className="mt-4 py-3 px-6 hover:bg-[#bd6826] transition rounded-[10px] underline border-2 text-white border-black text-xs font-semibold shadow-md bg-[#E1701C] w-full sm:w-auto">
                Find Showings On Fandango
              </button>
            </a>
            <a href="#signup">
              <button className="mt-4 sm:ml-4 py-3 px-6 hover:bg-[#436fa5] transition rounded-[10px] border-2 text-white border-black text-xs font-semibold shadow-md bg-[#598CCC] w-full sm:w-auto">
                How Can I Watch Internationally?
              </button>
            </a>
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-1/2">
          <div
            ref={mapContainerRef}
            className="rounded-lg border border-black overflow-hidden h-[500px] lg:h-[600px]"
            style={{ minHeight: "400px" }}
          />
        </div>
      </div>
    </section>
  );
}
