/**
 * Natural Earth numeric ids for the 110m world map.
 * null means the territory is smaller than those shapes, so it gets a marker and no fill.
 * Add a country here when a trip names one the map does not know yet.
 */
export const countryIds: Record<string, string | null> = {
  Austria: "040",
  "Dominican Republic": "214",
  France: "250",
  Germany: "276",
  Iceland: "352",
  Ireland: "372",
  Italy: "380",
  Jamaica: "388",
  Mexico: "484",
  Netherlands: "528",
  Norway: "578",
  "Saint Martin": null,
  "South Africa": "710",
  Switzerland: "756",
  "United Kingdom": "826",
};
