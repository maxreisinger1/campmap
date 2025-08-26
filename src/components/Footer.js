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
    <div className="max-w-7xl w-full mx-auto px-8 md:px-12 lg:px-16 pb-8 mt-2">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden">
        {/* Follow along section first on mobile */}
        <div className="text-xs font-mono text-center">
          <div className="mb-2">Follow along the Camp Studios journey:</div>
          <div className="flex flex-col items-center gap-2">
            <span className="font-semibold italic underline">Instagram</span>
            <span className="font-semibold italic underline">Youtube</span>
            <span className="font-semibold italic underline">Discord</span>
          </div>
        </div>

        {/* Copyright text second on mobile */}
        <div className="text-xs font-mono opacity-70 text-center">
          © {new Date().getFullYear()} Camp Studios — All vibes reserved.
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row md:items-start gap-3 justify-between">
        <div className="text-xs font-mono opacity-70">
          © {new Date().getFullYear()} Camp Studios — All vibes reserved.
        </div>
        <div className="text-xs flex flex-row font-mono">
          <span className="mr-4">Follow along the Camp Studios journey:</span>
          <span className="font-semibold italic underline">Instagram</span>
          <div className="h-4 w-[2px] mx-4 bg-black" />
          <span className="font-semibold italic underline">Youtube</span>
          <div className="h-4 w-[2px] mx-4 bg-black" />
          <span className="font-semibold italic underline">Discord</span>
        </div>
      </div>
    </div>
  );
}
