export default function Hero() {
  return (
    <section className="relative w-full h-[389px] md:h-[800px] overflow-hidden">
      {/* Background Image */}
      <video
        src="/images/twosleepymontage2.mp4"
        alt="Two Sleepy People"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      />

      {/* Overlay (optional dark fade for readability) */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Mobile Top Bar - Centered */}
      <div className="flex md:hidden justify-center items-center pt-[25px] px-4 absolute inset-x-0 top-0 w-full">
        <div className="flex flex-row items-center space-x-2">
          {/* Studio Logo */}
          <img src="/images/logo.png" alt="Camp Studios" className="h-[12px]" />
          <span className="text-[7px] uppercase text-white">
            A Camp Studios Production
          </span>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="justify-between items-start p-4 md:px-[144px] md:pt-12 absolute inset-x-0 top-0 w-full hidden md:flex flex-row">
        <div className="flex flex-row items-center space-x-2">
          {/* Studio Logo */}
          <img src="/images/logo.png" alt="Camp Studios" className="h-6" />
          <span className="text-xs uppercase text-white">
            A Camp Studios Production
          </span>
        </div>

        {/* Top Right Badge - Hidden on mobile */}
        <span className="bg-white rounded-full px-4 py-1 text-xs font-semibold tracking-wide uppercase">
          In Theaters Nationwide This Fall
        </span>
      </div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-10 md:px-4">
        {/* Film Title */}
        <h1
          className="bg-pink-600 textured-text border border-black border-w-[2px] max-h-[120px] text-white text-[28px] md:text-[72px] font-normal uppercase px-[13px] md:px-[76px] py-[10px] md:py-5 rounded"
          style={{
            fontFamily: "Grange Heavy, sans-serif",
            fontWeight: 900,
            lineHeight: "106%",
            letterSpacing: "-1%",
          }}
        >
          {/* Two Sleepy People */}
          <svg
            width="100%"
            height="52"
            viewBox="0 0 657 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="max-w-[320px] md:max-w-[657px] h-auto mx-auto"
          >
            <g filter="url(#filter0_g_1397_2)">
              <path
                d="M11.2245 49.9547V13.0367H1.08456V2.53969H36.7886V13.0367H26.7201V49.9547H11.2245ZM47.8948 49.8833L35.684 2.53969H51.8937L56.8209 30.0318L62.2479 2.53969H76.1725L81.0996 30.1032L85.5983 2.53969H99.0945L86.5267 49.8833H72.1022L67.0322 23.6765L61.8194 49.8833H47.8948ZM121.617 50.526C106.549 50.526 99.3372 43.5994 99.3372 26.1758C99.3372 8.82361 106.621 1.82561 121.617 1.82561C136.684 1.82561 143.896 8.6808 143.896 26.1758C143.896 43.6708 136.684 50.526 121.617 50.526ZM121.617 40.2432C125.972 40.2432 127.543 37.1726 127.543 26.1758C127.543 15.1075 125.972 11.9656 121.617 11.9656C117.189 11.9656 115.618 15.1075 115.618 26.1758C115.618 37.1726 117.189 40.2432 121.617 40.2432ZM181.889 50.5974C166.251 50.5974 160.253 45.813 163.181 35.1018H177.962C176.891 39.2435 178.105 41.2429 181.461 41.2429C184.389 41.2429 185.817 40.1004 185.817 37.7439C185.817 30.5317 162.895 32.3169 162.895 15.6788C162.895 6.89559 169.679 1.89702 181.318 1.89702C195.6 1.89702 201.527 6.53855 199.099 15.7502H185.317C185.96 12.5368 184.746 10.9659 181.889 10.9659C179.462 10.9659 178.319 11.9656 178.319 13.8222C178.319 21.2486 201.455 19.6777 201.455 35.7445C201.455 45.7416 195.1 50.5974 181.889 50.5974ZM205.956 49.8833V2.53969H221.595V39.2435H234.662V49.8833H205.956ZM238.575 49.8833V2.53969H271.137V13.0367H254.142V21.1058H266.496V31.0315H254.142V39.3149H271.494V49.8833H238.575ZM276.494 49.8833V2.53969H309.056V13.0367H292.061V21.1058H304.415V31.0315H292.061V39.3149H309.413V49.8833H276.494ZM314.413 49.9547V2.53969H332.408C348.403 2.53969 353.83 7.25264 353.83 19.3206C353.83 31.3172 348.189 36.53 333.193 36.53H329.98V49.9547H314.413ZM329.98 26.39H332.336C335.764 26.39 337.478 24.819 337.478 19.3206C337.478 14.0364 335.978 12.6797 332.336 12.6797H329.98V26.39ZM367.21 49.8833V37.2441L352.572 2.53969H370.424L376.922 23.9621L382.849 2.53969H398.559L382.849 37.1726V49.8833H367.21ZM416.454 49.9547V2.53969H434.449C450.444 2.53969 455.871 7.25264 455.871 19.3206C455.871 31.3172 450.23 36.53 435.234 36.53H432.021V49.9547H416.454ZM432.021 26.39H434.378C437.805 26.39 439.519 24.819 439.519 19.3206C439.519 14.0364 438.019 12.6797 434.378 12.6797H432.021V26.39ZM461.067 49.8833V2.53969H493.63V13.0367H476.634V21.1058H488.988V31.0315H476.634V39.3149H493.987V49.8833H461.067ZM518.292 50.526C503.224 50.526 496.012 43.5994 496.012 26.1758C496.012 8.82361 503.296 1.82561 518.292 1.82561C533.359 1.82561 540.571 8.6808 540.571 26.1758C540.571 43.6708 533.359 50.526 518.292 50.526ZM518.292 40.2432C522.647 40.2432 524.218 37.1726 524.218 26.1758C524.218 15.1075 522.647 11.9656 518.292 11.9656C513.864 11.9656 512.293 15.1075 512.293 26.1758C512.293 37.1726 513.864 40.2432 518.292 40.2432ZM545.692 49.9547V2.53969H563.687C579.682 2.53969 585.109 7.25264 585.109 19.3206C585.109 31.3172 579.468 36.53 564.472 36.53H561.259V49.9547H545.692ZM561.259 26.39H563.615C567.043 26.39 568.757 24.819 568.757 19.3206C568.757 14.0364 567.257 12.6797 563.615 12.6797H561.259V26.39ZM590.305 49.8833V2.53969H605.943V39.2435H619.011V49.8833H590.305ZM622.924 49.8833V2.53969H655.486V13.0367H638.491V21.1058H650.845V31.0315H638.491V39.3149H655.843V49.8833H622.924Z"
                fill="white"
              />
            </g>
            <defs>
              <filter
                id="filter0_g_1397_2"
                x="-0.00146806"
                y="0.739255"
                width="656.931"
                height="50.9443"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.92044669389724731 0.92044669389724731"
                  numOctaves="3"
                  seed="571"
                />
                <feDisplacementMap
                  in="shape"
                  scale="2.1728579998016357"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  result="displacedImage"
                  width="100%"
                  height="100%"
                />
                <feMerge result="effect1_texture_1397_2">
                  <feMergeNode in="displacedImage" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </h1>
        <p
          className="mt-[10px] md:mt-[22px] text-[19px] md:text-[41px] inline-block text-white"
          style={{
            fontWeight: 500,
            lineHeight: "106%",
            letterSpacing: "-17%",
          }}
        >
          THE ROAD TO
          <img
            src="/images/counter.png"
            alt="Two Sleepy People"
            className="inline-block h-12 md:h-20"
          />
          THEATERS
        </p>
        {/* Mobile Badge - Only visible on mobile */}
        <div className="mt-2 md:hidden">
          <span className="bg-white rounded-full px-10 py-1 text-[9.5px] font-semibold tracking-wide uppercase">
            In Theaters Nationwide This Fall
          </span>
        </div>
      </div>
    </section>
  );
}
