export default function SignupsCounter({ count = 0 }) {
  // Format the number with leading zeros, ensuring at least 7 digits
  const number = count.toString().padStart(7, "0");

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-12 lg:px-16 py-4 md:py-6 flex items-center justify-center">
      <div className="relative w-full flex items-center justify-center">
        <div className="flex w-full max-w-xs md:max-w-4xl items-center justify-center rounded-xl md:rounded-2xl bg-black border-white border-2 md:border-8 px-2 md:px-6 py-2 md:py-4 shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
          {/* Digits */}
          <div className="flex divide-x divide-white border-r border-white h-full">
            {number.split("").map((digit, idx) => (
              <div
                key={idx}
                className="flex h-6 md:h-12 w-5 md:w-8 items-center justify-center font-mono text-base md:text-3xl font-bold text-white"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Label */}
          <span className="ml-1.5 md:ml-3 font-mono text-white text-[10px] md:text-sm whitespace-nowrap">
            people joined
          </span>
        </div>
      </div>
    </div>
  );
}
