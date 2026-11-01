import { geoContains, geoNaturalEarth1, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-110m.json";
import { countryIds } from "@/lib/map-countries";
import type { TravelMapMarker, TravelMapModel } from "@/lib/map-types";
import { formatTripWhen, type Trip } from "@/lib/trips";

const WIDTH = 960;
const HEIGHT = 470;
/** Places closer than this on the map share one tooltip. Each still has its own dot. */
const CLUSTER_PX = 6;

type WorldTopology = Topology<{ countries: GeometryCollection }>;
type CountryFeature = Feature<Geometry, GeoJsonProperties> & { id?: string | number };

function countryFeatures() {
  const topology = world as unknown as WorldTopology;
  const collection = feature(topology, topology.objects.countries) as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;
  return collection.features.filter((item) => String(item.id) !== "010") as CountryFeature[];
}

function clusterMarkers(markers: TravelMapMarker[]) {
  const parent = markers.map((_, index) => index);
  const find = (index: number): number => {
    if (parent[index] !== index) parent[index] = find(parent[index]);
    return parent[index];
  };
  const unite = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };

  for (let i = 0; i < markers.length; i++) {
    for (let j = i + 1; j < markers.length; j++) {
      const distance = Math.hypot(markers[i].x - markers[j].x, markers[i].y - markers[j].y);
      if (distance < CLUSTER_PX) unite(i, j);
    }
  }

  const groups = new Map<number, string[]>();
  markers.forEach((marker, index) => {
    const root = find(index);
    const names = groups.get(root) ?? [];
    names.push(marker.name);
    groups.set(root, names);
  });

  for (const marker of markers) {
    const root = find(markers.findIndex((item) => item.name === marker.name));
    const names = groups.get(root) ?? [marker.name];
    marker.cluster = names.slice().sort((a, b) => a.localeCompare(b)).join("|");
  }
}

function placement(x: number, y: number): Pick<TravelMapMarker, "vertical" | "horizontal"> {
  return {
    vertical: y < HEIGHT * 0.34 ? "below" : "above",
    horizontal: x < WIDTH * 0.2 ? "start" : x > WIDTH * 0.8 ? "end" : "center",
  };
}

export function buildTravelMap(trips: Trip[]): TravelMapModel {
  const published = trips.filter((trip) => !trip.draft);
  const byName = new Map<string, TravelMapMarker & { lat: number; lng: number; country: string }>();

  for (const trip of published) {
    for (const place of trip.places) {
      const key = place.name.toLowerCase();
      const link = { slug: trip.slug, title: trip.title, when: formatTripWhen(trip) };
      const existing = byName.get(key);
      if (!existing) {
        byName.set(key, {
          name: place.name,
          lat: place.lat,
          lng: place.lng,
          country: place.country,
          x: 0,
          y: 0,
          visits: 1,
          cluster: place.name,
          vertical: "above",
          horizontal: "center",
          trips: [link],
        });
        continue;
      }
      if (existing.lat !== place.lat || existing.lng !== place.lng || existing.country !== place.country) {
        throw new Error(`${place.name} is listed with two different centroids. Use one lat, lng, and country.`);
      }
      existing.trips.push(link);
      existing.visits += 1;
    }
  }

  const countries = countryFeatures();
  const byId = new Map(countries.map((item) => [String(item.id), item]));
  const visited = new Set<string>();

  for (const marker of byName.values()) {
    if (!Object.prototype.hasOwnProperty.call(countryIds, marker.country)) {
      throw new Error(
        `${marker.country} is not on the map yet. Add its Natural Earth id in lib/map-countries.ts.`,
      );
    }
    const id = countryIds[marker.country];
    if (id == null) continue;
    const shape = byId.get(id);
    if (!shape) throw new Error(`Natural Earth id ${id} for ${marker.country} is missing from the world map.`);
    if (!geoContains(shape, [marker.lng, marker.lat])) {
      throw new Error(`${marker.name} (${marker.lat}, ${marker.lng}) does not fall inside ${marker.country}.`);
    }
    visited.add(id);
  }

  const projection = geoNaturalEarth1();
  const outline = geoPath(projection);
  projection.fitExtent(
    [
      [12, 12],
      [WIDTH - 12, HEIGHT - 12],
    ],
    { type: "FeatureCollection", features: countries },
  );

  const markers: TravelMapMarker[] = [...byName.values()]
    .map((marker) => {
      const point = projection([marker.lng, marker.lat]);
      if (!point) throw new Error(`${marker.name} could not be projected.`);
      return {
        name: marker.name,
        x: point[0],
        y: point[1],
        visits: marker.visits,
        cluster: marker.name,
        trips: marker.trips,
        ...placement(point[0], point[1]),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  clusterMarkers(markers);

  const placesLabel =
    "Places visited: " +
    markers
      .map((marker) => `${marker.name} (${marker.visits} ${marker.visits === 1 ? "trip" : "trips"})`)
      .join(", ") +
    ".";

  return {
    width: WIDTH,
    height: HEIGHT,
    ocean: outline({ type: "Sphere" }) ?? "",
    countries: countries.map((item) => ({
      id: String(item.id),
      d: outline(item) ?? "",
      visited: visited.has(String(item.id)),
    })),
    markers,
    placesLabel,
  };
}
