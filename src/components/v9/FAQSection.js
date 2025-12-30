export default function FAQSection() {
  return (
    <section
      id="faq"
      className="bg-[#0C0F10] w-full h-full py-8 md:py-10 font-sans mx-auto pb-12 md:pb-16 px-4 md:px-12 lg:px-16 overflow-x-hidden flex flex-col gap-6 justify-center items-center"
    >

      <div className="sm:hidden w-full border-dashed border-4 border-[#DB286D]/30" />

      <h2 className="text-white text-start uppercase font-bold tracking-tight items-center gap-4 sm:inline-flex hidden">
        <span
          className="text-[70px] text-center font-bold opacity-[0.6]"
          style={{
            fontFamily: "'Adobe Garamond Pro', serif",
          }}
        >
          4
        </span>
        <span className="font-semibold text-[38px] tracking-wider">
          Frequently Asked Questions
        </span>
      </h2>

      <h2 className="text-white w-full justify-center flex flex-col text-center uppercase font-bold tracking-tight items-center sm:hidden">
        <span
          className="text-[28px] text-center font-bold opacity-[0.6]"
          style={{
            fontFamily: "'Adobe Garamond Pro', serif",
          }}
        >
          4.
        </span>
        <span
          className="font-bold text-[28px] tracking-tighter"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Frequently Asked Questions
        </span>
      </h2>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 justify-between">
        {/* Left Column */}
        <div className="flex flex-col space-y-6 md:space-y-8 flex-1">
          <div>
            <h3 className="w-full text-center bg-[#1F2937] uppercase text-white font-bold text-xs md:text-sm rounded-md px-3 md:px-4 py-2 inline-block">
              WILL THE MOVIE BE ON STREAMING?
            </h3>
            <p className="mt-6 text-white text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
              We don’t have a streaming deal yet... So for now, it’s exclusive
              playing in theaters! We want to give everyone the chance to watch
              the movie and will be expanding to international markets (in
              theaters) next February based on demand on our map above.
            </p>
          </div>

          <div>
            <h3 className="w-full text-center bg-[#1F2937] uppercase text-white font-bold text-xs md:text-sm rounded-md px-3 md:px-4 py-2 inline-block">
              HOW WAS THIS MOVIE MADE?
            </h3>
            <p className="mt-6 text-white text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
              This film was produced and distributed by Camp Studios, the film
              and production arm of Creator Camp. We met Baron and Caroline at
              one of our events 2 years ago, saw their talent, and wanted to
              bring their vision to life on the big screen.
            </p>
          </div>

          <div>
            <h3 className="w-full text-center bg-[#1F2937] uppercase text-white font-bold text-xs md:text-sm rounded-md px-3 md:px-4 py-2 inline-block">
              WILL THIS PLAY INTERNATIONALLY?
            </h3>
            <p className="mt-6 text-white text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
              YES. On January 23rd, Two Sleepy People will start playing
              primarily in theaters across North America (USA & Canada). But, in
              early February, it’ll start rolling out to more international
              theaters in Europe & Austrailia.
              <br />
              <br />
              If you want to watch this movie in YOUR COUNTRY, sign up on our
              list above. Demand helps more theaters accept us!
            </p>
          </div>
          <a
            href="https://www.creatorcamp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full hidden sm:block"
          >
            <button className=" w-full px-8 py-3 md:px-10 bg-white underline hover:bg-[#D81B60] text-black border border-white font-semibold uppercase rounded-full transition-colors duration-200 text-sm">
              READ MORE ABOUT CREATOR CAMP
            </button>
          </a>
        </div>

        <div className="w-[1px] bg-white " />

        {/* Right Column */}
        <div className="flex flex-col space-y-6 md:space-y-8 flex-1">
          <div>
            <h3 className="w-full text-center bg-[#1F2937] uppercase text-white font-bold text-xs md:text-sm rounded-md px-3 md:px-4 py-2 inline-block">
              WHAT IS TWO SLEEPY PEOPLE ABOUT?
            </h3>
            <p className="mt-6 text-white text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
              Two Sleepy People is a romantic comedy that will make you laugh
              and cry in the span of a few minutes. It’s a story that explores
              themes of relationships, attachment styles, and overcoming your
              past in order to become your most honest self.
            </p>
          </div>

          <div>
            <h3 className="w-full text-center bg-[#1F2937] uppercase text-white font-bold text-xs md:text-sm rounded-md px-3 md:px-4 py-2 inline-block">
              HOW CAN I HELP?
            </h3>
            <p className="mt-6 text-white text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
              We are a small team of 6 trying our best to get this movie as far
              as we can. There are 3 big ways you can join the team to support:
              <ul>
                <li className="mt-2">
                  <span className="font-bold">1. Sign up</span>
                  <br />
                  This helps show theaters near you there’s real interest and
                  allows us to secure more showtimes for January 23.
                  <br />
                  <br />
                  <span>You’ll also get:</span>
                  <ul>
                    <li className="mt-1">
                      • updates on how the release is actually going
                    </li>
                    <li className="mt-1">
                      • behind-the-scenes context on how this movie made it to
                      theaters
                    </li>
                    <li className="mt-1">
                      • alerts when tickets are available near you
                    </li>
                  </ul>
                </li>
                <br />
                <li className="mt-2">
                  <span className="font-bold">
                    2. Show up opening weekend (January 23)
                  </span>
                  <br />
                  Opening weekend matters more than anything. Strong attendance
                  is what keeps the movie in theaters and helps it expand.
                </li>
                <br />
                <li className="mt-2">
                  <span className="font-bold">3. Share it with friends</span>
                  <br />
                  If this idea resonates, tell people you’d actually want to see
                  it with. Word of mouth is what makes this possible.
                </li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
