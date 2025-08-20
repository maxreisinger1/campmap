export default function Footer() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
      <div className="text-xs font-mono opacity-70">
        © {new Date().getFullYear()} Camp Studios — All vibes reserved.
      </div>
      <div className="text-xs font-mono">
        Roadmap: <span className="underline">Global postcode geocoding</span> •{" "}
        <span className="underline">Auth + DB (Supabase)</span> •{" "}
        <span className="underline">Spam protection</span> •{" "}
        <span className="underline">Public city pages</span>
      </div>
    </div>
  );
}
