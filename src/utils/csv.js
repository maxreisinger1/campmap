/**
 * @fileoverview CSV export utilities for data download functionality
 * @author Creator Camp Team
 * @version 1.0.0
 */

/**
 * Exports an array of objects to a CSV file and triggers download.
 *
 * Automatically generates CSV headers from object keys, properly escapes
 * CSV values including quotes and commas, and creates a downloadable blob.
 * The file is automatically downloaded by the browser.
 *
 * @function exportToCSV
 * @param {Array<Object>} rows - Array of objects to export
 * @param {string} [filename="fan_signups.csv"] - Name of the CSV file
 *
 * @example
 * ```javascript
 * const data = [
 *   { name: "John Doe", email: "john@example.com", city: "New York" },
 *   { name: "Jane Smith", email: "jane@example.com", city: "Los Angeles" }
 * ];
 *
 * exportToCSV(data, "user_data.csv");
 * ```
 */
export function exportToCSV(rows, filename = "fan_signups.csv") {
  if (!rows?.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
