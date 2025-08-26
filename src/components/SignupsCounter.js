export default function SignupsCounter({ count = 0 }) {
  // Format the number with leading zeros, ensuring at least 7 digits
  const number = count.toString().padStart(7, "0");

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-12 lg:px-16 py-6">
      <div className="relative w-full flex items-center justify-center">
        <div className="flex w-full max-w-sm md:max-w-4xl items-center rounded-2xl bg-black border-white border-4 md:border-8 px-3 md:px-6 py-3 md:py-4 shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
          {/* Digits */}
          <div className="flex divide-x divide-white border-r border-white h-full">
            {number.split("").map((digit, idx) => (
              <div
                key={idx}
                className="flex h-8 md:h-12 w-6 md:w-8 items-center justify-center font-mono text-lg md:text-3xl font-bold text-white"
              >
                {digit}
              </div>
            ))}
          </div>

          {/* Label */}
          <span className="ml-2 md:ml-3 font-mono text-white text-xs md:text-sm">
            pins dropped.
          </span>
        </div>
      </div>
    </div>
  );
}
