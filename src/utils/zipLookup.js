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
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${z}`);
    if (!res.ok) throw new Error("ZIP lookup failed");
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) throw new Error("ZIP not found");
    return {
      city: place["place name"],
      state: place["state abbreviation"],
      lat: Number(place.latitude),
      lon: Number(place.longitude),
    };
  } catch (error) {
    console.error("ZIP lookup error:", error);
    throw new Error(error.message || "Failed to lookup ZIP code");
  }
}
