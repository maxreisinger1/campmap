import countries from "world-countries";

/**
 * @fileoverview Signup form component for user registration and location input
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Signup form component for collecting user information and ZIP code.
 *
 * Provides input fields for name, email, phone, and ZIP code with form validation
 * and submission handling. The form adapts its styling based on retro mode
 * and displays appropriate loading and error states.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.form - Form data object
 * @param {string} props.form.name - User's name
 * @param {string} props.form.email - User's email
 * @param {string} props.form.zip - User's ZIP code
 * @param {string} [props.form.phone] - User's phone number (optional)
 * @param {Function} props.setForm - Function to update form data
 * @param {Function} props.handleSubmit - Form submission handler
 * @param {string|null} props.fatal - Fatal error message if any
 * @param {boolean} props.retroMode - Whether retro styling is enabled
 * @param {boolean} [props.loading=false] - Whether form is in loading state
 * @returns {JSX.Element} Signup form with validation and styling
 *
 * @example
 * ```javascript
 * <SignupForm
 *   form={formData}
 *   setForm={setFormData}
 *   handleSubmit={handleFormSubmit}
 *   fatal={errorMessage}
 *   retroMode={isRetroMode}
 *   loading={isSubmitting}
 * />
 * ```
 */
export default function SignupForm({
  form,
  setForm,
  handleSubmit,
  fatal,
  retroMode,
  loading = false,
}) {
  // Build dropdown options: ISO Alpha-2 + country name
  const countryOptions = countries
    .map((c) => ({
      code: c.cca2, // e.g., "US"
      name: c.name.common, // e.g., "United States"
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Default to US if not set
  const selectedCountry = form.country || "US";

  // Postal code validation (just check it's non-empty)
  function validatePostalCode(code) {
    return code.trim().length > 0;
  }

  return (
    <div
      id="signup-form"
      className="relative max-w-4xl w-full rounded-2xl p-3 md:p-5 border border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,0.6)] md:shadow-[8px_8px_0_0_rgba(0,0,0,0.6)] text-start"
    >
      <div className="absolute -top-2 -left-2 h-4 w-4 bg-black" />
      <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-black" />

      <h2 className="text-lg md:text-2xl font-extrabold tracking-wider">
        Bring Two Sleepy People To{" "}
        <span className="underline decoration-black">Your City:</span>
      </h2>
      <p className="text-[10px] md:text-xs pb-3 md:pb-[24px] pt-2 md:pt-[12px]">
        We'll notify you of when & where the showings will be soon.{" "}
        <span className="font-bold">Every pin counts!</span>
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!validatePostalCode(form.zip)) {
            setForm({
              ...form,
              fatal: "Please enter a valid postal code.",
            });
            return;
          }
          if (form.fatal) setForm({ ...form, fatal: null });
          handleSubmit(e);
        }}
        className="flex flex-col gap-3 md:gap-[16px] mb-6 md:mb-[40px]"
      >
        {/* Name */}
        <div>
          <label
            className={`block text-[10px] md:text-xs font-bold uppercase mb-1 ${
              retroMode ? "blink" : ""
            }`}
          >
            Name
          </label>
          <input
            className={`w-full rounded-md border ${
              retroMode
                ? "border-black bg-[#fffef4]"
                : "border-black/40 bg-[#fffcf5]"
            } px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value, fatal: null })
            }
          />
        </div>

        {/* Email */}
        <div>
          <label
            className={`block text-[10px] md:text-xs font-bold uppercase mb-1 ${
              retroMode ? "blink" : ""
            }`}
          >
            Email
          </label>
          <input
            className={`w-full rounded-md border ${
              retroMode
                ? "border-black bg-[#fffef4]"
                : "border-black/40 bg-[#fffcf5]"
            } px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value, fatal: null })
            }
          />
        </div>

        {/* Phone */}
        <div>
          <label
            className={`block text-[10px] md:text-xs font-bold uppercase mb-1 ${
              retroMode ? "blink" : ""
            }`}
          >
            Phone (optional)
          </label>
          <input
            className={`w-full rounded-md border ${
              retroMode
                ? "border-black bg-[#fffef4]"
                : "border-black/40 bg-[#fffcf5]"
            } px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="e.g. +1 555 123 4567"
            value={form.phone || ""}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value, fatal: null })
            }
            type="tel"
            inputMode="tel"
            autoComplete="tel"
          />
        </div>

        {/* Country */}
        <div>
          <label
            className={`block text-[10px] md:text-xs font-bold uppercase mb-1 ${
              retroMode ? "blink" : ""
            }`}
          >
            Country
          </label>
          <select
            className={`w-full rounded-md border ${
              retroMode
                ? "border-black bg-[#fffef4]"
                : "border-black/40 bg-[#fffcf5]"
            } px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            value={selectedCountry}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value, fatal: null })
            }
          >
            {countryOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* ZIP / Postal Code */}
        <div>
          <label
            className={`block text-[10px] md:text-xs font-bold uppercase mb-1 ${
              retroMode ? "blink" : ""
            }`}
          >
            ZIP / Postal Code
          </label>
          <input
            className={`w-full rounded-md border ${
              retroMode
                ? "border-black bg-[#fffef4]"
                : "border-black/40 bg-[#fffcf5]"
            } px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="Enter your postal code"
            value={form.zip}
            onChange={(e) =>
              setForm({
                ...form,
                zip: e.target.value,
                fatal: null,
              })
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md border-2 border-black px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba] text-black"
                : "bg-[#D42568] hover:bg-[#A61D4D] text-white"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading && (
              <span className="inline-block w-3 md:w-4 h-3 md:h-4 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin"></span>
            )}
            {loading ? "Processing..." : "Drop Pin"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({
                name: "",
                email: "",
                phone: "",
                zip: "",
                country: "US",
              });
            }}
            className={`rounded-md border-2 border-black px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              retroMode
                ? "bg-white hover:bg-amber-50"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Clear
          </button>
        </div>

        {/* Errors */}
        {fatal && (
          <div className="mt-2 text-[10px] md:text-xs font-mono text-rose-700">
            Error: {fatal}
          </div>
        )}
      </form>
    </div>
  );
}
