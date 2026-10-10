import type { PlaceLocation } from "@/types/place";
import { reverseGeocodeAsync } from "expo-location";

export function isValidPlaceLocation(location: PlaceLocation) {
  return (
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude) &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
}

export async function getAddress(
  latitude: number,
  longitude: number,
): Promise<string> {
  try {
    const addresses = await reverseGeocodeAsync({
      latitude,
      longitude,
    });

    const address = addresses[0];

    if (!address) {
      return "Unknown address";
    }

    return [
      address.name,
      address.street,
      address.city,
      address.region,
      address.postalCode,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  } catch (error) {
    console.error("Failed to get address:", error);
    return "Address unavailable";
  }
}
