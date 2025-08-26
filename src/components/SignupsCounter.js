export default function SignupsCounter({ count = 0 }) {
  // Format the number with leading zeros, ensuring at least 7 digits
  const number = count.toString().padStart(7, "0");

  return (
    <div className="relative w-full my-6 flex items-center justify-center">
      <div className="flex max-w-7xl items-center rounded-2xl bg-black border-white border-8 px-6 py-4 shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
        {/* Digits */}
        <div className="flex divide-x divide-white border-r border-white h-full">
          {number.split("").map((digit, idx) => (
            <div
              key={idx}
              className="flex h-12 w-8 items-center justify-center font-mono text-3xl font-bold text-white"
            >
              {digit}
            </div>
          ))}
        </div>

        {/* Label */}
        <span className="ml-3 font-mono text-white text-sm">pins dropped.</span>
      </div>
    </div>
  );
}
