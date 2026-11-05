/** Crop anchor for a timeline thumbnail. The album shows the whole frame. */
export const tripPhotoPositions = ["top", "center", "bottom"] as const;

export type TripPhotoPosition = (typeof tripPhotoPositions)[number];

/**
 * Timeline thumbs are 4:3 with `object-fit: cover`.
 * The default keeps the watermarked corner in frame.
 * `top` sits a little below the edge (`center 15%`) so a portrait shows the head.
 */
const tripPhotoObjectPositions: Record<TripPhotoPosition, string> = {
  top: "center 15%",
  center: "center",
  bottom: "right bottom",
};

export const defaultTripPhotoObjectPosition = "right bottom";

export function isTripPhotoPosition(value: string): value is TripPhotoPosition {
  return (tripPhotoPositions as readonly string[]).includes(value);
}

export function tripPhotoObjectPosition(position?: TripPhotoPosition) {
  return position ? tripPhotoObjectPositions[position] : defaultTripPhotoObjectPosition;
}

export type TripPhoto = {
  src: string;
  alt: string;
  caption?: string;
  position?: TripPhotoPosition;
  width: number;
  height: number;
  blurDataURL: string;
};
