export default function SignupForm({
  form,
  setForm,
  handleSubmit,
  message,
  fatal,
  retroMode,
  setMessage,
  loading = false,
}) {
  return (
    <div className="relative rounded-2xl p-4 md:p-5 border border-black bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.6)]">
      <div className="absolute -top-2 -left-2 h-4 w-4 bg-black" />
      <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-black" />

      <h2 className="text-xl md:text-2xl font-extrabold mb-3">
        Bring the movie to{" "}
        <span className="underline decoration-amber-500">your city</span>
      </h2>
      <p className="text-sm mb-4 opacity-80">
        Pop in your details and drop a pin. We'll use this to plan screenings
        and send you updates.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-1 ${
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
            } px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-1 ${
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
            } px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label
            className={`block text-xs font-bold uppercase mb-1 ${
              retroMode ? "blink" : ""
            }`}
          >
            ZIP (US - MVP)
          </label>
          <input
            className={`w-full rounded-md border ${
              retroMode
                ? "border-black bg-[#fffef4]"
                : "border-black/40 bg-[#fffcf5]"
            } px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-black`}
            placeholder="73301"
            value={form.zip}
            onChange={(e) =>
              setForm({
                ...form,
                zip: e.target.value.replace(/[^0-9]/g, "").slice(0, 5),
              })
            }
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={loading}
            className={`rounded-md border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 ${
              retroMode
                ? "bg-[#00ffd1] hover:bg-[#00e1ba]"
                : "bg-lime-300/80 hover:bg-lime-300"
            } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading && (
              <span className="inline-block w-4 h-4 border-2 border-t-2 border-t-transparent border-black rounded-full animate-spin"></span>
            )}
            {loading ? "Processing..." : "Drop Pin"}
          </button>
          <button
            type="button"
            onClick={() => {
              setForm({ name: "", email: "", zip: "" });
              setMessage("");
            }}
            className={`rounded-md border-2 border-black px-3 py-2 font-bold shadow-[4px_4px_0_0_rgba(0,0,0,0.7)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              retroMode
                ? "bg-white hover:bg-amber-50"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Clear
          </button>
        </div>
        {message && (
          <div className="text-sm font-mono text-emerald-700">{message}</div>
        )}
        {fatal && (
          <div className="mt-2 text-xs font-mono text-rose-700">
            Error: {fatal}
          </div>
        )}
      </form>
    </div>
  );
}
