export default function FAQSection() {
  return (
    <section
      id="faq"
      className="border-t-[5px] border-b-[5px] border-dashed border-[#D42568]/30 py-8 md:py-10 font-sans max-w-7xl mx-auto pb-12 md:pb-16 px-4 md:px-12 lg:px-16 overflow-x-hidden flex flex-col gap-6"
    >
      <h2 className="text-center text-[#D7266A] font-bold text-2xl md:text-3xl mb-6 md:mb-10 tracking-wide uppercase">
        Frequently Asked Questions
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 justify-between">
        {/* Left Column */}
        <div className="flex flex-col space-y-6 md:space-y-8 flex-1">
          <div>
            <h3 className="w-full text-center bg-[#1F2937] uppercase text-white font-bold text-xs md:text-sm rounded-md px-3 md:px-4 py-2 inline-block">
              WILL THE MOVIE BE ON STREAMING?
            </h3>
            <p className="mt-6 text-[#3C3C3C] text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
              We don’t have a streaming deal yet... So for now, it’s exclusive
              playing in theaters! We want to give everyone the chance to watch
              the movie and will be expanding to international markets (in
              theaters) based on demand with our map below.
            </p>
          </div>

          <div>
            <h3 className="w-full text-center bg-[#1F2937] uppercase text-white font-bold text-xs md:text-sm rounded-md px-3 md:px-4 py-2 inline-block">
              HOW WAS THIS MOVIE MADE?
            </h3>
            <p className="mt-6 text-[#3C3C3C] text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
              This film was produced and distributed by Camp Studios, the film
              and production arm of Creator Camp. We met Baron and Caroline at
              one of our events 2 years ago, saw their talent, and wanted to
              bring their vision to life on the big screen.
            </p>
          </div>
        </div>

        <div className="hidden lg:block h-full w-[1px] bg-[#D7266A]" />

        {/* Right Column */}
        <div className="flex flex-col space-y-6 md:space-y-8 flex-1">
          <div>
            <h3 className="w-full text-center bg-[#1F2937] uppercase text-white font-bold text-xs md:text-sm rounded-md px-3 md:px-4 py-2 inline-block">
              WHAT IS TWO SLEEPY PEOPLE ABOUT?
            </h3>
            <p className="mt-6 text-[#3C3C3C] text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
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
            <p className="mt-6 text-[#3C3C3C] text-xs md:text-sm leading-relaxed max-w-full lg:max-w-md">
              We are a small team of 6 trying our best to get this movie as far
              as we can. We have no big studio backing, film industry
              experience, or marketing budget. Every time one of you buys a
              ticket, leaves a review, or tells a friend about the movie, it
              helps us get this movie further out into the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
