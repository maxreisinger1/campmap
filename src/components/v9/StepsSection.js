import { useState } from "react";
import GlobeMap from "../GlobeMap";
import SignupsCounter from "../SignupsCounter";
import { useCityPins } from "../../hooks/useCityPins";

export default function StepsSection({ signupCount, onOpenCreditsModal }) {
  const [rotate, setRotate] = useState([0, 0, 0]);
  const [zoom, setZoom] = useState(1.15);
  const { pins } = useCityPins();

  const theme = {
    ocean: "#e7f6f2",
    land: "#d2d2d2",
    stroke: "#111",
    fontFamily: "inherit",
  };

  return (
    <section className="w-full min-h-[800px] relative bg-[#111111] mx-auto py-8 md:py-10 pb-12 md:pb-32 px-4 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-white text-start uppercase font-bold tracking-tight items-center gap-4 sm:inline-flex hidden">
            <span
              className="text-[70px] text-center font-bold opacity-[0.6]"
              style={{
                fontFamily: "'Adobe Garamond Pro', serif",
              }}
            >
              2
            </span>
            <span className="font-semibold text-[30px] tracking-wider">
              The World’s First Movie With 100,000 Producers
            </span>
          </h2>

          <h2 className="text-white w-full justify-center flex flex-col text-center uppercase font-bold tracking-tight items-center sm:hidden">
            <span
              className="text-[28px] text-center font-bold opacity-[0.6]"
              style={{
                fontFamily: "'Adobe Garamond Pro', serif",
              }}
            >
              2.
            </span>
            <span
              className="font-bold text-[28px] tracking-tighter"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              The World’s First Movie With 100,000 Producers
            </span>
          </h2>

          <div className="w-full hidden sm:block">
            <SignupsCounter count={signupCount} />
          </div>

          <div className="flex flex-col max-w-7xl mx-auto lg:flex-row gap-8 mt-8 sm:px-0 px-8">
            <div className="text-white flex flex-col gap-4 lg:w-1/2 font-normal sm:text-base text-xs uppercase">
              <p>
                On JanuAry 23rd, TWo Sleepy People Has The Chance to Play In 500
                Theaters Worldwide.
              </p>

              <p>But, We Need Your Help To Make Film History.</p>

              <p className="flex flex-col gap-1">
                <span className="font-bold">
                  1. Follow{" "}
                  <a
                    href="https://www.instagram.com/creatorcamp/"
                    className="underline"
                  >
                    @CreatorCamp
                  </a>
                </span>
                <br />
                <span className="font-bold">
                  2. Follow{" "}
                  <a
                    href="https://www.instagram.com/twosleepymovie/"
                    className="underline"
                  >
                    @TwoSleepyMovie
                  </a>
                </span>
                <br />
                <span>
                  <span className="font-bold">
                    3. Sign Up Below To Get In The Credits
                  </span>
                  <br />
                  (Deadline: January 13Th)
                </span>
                <br />
                <span className="font-bold">
                  4. Get Tickets To The Movie :)
                </span>
              </p>

              <p>
                We’ll Be Exposing How This INdustry Actually works & SENDING You
                THE EXACT BLUEPRINT FOR HOW we BRoKe INTO HOLLYWOOD.
              </p>
            </div>

            {/* Buttons - mobile */}
            <div className="flex-col gap-4 w-full flex sm:hidden">
              <button
                type="button"
                onClick={onOpenCreditsModal}
                className=" w-full px-8 py-3 md:px-10 bg-[#DB286D] hover:bg-[#DB286D] text-white border border-white font-semibold uppercase rounded-full transition-colors duration-200 text-[11px]"
              >
                Sign Up & Get Your Name IN The Credits
              </button>
              <a
                href="https://tickets.twosleepypeople.com/"
                className="w-full"
                target="_blank"
                rel="noreferrer"
              >
                <button className=" w-full px-8 py-3 md:px-10 bg-transparent border-2 border-[#DB286D] bg-white text-black hover:bg-white hover:text-black font-semibold uppercase rounded-full transition-colors duration-200 text-xs">
                  Tickets OUT NOW For JAN 23RD!
                </button>
              </a>
            </div>

            <div className="w-full block sm:hidden">
              <SignupsCounter count={signupCount} />
            </div>

            <div className="w-full lg:w-1/2 h-[500px]">
              <GlobeMap
                rotate={rotate}
                setRotate={setRotate}
                zoom={zoom}
                setZoom={setZoom}
                retroMode={false}
                theme={theme}
                submissions={pins || []}
                jitter={0.1}
                cursor="grab"
                hasSubmitted={false}
              />
            </div>
          </div>
        </div>

        {/* Buttons - desktop */}
        <div className="flex-row gap-8 w-full hidden sm:flex">
          <button
            type="button"
            onClick={onOpenCreditsModal}
            className=" w-full px-8 py-3 md:px-10 bg-[#DB286D] hover:bg-[#DB286D] text-white border border-white font-semibold uppercase rounded-full transition-colors duration-200 text-sm"
          >
            Sign Up & Get Your Name IN The Credits
          </button>
          <a
            href="https://tickets.twosleepypeople.com/"
            className="w-full"
            target="_blank"
            rel="noreferrer"
          >
            <button className=" w-full px-8 py-3 md:px-10 bg-transparent border-2 border-[#DB286D] bg-white text-black hover:bg-white hover:text-black font-semibold uppercase rounded-full transition-colors duration-200 text-sm">
              Tickets OUT NOW For JAN 23RD!
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
