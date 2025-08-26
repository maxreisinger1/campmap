/**
 * @fileoverview ZIP code lookup utilities using external geolocation API
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Looks up geographic information for a US ZIP code using the Zippopotam API.
 *
 * Fetches city name, state abbreviation, and coordinates for the given ZIP code.
 * Handles various error cases including invalid ZIP codes, network failures,
 * and missing location data.
 *
 * @async
 * @function lookupZip
 * @param {string} z - The ZIP code to look up
 * @returns {Promise<Object>} Location information object
 * @returns {string} returns.city - The city name
 * @returns {string} returns.state - The state abbreviation
 * @returns {number} returns.lat - Latitude coordinate
 * @returns {number} returns.lon - Longitude coordinate
 * @throws {Error} When ZIP lookup fails or ZIP code is not found
 *
 * @example
 * ```javascript
 * try {
 *   const location = await lookupZip('90210');
 *   console.log(`${location.city}, ${location.state}`); // "Beverly Hills, CA"
 * } catch (error) {
 *   console.error('ZIP lookup failed:', error.message);
 * }
 * ```
 */
export async function lookupZip(z) {
  // List of supported country codes by Zippopotam.us
  const supportedCountries = [
    "us",
    "ar",
    "at",
    "au",
    "be",
    "bg",
    "ca",
    "ch",
    "cz",
    "de",
    "dk",
    "es",
    "fi",
    "fr",
    "gb",
    "hu",
    "ie",
    "it",
    "jp",
    "li",
    "mx",
    "nl",
    "no",
    "nz",
    "pl",
    "pt",
    "ru",
    "se",
    "sk",
    "tr",
  ];
  let code = z.trim();
  let country = null;

  // Try to autodetect country from prefix (e.g., DE-10115)
  const prefixMatch = code.match(/^([A-Za-z]{2})[- ]?(.*)$/);
  if (
    prefixMatch &&
    supportedCountries.includes(prefixMatch[1].toLowerCase())
  ) {
    country = prefixMatch[1].toLowerCase();
    code = prefixMatch[2];
  }

  // US ZIP: 5 digits, optionally with 4-digit extension
  const usZipRegex = /^\d{5}(-\d{4})?$/;
  // Argentina: AR followed by 4 digits and 3 letters (e.g., AR1601ABC) or AR + 4 digits (e.g., AR1601)
  const arZipRegex = /^AR\d{4}[A-Z]{0,3}$/i;
  if (!country) {
    if (arZipRegex.test(code)) {
      country = "ar";
      code = code.replace(/^AR/i, "");
    } else if (usZipRegex.test(code)) {
      country = "us";
    }
  }

  // Try lookup for detected country, or try all supported countries
  const countriesToTry = country ? [country] : supportedCountries;
  let lastError = null;
  for (const c of countriesToTry) {
    try {
      const res = await fetch(`https://api.zippopotam.us/${c}/${code}`);
      if (!res.ok) continue;
      const data = await res.json();
      const place = data.places?.[0];
      if (!place) continue;
      return {
        city: place["place name"],
        state: place["state abbreviation"] || place["state"] || "",
        country: data["country abbreviation"] || c.toUpperCase(),
        lat: Number(place.latitude),
        lon: Number(place.longitude),
      };
    } catch (error) {
      lastError = error;
      continue;
    }
  }
  throw new Error(
    lastError?.message || "Postal code not found in supported countries"
  );
}
