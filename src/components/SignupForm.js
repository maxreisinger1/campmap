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
  // All countries supported by Zippopotam.us with postal code regex
  const countries = [
    { code: "US", name: "United States", regex: /^\d{5}(-\d{4})?$/ },
    { code: "AR", name: "Argentina", regex: /^(AR)?\d{4}[A-Za-z]{0,3}$/i },
    { code: "AT", name: "Austria", regex: /^\d{4}$/ },
    { code: "AU", name: "Australia", regex: /^\d{4}$/ },
    { code: "BE", name: "Belgium", regex: /^\d{4}$/ },
    { code: "BG", name: "Bulgaria", regex: /^\d{4}$/ },
    {
      code: "CA",
      name: "Canada",
      regex: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    },
    { code: "CH", name: "Switzerland", regex: /^\d{4}$/ },
    { code: "CZ", name: "Czech Republic", regex: /^\d{3} ?\d{2}$/ },
    { code: "DE", name: "Germany", regex: /^\d{5}$/ },
    { code: "DK", name: "Denmark", regex: /^\d{4}$/ },
    { code: "ES", name: "Spain", regex: /^\d{5}$/ },
    { code: "FI", name: "Finland", regex: /^\d{5}$/ },
    { code: "FR", name: "France", regex: /^\d{5}$/ },
    {
      code: "GB",
      name: "United Kingdom",
      regex: /^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/,
    },
    { code: "HU", name: "Hungary", regex: /^\d{4}$/ },
    {
      code: "IE",
      name: "Ireland",
      regex: /^[A-Za-z]\d{2}|D6W\s[A-Za-z0-9]{4}$/,
    },
    { code: "IT", name: "Italy", regex: /^\d{5}$/ },
    { code: "JP", name: "Japan", regex: /^\d{3}-\d{4}$/ },
    { code: "LI", name: "Liechtenstein", regex: /^\d{4}$/ },
    { code: "MX", name: "Mexico", regex: /^\d{5}$/ },
    { code: "NL", name: "Netherlands", regex: /^\d{4} ?[A-Za-z]{2}$/ },
    { code: "NO", name: "Norway", regex: /^\d{4}$/ },
    { code: "NZ", name: "New Zealand", regex: /^\d{4}$/ },
    { code: "PL", name: "Poland", regex: /^\d{2}-\d{3}$/ },
    { code: "PT", name: "Portugal", regex: /^\d{4}-\d{3}$/ },
    { code: "RU", name: "Russia", regex: /^\d{6}$/ },
    { code: "SE", name: "Sweden", regex: /^\d{3} ?\d{2}$/ },
    { code: "SK", name: "Slovakia", regex: /^\d{3} ?\d{2}$/ },
    { code: "TR", name: "Turkey", regex: /^\d{5}$/ },
  ];

  // Default to US if not set
  const selectedCountry = form.country || "US";

  // Postal code validation
  function validatePostalCode(code, countryCode) {
    const country = countries.find((c) => c.code === countryCode);
    if (!country) return true; // Accept if country not found
    return country.regex.test(code);
  }

  return (
    <div id="signup-form" className="relative max-w-4xl rounded-2xl p-4 md:p-5 border border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.6)]">
      <div className="absolute -top-2 -left-2 h-4 w-4 bg-black" />
      <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-black" />

      <h2 className="text-2xl md:text-2xl font-extrabold mb-3 tracking-wider">
        Vote For Two Sleepy People In{" "}
        <span className="underline decoration-black">Your City:</span>
      </h2>
      <p className="text-xs py-[24px]">
        <span className="font-bold">
          We’re bringing internet-cinema to theaters across the US, and want you to be part of it.
        </span>
        If you want to see this film in a theater near you or receive updates - drop your info below.
      </p>

      {/* <p className="text-xs mb-[24px]">
        * Note: We’re only able to release the film in US theaters this Fall. But, we want to bring it everyone someday. So, if your country is available in the dropdown below - you can still leave your postal code!
      </p> */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!validatePostalCode(form.zip, form.country)) {
            setForm({
              ...form,
              fatal: "Invalid postal code for selected country.",
            });
            return;
          }
          // Clear any previous fatal error before submit
          if (form.fatal) setForm({ ...form, fatal: null });
          handleSubmit(e);
        }}
        className="flex flex-col gap-[16px] mb-[40px]"
      >
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-1 ${
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
            } px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value, fatal: null })
            }
          />
        </div>
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-1 ${
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
            } px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value, fatal: null })
            }
          />
        </div>
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-1 ${
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
            } px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`}
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
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-1 ${
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
            } px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            value={form.country || "US"}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value, fatal: null })
            }
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-1 ${
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
            } px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder={
              countries.find((c) => c.code === selectedCountry)?.name ===
              "Canada"
                ? "A1A 1A1"
                : countries.find((c) => c.code === selectedCountry)?.name ===
                  "United Kingdom"
                ? "SW1A 1AA"
                : countries.find((c) => c.code === selectedCountry)?.name ===
                    "Germany" ||
                  countries.find((c) => c.code === selectedCountry)?.name ===
                    "France"
                ? "10115"
                : countries.find((c) => c.code === selectedCountry)?.name ===
                  "Australia"
                ? "2000"
                : countries.find((c) => c.code === selectedCountry)?.name ===
                  "India"
                ? "110001"
                : "73301"
            }
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
        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba] text-black"
                : "bg-[#D42568] hover:bg-[#A61D4D] text-white"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading && (
              <span className="inline-block w-4 h-4 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin"></span>
            )}
            {loading ? "Processing..." : "Drop Pin"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", email: "", phone: "", zip: "", country: "US" });
            }}
            className={`rounded-md border-2 border-black px-3 py-2 font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              retroMode
                ? "bg-white hover:bg-amber-50"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Clear
          </button>
        </div>
        {/* Notifications are shown via toast in the parent */}
        {fatal && (
          <div className="mt-2 text-xs font-mono text-rose-700">
            Error: {fatal}
          </div>
        )}
      </form>
    </div>
  );
}
