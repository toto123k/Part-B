export const API_NINJAS_API_KEY = "09CE2n85ib4gM6jB63HDOQ==5Xd52LR3dYw458MQ";

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  [key: string]: any; // To allow for other properties returned by the API
}

export const NINJA_URL = `https://api.api-ninjas.com/v1/geocoding`;
