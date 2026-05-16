import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(__dirname, "../src/constants/countries-data.ts"), "utf8");
const names = [...src.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const MANUAL = {
  "United States": "US",
  "United Kingdom": "GB",
  Russia: "RU",
  "South Korea": "KR",
  "North Korea": "KP",
  Vietnam: "VN",
  Vatican: "VA",
  Bolivia: "BO",
  Venezuela: "VE",
  Iran: "IR",
  Syria: "SY",
  Taiwan: "TW",
  Tanzania: "TZ",
  Laos: "LA",
  Macau: "MO",
  Moldova: "MD",
  Micronesia: "FM",
  Palestine: "PS",
  Brunei: "BN",
  "Cape Verde": "CV",
  "Czech Republic": "CZ",
  "Ivory Coast": "CI",
  "East Timor": "TL",
  Eswatini: "SZ",
  Swaziland: "SZ",
  "North Macedonia": "MK",
  Macedonia: "MK",
  Bahamas: "BS",
  Gambia: "GM",
  "U.S. Virgin Islands": "VI",
  "British Virgin Islands": "VG",
  "Democratic Republic of the Congo": "CD",
  "Republic of the Congo": "CG",
  Myanmar: "MM",
  Burma: "MM",
};

const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,altSpellings");
const api = await res.json();
const lookup = new Map();
for (const c of api) {
  const code = c.cca2;
  lookup.set(c.name.common.toLowerCase(), code);
  for (const alt of c.altSpellings ?? []) {
    lookup.set(String(alt).toLowerCase(), code);
  }
  if (c.name.official) lookup.set(c.name.official.toLowerCase(), code);
}

const map = {};
const missing = [];
for (const name of names) {
  if (MANUAL[name]) {
    map[name] = MANUAL[name];
    continue;
  }
  const code = lookup.get(name.toLowerCase());
  if (code) map[name] = code;
  else missing.push(name);
}

if (missing.length) {
  console.warn("Unmapped (using manual review needed):", missing);
  for (const name of missing) {
    map[name] = MANUAL[name] ?? "XX";
  }
}

const out = `/** ISO 3166-1 alpha-2 codes keyed by country name from countries-data.ts */\nexport const COUNTRY_ISO_BY_NAME: Record<string, string> = ${JSON.stringify(map, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, "../src/constants/country-iso-codes.ts"), out);
console.log("Wrote", Object.keys(map).length, "entries,", missing.length, "fallbacks");
