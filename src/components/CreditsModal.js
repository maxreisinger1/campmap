import { useState } from "react";
import countries from "world-countries";
import { getCountryCallingCode } from "libphonenumber-js";

/**
 * @fileoverview Modal component for "Get Your Name in the Credits" signup
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Modal component that displays a signup form for credits registration.
 *
 * Features a full-screen overlay with a centered form that can be dismissed
 * by clicking outside or pressing the close button.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onSubmit - Form submission handler
 * @param {boolean} [props.loading=false] - Whether form is in loading state
 * @returns {JSX.Element|null} Modal with signup form or null if closed
 */
export default function CreditsModal({
  retroMode = false,
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    country: "US",
    phoneCountry: "US",
  });
  const [fatal, setFatal] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    setFatal(null);

    // Call the parent's submit handler
    const result = await onSubmit(form);

    // If submission was successful, clear the form and close modal
    if (result?.success) {
      setForm({
        name: "",
        email: "",
        phone: "",
        zip: "",
        country: "US",
      });
      onClose();
    } else if (result?.error) {
      setFatal(result.error);
    }
  };

  // Build dropdown options: ISO Alpha-2 + country name
  const countryOptions = countries
    .map((c) => ({
      code: c.cca2,
      name: c.name.common,
      dial: (() => {
        try {
          return getCountryCallingCode(c.cca2);
        } catch {
          return "";
        }
      })(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Default to US if not set
  const selectedCountry = form.country || "US";
  const selectedPhoneCountry = form.phoneCountry || selectedCountry || "US";

  // Postal code validation (just check it's non-empty)
  function validatePostalCode(code) {
    return code.trim().length > 0;
  }

  const handleOverlayClick = (e) => {
    // Only close if clicking the overlay itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-4 rounded-lg border border-black relative">
        <div className="absolute -top-2 -left-2 h-4 w-4 bg-black" />
        <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-black" />

        <div className="w-full flex justify-end">
          <button
            onClick={onClose}
            className="text-black font-extralight text-4xl hover:text-black/70"
            aria-label="Close Credits Modal"
          >
            &times;
          </button>
        </div>

        <h2 className="text-lg md:text-2xl font-extrabold tracking-wider sm:block hidden">
          Sign Up To Join & Get Your Name in The Credits.
        </h2>
        <p className="text-[14px] pb-3 md:pb-[24px] pt-2 md:pt-[12px] max-w-xl sm:block hidden">
          We’re on the road to 500 theaters for this January. Sign up to get
          notified for showings near you & show theaters you care.
          <span className="font-bold">Every pin counts!</span>
        </p>

        <h2 className="text-lg md:text-2xl font-extrabold tracking-wider sm:hidden">
          Sign Up To Join Us & Get Your Name in The Credits.
        </h2>
        <p className="text-[14px] pb-3 md:pb-[24px] pt-2 md:pt-[12px] max-w-xl sm:hidden">
          We’re on the road to <span className="font-bold">500 theaters</span>{" "}
          for January. Sign up to get notified for showings near you.
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
            <div className="flex gap-2">
              <select
                className={`w-1/2 md:w-1/3 rounded-md border ${
                  retroMode
                    ? "border-black bg-[#fffef4]"
                    : "border-black/40 bg-[#fffcf5]"
                } px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-mono focus:outline-none focus:ring-2 focus:ring-black`}
                value={selectedPhoneCountry}
                onChange={(e) =>
                  setForm({ ...form, phoneCountry: e.target.value, fatal: null })
                }
              >
                {countryOptions.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}{c.dial ? ` (+${c.dial})` : ""}
                  </option>
                ))}
              </select>
              <input
                className={`flex-1 rounded-md border ${
                  retroMode
                    ? "border-black bg-[#fffef4]"
                    : "border-black/40 bg-[#fffcf5]"
                } px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base font-mono focus:outline-none focus:ring-2 focus:ring-black`}
                placeholder="Phone number"
                value={form.phone || ""}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value, fatal: null })
                }
                type="tel"
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            <p className="text-[10px] md:text-xs mt-1 text-black/70">
              We'll save it with the country code automatically.
            </p>
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
              {loading ? "Processing..." : "Add Name"}
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
                  phoneCountry: "US",
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
    </div>
  );
}
