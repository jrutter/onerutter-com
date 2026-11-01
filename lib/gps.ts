const GPS_IFD = 0x8825;
const EXIF_IFD = 0x8769;
const INTEROP_IFD = 0xa005;

const xmpGps =
  /GPSLatitude|GPSLongitude|GPSDestLatitude|GPSDestLongitude|GPSPosition|GeoCoordinates|GPSAltitude/i;

export function xmpHasGps(xmp: Buffer) {
  return xmpGps.test(xmp.toString("utf8"));
}

function unreadable(file: string): never {
  throw new Error(
    `${file} has EXIF that could not be checked for GPS. Run node scripts/prepare-trip-photos.mjs so location data is stripped.`,
  );
}

/** True when the EXIF buffer contains a GPS IFD (tag 0x8825). Throws if the structure cannot be read. */
export function exifHasGps(exif: Buffer, file: string) {
  let start = 0;
  if (exif.length >= 6 && exif.toString("latin1", 0, 6) === "Exif\0\0") start = 6;
  if (start + 8 > exif.length) unreadable(file);

  const order = exif.toString("latin1", start, start + 2);
  if (order !== "II" && order !== "MM") unreadable(file);
  const little = order === "II";
  const u16 = (offset: number) => (little ? exif.readUInt16LE(offset) : exif.readUInt16BE(offset));
  const u32 = (offset: number) => (little ? exif.readUInt32LE(offset) : exif.readUInt32BE(offset));
  if (u16(start + 2) !== 42) unreadable(file);

  const seen = new Set<number>();
  let found = false;

  const walk = (tiffOffset: number, depth: number) => {
    if (found || depth > 8) return;
    const abs = start + tiffOffset;
    if (seen.has(abs) || abs < start || abs + 2 > exif.length) return;
    seen.add(abs);
    const count = u16(abs);
    const entriesEnd = abs + 2 + count * 12;
    if (count > 200 || entriesEnd + 4 > exif.length) unreadable(file);

    for (let i = 0; i < count; i++) {
      const entry = abs + 2 + i * 12;
      const tag = u16(entry);
      const type = u16(entry + 2);
      const length = u32(entry + 4);
      const value = u32(entry + 8);
      if (tag === GPS_IFD) found = true;
      if ((tag === EXIF_IFD || tag === GPS_IFD || tag === INTEROP_IFD) && type === 4 && length === 1) {
        walk(value, depth + 1);
      }
    }

    const next = u32(entriesEnd);
    if (next) walk(next, depth + 1);
  };

  walk(u32(start + 4), 0);
  return found;
}

export function assertNoGps(file: string, exif?: Buffer, xmp?: Buffer) {
  if (exif && exifHasGps(exif, file)) {
    throw new Error(
      `${file} still has GPS EXIF. Run node scripts/prepare-trip-photos.mjs before committing the photograph.`,
    );
  }
  if (xmp && xmpHasGps(xmp)) {
    throw new Error(
      `${file} still has GPS in XMP. Run node scripts/prepare-trip-photos.mjs before committing the photograph.`,
    );
  }
}
