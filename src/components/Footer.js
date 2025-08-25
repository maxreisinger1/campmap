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
    <div className="max-w-7xl mx-auto px-4 pb-8 mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
      <div className="text-xs font-mono opacity-70">
        © {new Date().getFullYear()} Camp Studios — All vibes reserved.
      </div>
      <div className="text-xs font-mono">
        Roadmap: <span className="underline">Global postcode geocoding</span> •{" "}
        <span className="underline">Auth + DB (Supabase)</span> •{" "}
        <span className="underline">Spam protection</span> •{" "}
        <span className="underline">Public city pages</span>
      </div>
    </div>
  );
}
