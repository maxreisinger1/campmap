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
    <div className="max-w-7xl w-full mx-auto px-4 pb-8 mt-2 flex flex-row items-start gap-3 justify-between">
      <div className="text-xs font-mono opacity-70">
        © {new Date().getFullYear()} Camp Studios — All vibes reserved.
      </div>
      <div className="text-xs flex flex-row font-mono">
        <span className="mr-4">Follow along the Camp Studios journey:</span>
        <span className="font-medium underline">Instagram</span>
        <div className="h-4 w-[2px] mx-4 bg-black" />
        <span className="font-medium underline">Youtube</span>
        <div className="h-4 w-[2px] mx-4 bg-black" />
        <span className="font-medium underline">Discord</span>
      </div>
    </div>
  );
}
