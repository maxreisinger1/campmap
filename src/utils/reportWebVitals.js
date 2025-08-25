/**
 * @fileoverview Web vitals performance measurement utilities
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Reports web vitals performance metrics to a provided callback function.
 *
 * Dynamically imports the web-vitals library and measures core web vitals
 * including Cumulative Layout Shift (CLS), First Input Delay (FID),
 * First Contentful Paint (FCP), Largest Contentful Paint (LCP),
 * and Time to First Byte (TTFB).
 *
 * @function reportWebVitals
 * @param {Function} onPerfEntry - Callback function to receive performance entries
 *
 * @example
 * ```javascript
 * // Log performance metrics to console
 * reportWebVitals(console.log);
 *
 * // Send metrics to analytics service
 * reportWebVitals((metric) => {
 *   analytics.track('Web Vital', metric);
 * });
 * ```
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
