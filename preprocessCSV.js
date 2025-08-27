import fs from "fs";
import csv from "csv-parser";
import { parse } from "json2csv";

// Reuse your lookupZip function here
async function lookupZip(z) {
  const supportedCountries = [
    "us","ar","at","au","be","bg","ca","ch","cz","de","dk","es","fi","fr",
    "gb","hu","ie","it","jp","li","mx","nl","no","nz","pl","pt","ru","se","sk","tr"
  ];
  let code = z.trim();
  let country = null;

  const prefixMatch = code.match(/^([A-Za-z]{2})[- ]?(.*)$/);
  if (prefixMatch && supportedCountries.includes(prefixMatch[1].toLowerCase())) {
    country = prefixMatch[1].toLowerCase();
    code = prefixMatch[2];
  }

  const usZipRegex = /^\d{5}(-\d{4})?$/;
  const arZipRegex = /^AR\d{4}[A-Z]{0,3}$/i;
  if (!country) {
    if (arZipRegex.test(code)) {
      country = "ar";
      code = code.replace(/^AR/i, "");
    } else if (usZipRegex.test(code)) {
      country = "us";
    }
  }

  const countriesToTry = country ? [country] : supportedCountries;
  let lastError = null;
  for (const c of countriesToTry) {
    try {
      const res = await fetch(`https://api.zippopotam.us/${c}/${code}`);
      if (!res.ok) continue;
      const data = await res.json();
      const place = data.places?.[0];
      if (!place) continue;
      return {
        city: place["place name"],
        state: place["state abbreviation"] || place["state"] || "",
        lat: Number(place.latitude),
        lon: Number(place.longitude),
      };
    } catch (error) {
      lastError = error;
    }
  }
  return { city: null, state: null, lat: null, lon: null }; // fallback
}

async function processCSV(inputFile, outputFile) {
  const rows = [];
  
  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      const enriched = [];

      for (const row of rows) {
        const { Email, "First Name": firstName, "Last Name": lastName, "Zip Code": zip } = row;
        
        const loc = await lookupZip(zip);
        console.log(`Location for ${zip}:`, loc);
        enriched.push({
          name: `${firstName} ${lastName}`,
          email: Email,
          zip: zip,
          state: loc.state,
          lat: loc.lat,
          lon: loc.lon,
          city: loc.city,
          city_id: null, // can be filled later if you have mapping
          ip_hash: null,
          phone_number: null,
        });
      }

      const csvOutput = parse(enriched);
      fs.writeFileSync(outputFile, csvOutput);
      console.log(`✅ Enriched CSV written to ${outputFile}`);
    });
}

// Run it
// Use the actual CSV file and output a new file with today's date
processCSV(
  "List Export 2025-08-26.csv",
  "List Export 2025-08-26-enriched-2025-08-27.csv"
);

// NOTE: This script is async but uses .on('end', async () => {...}) which can cause issues with top-level await in Node.js < 14.8.0. If you have issues, consider refactoring to fully async/await style.
