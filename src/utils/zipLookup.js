export async function lookupZip(code, country) {
  const apiKey = process.env.REACT_APP_ZIPCODEBASE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing REACT_APP_ZIPCODEBASE_API_KEY environment variable");
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    codes: code.trim(),
    country: country.toUpperCase(),
  });

  const url = `https://app.zipcodebase.com/api/v1/search?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Zipcodebase API error: ${res.status}`);
    }
    const json = await res.json();
    const results = json.results?.[code];
    if (!results?.length) {
      throw new Error("Postal code not found");
    }
    const place = results[0];

    return {
      city: place.city,
      state: place.state_code || place.state || "",
      country: place.country_code || country.toUpperCase(),
      lat: Number(place.latitude),
      lon: Number(place.longitude),
    };
  } catch (err) {
    throw new Error(err.message);
  }
}
