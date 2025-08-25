/**
 * @fileoverview Test data for ZIP code lookups and city seeding
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Seed ZIP codes for testing and development with major US cities.
 *
 * Each entry maps a ZIP code to its corresponding city information including
 * geographic coordinates for map plotting and location-based features.
 *
 * @constant {Object<string, Object>} SEED_ZIPS
 * @property {string} city - The city name
 * @property {string} state - The state abbreviation
 * @property {number} lat - Latitude coordinate
 * @property {number} lon - Longitude coordinate
 *
 * @example
 * ```javascript
 * import { SEED_ZIPS } from './testdata';
 *
 * const nyc = SEED_ZIPS['10001'];
 * console.log(`${nyc.city}, ${nyc.state}: ${nyc.lat}, ${nyc.lon}`);
 * // "New York, NY: 40.7506, -73.9972"
 * ```
 */
export const SEED_ZIPS = {
  10001: { city: "New York", state: "NY", lat: 40.7506, lon: -73.9972 },
  73301: { city: "Austin", state: "TX", lat: 30.2672, lon: -97.7431 },
  90001: { city: "Los Angeles", state: "CA", lat: 34.0522, lon: -118.2437 },
  98101: { city: "Seattle", state: "WA", lat: 47.6101, lon: -122.3344 },
  60601: { city: "Chicago", state: "IL", lat: 41.8853, lon: -87.6216 },
  80202: { city: "Denver", state: "CO", lat: 39.7508, lon: -104.9966 },
  94102: { city: "San Francisco", state: "CA", lat: 37.7793, lon: -122.4193 },
  30301: { city: "Atlanta", state: "GA", lat: 33.749, lon: -84.388 },
  48201: { city: "Detroit", state: "MI", lat: 42.346, lon: -83.061 },
  "02108": { city: "Boston", state: "MA", lat: 42.357, lon: -71.065 },
  78702: { city: "Austin", state: "TX", lat: 30.2672, lon: -97.7431 },
  10010: { city: "New York", state: "NY", lat: 40.7386, lon: -73.9864 },
  90210: { city: "Beverly Hills", state: "CA", lat: 34.0736, lon: -118.4004 },
  33101: { city: "Miami", state: "FL", lat: 25.7743, lon: -80.1937 },
  75201: { city: "Dallas", state: "TX", lat: 32.7875, lon: -96.8002 },
};
