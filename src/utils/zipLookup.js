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
  // Autodetect country from postal code
  let country = "us";
  let code = z.trim();
  // US ZIP: 5 digits, optionally with 4-digit extension
  const usZipRegex = /^\d{5}(-\d{4})?$/;
  // Argentina: AR followed by 4 digits and 3 letters (e.g., AR1601ABC) or AR + 4 digits (e.g., AR1601)
  const arZipRegex = /^AR\d{4}[A-Z]{0,3}$/i;

  if (arZipRegex.test(code)) {
    country = "ar";
    code = code.replace(/^AR/i, ""); // Remove AR prefix for API
  } else if (usZipRegex.test(code)) {
    country = "us";
  } else {
    throw new Error("Unsupported or invalid postal code format");
  }

  try {
    const res = await fetch(`https://api.zippopotam.us/${country}/${code}`);
    if (!res.ok) throw new Error("Postal code lookup failed");
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) throw new Error("Postal code not found");
    return {
      city: place["place name"],
      state: place["state abbreviation"] || place["state"] || "",
      country: data["country abbreviation"] || country.toUpperCase(),
      lat: Number(place.latitude),
      lon: Number(place.longitude),
    };
  } catch (error) {
    console.error("Postal code lookup error:", error);
    throw new Error(error.message || "Failed to lookup postal code");
  }
}
