import { useState, useCallback } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSmoothScroll = useCallback((e, targetId) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false); // Close mobile menu after clicking
    }
  }, []);

  return (
    <nav className="h-20 border-b-2 border-black fixed z-50 w-full flex items-center justify-between px-4 md:px-8 text-white bg-[#D42568] sm:bg-[#0F0E10] shadow-md">
      <a href="/" className="flex items-center">
        <img
          src="/images/logo.png"
          alt="Two Sleepy People Logo"
          className="h-4"
        />
      </a>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-row gap-3">
        <a
          href="https://campstudios.com/"
          target="_blank"
          rel="noreferrer"
          className="bg-[#30231A] border border-black rounded-full px-8 py-1 text-white underline font-medium hover:bg-gray-200 transition"
        >
          Camp Studios
        </a>
        <a
          href="#about-the-film"
          onClick={(e) => handleSmoothScroll(e, "about-the-film")}
          className="bg-[#30231A] border border-black rounded-full px-8 py-1 text-white font-medium hover:bg-gray-200 transition"
        >
          About The Film
        </a>
        <a
          href="https://tickets.twosleepypeople.com/"
          // onClick={(e) => handleSmoothScroll(e, "signup")}
          className="bg-[#D42568] border border-black rounded-full px-8 py-1 text-white font-medium hover:bg-gray-200 transition"
        >
          Buy Tickets
        </a>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMenuOpen ? "rotate-45 translate-y-2" : ""
          }`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMenuOpen ? "opacity-0" : ""
          }`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isMenuOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        ></span>
      </button>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-20 left-0 w-full bg-[#D42568] border-b-2 border-black transition-all duration-300 ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col gap-4 p-6">
          <a
            href="https://campstudios.com/"
            target="_blank"
            rel="noreferrer"
            className="bg-white border border-black rounded-full px-8 py-3 text-black underline font-semibold hover:bg-gray-200 transition text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Camp Studios
          </a>
          <a
            href="#about-the-film"
            onClick={(e) => handleSmoothScroll(e, "about-the-film")}
            className="bg-white border border-black rounded-full px-8 py-3 text-black underline font-semibold hover:bg-gray-200 transition text-center"
          >
            About The Film
          </a>
          <a
            href="https://tickets.twosleepypeople.com/"
            // onClick={(e) => handleSmoothScroll(e, "signup")}
            className="bg-white border border-black rounded-full px-8 py-3 text-black underline font-semibold hover:bg-gray-200 transition text-center"
          >
            Buy Tickets
          </a>
        </div>
      </div>
    </nav>
  );
}
