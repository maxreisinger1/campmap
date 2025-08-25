/**
 * @fileoverview General utility functions for the Creator Camp application
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Generates a unique identifier using timestamp and random string.
 *
 * @function uid
 * @returns {string} A unique identifier string
 *
 * @example
 * ```javascript
 * const id = uid(); // "lg2x8k-9h4z1m"
 * ```
 */
export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Clamps a number between minimum and maximum values.
 *
 * @function clamp
 * @param {number} v - The value to clamp
 * @param {number} min - The minimum allowed value
 * @param {number} max - The maximum allowed value
 * @returns {number} The clamped value
 *
 * @example
 * ```javascript
 * clamp(15, 10, 20); // returns 15
 * clamp(5, 10, 20);  // returns 10
 * clamp(25, 10, 20); // returns 20
 * ```
 */
export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
