import {
  type GeocodeResult,
  NINJA_URL,
  API_NINJAS_API_KEY,
} from "../config/NinjaApi";

export const geocodeLocation = async (
  city: string,
  country?: string
): Promise<GeocodeResult | null> => {
  const requestUrl = `${NINJA_URL}?city=${city}${
    country ? `&country=${country}` : ""
  }`;

  try {
    const response = await fetch(requestUrl, {
      headers: { "X-Api-Key": API_NINJAS_API_KEY },
    });
    const fetchedLocations: GeocodeResult[] = await response.json();
    if (fetchedLocations && fetchedLocations.length > 0) {
      return fetchedLocations[0];
    }
  } catch (error) {
    console.error(`Geocoding API error for ${city}, ${country || ""}:`, error);
  }
  return null;
};
