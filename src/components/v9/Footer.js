/**
 * @fileoverview Footer component with copyright and roadmap information
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Footer component displaying copyright information and development roadmap.
 *
 * Shows the current year copyright notice and upcoming features planned
 * for the application. The layout is responsive, stacking vertically on
 * mobile devices and horizontally on larger screens.
 *
 * @component
 * @returns {JSX.Element} Footer with copyright and roadmap
 *
 * @example
 * ```javascript
 * <Footer />
 * ```
 */
export default function Footer() {
  return (
    <div className="bg-[#0C0F10] flex flex-col gap-5 sm:flex-row items-center justify-center w-full mx-auto px-8 md:px-12 lg:px-16 pb-8">
      <a
        href="https://www.creatorcamp.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="sm:hidden w-full mt-4"
      >
        <button className=" w-full px-8 py-3 md:px-10 bg-white underline hover:bg-[#D81B60] text-black border border-white font-semibold uppercase rounded-full transition-colors duration-200 text-sm">
          READ MORE ABOUT CREATOR CAMP
        </button>
      </a>
      <span className="uppercase text-white font-semibold my-0 sm:my-[32px] text-[14px]">
        A Camp Studios Project | 2025/2026
      </span>
    </div>
  );
}
