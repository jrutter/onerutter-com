export type TravelMapTrip = {
  slug: string;
  title: string;
  when: string;
};

export type TravelMapMarker = {
  name: string;
  x: number;
  y: number;
  visits: number;
  cluster: string;
  vertical: "above" | "below";
  horizontal: "start" | "center" | "end";
  trips: TravelMapTrip[];
};

export type TravelMapCountry = {
  id: string;
  d: string;
  visited: boolean;
};

export type TravelMapModel = {
  width: number;
  height: number;
  ocean: string;
  countries: TravelMapCountry[];
  markers: TravelMapMarker[];
  placesLabel: string;
};
