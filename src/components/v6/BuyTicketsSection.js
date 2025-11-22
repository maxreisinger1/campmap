import { useEffect, useRef, useCallback } from "react";
import TheaterTable from "./TheaterTable";
import TheaterMap from "./TheaterMap";

export default function BuyTicketsSection() {
  const mapContainerRef = useRef(null);

  const handleSignupClick = useCallback((e) => {
    e.preventDefault();
    const el = document.getElementById("signup");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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

    const currentContainer = mapContainerRef.current;
    injectWidgetScript(
      currentContainer,
      "https://gathr.com/assets/widgets/films/map.js",
      "two-sleepy-people"
    );

    // Cleanup in case the component unmounts (e.g., route changes, HMR)
    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = "";
        delete currentContainer.dataset.widgetLoaded;
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
          Buy Your Tickets Below! - In Theaters on{" "}
          <span className="underline">Dec 5th</span> For ONE-NIGHT-ONLY
        </h2>
        <p className="text-gray-800 text-xs md:text-sm my-4 font-medium uppercase leading-relaxed">
          <span className="font-semibold">
            You’ve Helped Unlock 30 Screenings Across the US!
          </span>{" "}
          Fill These ScreenIngS To Help Us Get INto Even More Theaters
          WorldWide! 🎟️
        </p>
      </div>
      <div className="w-full flex flex-col lg:flex-row justify-between gap-6 lg:gap-4">
        <div className="flex flex-col w-full lg:w-1/2 h-auto lg:max-h-[600px]">
          <div
            className="w-full bg-[#3C4959] rounded-lg border border-black overflow-hidden h-[500px] lg:flex-1"
            style={{ minHeight: "400px" }}
          >
            {/* <iframe
              src="https://gathr.com/widgets/films/two-sleepy-people/list?embed=1"
              className="w-full h-full"
              style={{
                border: 0,
                borderRadius: "5px",
              }}
              title="Gathr Film List"
            /> */}
            <TheaterTable />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            <a
              href="https://www.fandango.com/two-sleepy-people-2025-243090/movie-overview"
              target="_blank"
              rel="noreferrer"
            >
              <button className="mt-4 py-3 px-6 hover:bg-[#bd6826] transition rounded-[10px] underline border-2 text-white border-black text-xs font-semibold shadow-md bg-[#E1701C] w-full sm:w-auto">
                Find Showings On Fandango
              </button>
            </a>
            <a href="#signup">
              <button
                className="mt-4 sm:ml-4 py-3 px-6 hover:bg-[#436fa5] transition rounded-[10px] border-2 text-white border-black text-xs font-semibold shadow-md bg-[#598CCC] w-full sm:w-auto"
                onClick={handleSignupClick}
              >
                Don't See Showings Near Your City?
              </button>
            </a>
          </div>
        </div>
        <div className="flex flex-col w-full lg:w-1/2">
          {/* <div
            ref={mapContainerRef}
            className="rounded-lg border border-black overflow-hidden h-[500px] lg:h-[600px]"
            style={{ minHeight: "400px" }}
          /> */}
          <TheaterMap retroMode={false} />
        </div>
      </div>
    </section>
  );
}
