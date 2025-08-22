import { useState, useRef } from "react";
import { lookupZip } from "../utils/zipLookup";
import { addSubmission } from "../services/SubmissionsService";

// Hook: performs validation, zipcode lookup, and calls SubmissionsService.addSubmission
// Returns: { submit(form) -> Promise<result>, loading, error, message, setMessage, cancel }
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
    if (z.length < 5) {
      setMessage("Enter a 5-digit ZIP.");
      throw new Error("Please enter a valid ZIP code.");
    }

    setLoading(true);
    abortRef.current = new AbortController();

    try {
      const info = await lookupZip(z);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        zip: z,
        city: info.city,
        state: info.state,
        lat: Number(info.lat),
        lon: Number(info.lon),
      };

      const result = await addSubmission(payload);
      setMessage("Pinned! Thanks for raising your hand.");
      return result;
    } catch (err) {
      setError(err);
      if (!message) setMessage(err?.message || "Submission failed");
      throw err;
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
