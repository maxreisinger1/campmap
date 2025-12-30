export default function HollywoodSection() {
  return (
    <section className="w-full h-[480px] sm:h-[800px] relative bg-[#DB286D] mx-auto py-8 md:py-10 pb-12 md:pb-32 px-4 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="flex flex-col items-start">
          <h2 className="text-white text-start uppercase font-bold tracking-tight items-center gap-4 sm:inline-flex hidden">
            <span
              className="text-[70px] text-start font-bold opacity-[0.6]"
              style={{
                fontFamily: "'Adobe Garamond Pro', serif",
              }}
            >
              1
            </span>
            <span
              className="font-bold text-[38px] tracking-tighter"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              HOLLYWOOD IS BROKEN.
            </span>
          </h2>

          <h2 className="text-white w-full justify-center flex flex-col text-center uppercase font-bold tracking-tight items-center sm:hidden">
            <span
              className="text-[28px] text-center font-bold opacity-[0.6]"
              style={{
                fontFamily: "'Adobe Garamond Pro', serif",
              }}
            >
              1.
            </span>
            <span
              className="font-bold text-[28px] tracking-tighter"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              HOLLYWOOD IS BROKEN.
            </span>
          </h2>

          <div className="max-w-lg w-full flex flex-col gap-6 text-white text-start uppercase mt-4 sm:mt-0 sm:text-base text-xs font-normal sm:px-0 px-4">
            <p>
              While Studios spend <span className="font-bold">millions</span> on
              Sequels, Reboots, and Never-ending Streaming Wars, Most{" "}
              <span className="font-bold">original films</span> never get a Fair
              chance Anymore.
            </p>

            <p>
              So, We Made A Movie To Prove ThAT THERE'S STILL HOPE IN The Future
              Of Storytelling.
            </p>

            <p className="font-bold">HERE'S THE PLAN....</p>
          </div>
        </div>
      </div>

      <div className="absolute w-full left-0 bottom-0 h-[80px] sm:h-[170px] bg-gradient-to-t from-[#DB286D] via-[#DB286D]/85 to-transparent z-10" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-fit max-w-7xl w-full mx-auto">
        <div className="relative w-full h-full flex justify-between">
          <img
            src="/images/v9/reel-ss-image.png"
            alt="Hollywood is broken"
            className="absolute bottom-4 sm:bottom-10 w-[90px] sm:w-[250px] left-0 sm:left-16 rounded-lg object-cover rotate-[-10deg]"
          />
          <img
            src="/images/v9/cinema-image.png"
            alt="Hollywood is broken"
            className="absolute bottom-0 h-[150px] sm:h-[450px] left-1/2 transform -translate-x-1/2 object-cover"
          />
          <img
            src="/images/v9/poster-image.png"
            alt="Hollywood is broken"
            className="absolute bottom-4 w-[90px] sm:w-[240px] right-0 sm:right-20 z-2 rounded-lg object-cover rotate-12"
          />
        </div>
      </div>
    </section>
  );
}
