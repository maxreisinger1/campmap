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
