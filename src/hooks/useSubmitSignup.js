/**
 * @fileoverview Custom hook for handling fan signup form submissions with validation
 * @author Creator Camp Team
 * @version 1.0.0
 */

import { useState, useRef } from "react";
import { addSubmission } from "../services/SubmissionsService";
import { toUserFriendlyMessage } from "../utils/errorParser";

/**
 * Custom hook for handling fan signup form submissions.
 *
 * Provides complete form validation, ZIP code lookup, submission processing,
 * and state management. Includes abort functionality for ongoing requests.
 *
 * @function useSubmitSignup
 * @returns {Object} Submission handler and state
 * @returns {Function} returns.submit - Submit function that takes form data
 * @returns {boolean} returns.loading - Whether submission is in progress
 * @returns {string} returns.message - User-facing message (success/validation)
 * @returns {Error|null} returns.error - Error object if submission failed
 * @returns {Function} returns.setMessage - Function to set custom messages
 * @returns {Function} returns.cancel - Function to abort ongoing submission
 *
 * @example
 * ```javascript
 * const { submit, loading, message, error, setMessage, cancel } = useSubmitSignup();
 *
 * const handleSubmit = async (formData) => {
 *   try {
 *     const result = await submit(formData);
 *     console.log('Signup successful:', result);
 *   } catch (err) {
 *     console.error('Signup failed:', err.message);
 *   }
 * };
 * ```
 */
export function useSubmitSignup() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  async function submit(form) {
    setError(null);
    setMessage("");
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!form?.name?.trim()) {
      setMessage("Please enter your name.");
      throw new Error("Please enter a valid name.");
    }
    if (!EMAIL_RE.test(form?.email || "")) {
      setMessage("Please enter a valid email.");
      throw new Error("Please enter a valid email.");
    }
    const z = String(form?.zip || "").trim();
    const country = form?.country || "US";
    if (!z) {
      setMessage("Enter a postal code.");
      throw new Error("Please enter a valid postal code.");
    }

    // Quick offline check to avoid confusing network errors
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      const offlineMsg =
        "You appear to be offline. Please check your connection and try again.";
      setMessage(offlineMsg);
      const err = new Error(offlineMsg);
      setError(err);
      throw err;
    }

    setLoading(true);
    abortRef.current = new AbortController();

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone ? form.phone.trim() : undefined,
        zip: z,
        country_code: country,
      };

      const result = await addSubmission(payload);
      setMessage("Pinned! Thanks for raising your hand.");
      return result;
    } catch (err) {
      setError(err);
      const friendly = toUserFriendlyMessage(err?.message || "");
      if (!message) setMessage(friendly);
      const wrapped = new Error(friendly);
      wrapped.cause = err;
      throw wrapped;
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function cancel() {
    if (abortRef.current) abortRef.current.abort();
  }

  return { submit, loading, error, message, setMessage, cancel };
}
