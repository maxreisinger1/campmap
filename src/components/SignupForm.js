import countries from "world-countries";

// Reusable component for stacked stills
// Flexible stacked stills component for 3 images
function StackedStills({ images, flip = false }) {
  // Optionally add some rotation for collage effect
  const rotations = ["rotate-[13.27deg]", "", "rotate-[-14.38deg]"];
  return (
    <div
      className={`relative flex flex-col gap-20 items-center h-full w-full ${
        flip ? "scale-x-[-1]" : ""
      }`}
      style={{ minWidth: "20rem" }}
    >
      <div className="relative items-center justify-center w-full">
        <div
          className="absolute flex flex-col -gap-20"
          style={{ left: "-40px" }}
        >
          {images.map((img, idx) => {
            // Middle image goes further out
            const extraLeft = idx === 1 ? (flip ? -80 : -80) : 0;
            return (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt}
                className={`w-64 border border-black shadow-md ${
                  rotations[idx] || ""
                } ${idx === 1 ? "z-10" : ""}`}
                style={{
                  objectFit: "cover",
                  aspectRatio: "4/3",
                  position: "relative",
                  left: extraLeft,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

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

  // Define 3 unique images for each side
  const leftImages = [
    { src: "/images/still-1.jpg", alt: "Audience 1" },
    { src: "/images/still-2.jpg", alt: "Audience 2" },
    { src: "/images/still-3.jpg", alt: "Audience 3" },
  ];
  const rightImages = [
    {
      src: "/images/still-4.png",
      alt: "City Postcard LA",
    },
    {
      src: "/images/still-5.png",
      alt: "City Postcard NY",
    },
    {
      src: "/images/still-6.jpg",
      alt: "City Postcard Seattle",
    },
  ];

  return (
    <div className="flex flex-row items-stretch justify-center gap-4 w-full">
      {/* Left stacked stills */}
      <div className="hidden md:flex items-center">
        <StackedStills images={leftImages} />
      </div>
      {/* Signup form */}
      <div
        id="signup-form"
        className="relative max-w-4xl rounded-2xl p-4 md:p-5 border border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.6)] flex-1"
      >
        <div className="absolute -top-2 -left-2 h-4 w-4 bg-black" />
        <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-black" />

        <h2 className="text-2xl md:text-2xl font-extrabold mb-3 tracking-wider">
          Drop A Pin To Bring The Film To{" "}
          <span className="underline decoration-black">More Cities:</span>
        </h2>
        <p className="text-xs py-[24px]">
          <span className="font-bold">
            We’re bringing internet-cinema to theaters across the world, and
            want you to be part of it.
          </span>{" "}
          Drop your info below to vote for your city.
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
          className="flex flex-col gap-[16px] mb-[40px]"
        >
          {/* Name */}
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

          {/* Email */}
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

          {/* Phone */}
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

          {/* Country */}
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
                setForm({
                  name: "",
                  email: "",
                  phone: "",
                  zip: "",
                  country: "US",
                });
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

          {/* Errors */}
          {fatal && (
            <div className="mt-2 text-xs font-mono text-rose-700">
              Error: {fatal}
            </div>
          )}
        </form>
      </div>
      {/* Right stacked stills (flipped) */}
      <div className="hidden md:flex items-center">
        <StackedStills images={rightImages} flip />
      </div>
    </div>
  );
}
