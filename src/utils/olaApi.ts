
export interface OlaPlacePrediction {
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

export interface OlaReverseGeocodeResult {
  formatted_address: string;
  name?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

export const searchPlaces = async (query: string): Promise<OlaPlacePrediction[]> => {
  if (!API_KEY) {
    console.warn("Ola Maps API key is missing. Check VITE_MAPS_API_KEY in .env");
    return [];
  }

  try {
    const response = await fetch(
      `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(query)}&api_key=${API_KEY}`,
      {
         headers: {
            'X-Request-Id': crypto.randomUUID(),
         }
      }
    );

    if (!response.ok) {
      throw new Error(`Ola Maps Autocomplete error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.predictions || [];
  } catch (error) {
    console.error("searchPlaces failed:", error);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<OlaReverseGeocodeResult | null> => {
  if (!API_KEY) {
    console.warn("Ola Maps API key is missing. Check VITE_MAPS_API_KEY in .env");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${API_KEY}`,
      {
          headers: {
            'X-Request-Id': crypto.randomUUID(),
         }
      }
    );

    if (!response.ok) {
      throw new Error(`Ola Maps Reverse Geocode error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.results && data.results.length > 0) {
        // Prefer "name" (building name) if available, otherwise formatted_address
        // The API response structure needs to be handled carefully.
        // Assuming standard Google-like or Ola structure.
        const result = data.results[0];
        return {
            formatted_address: result.formatted_address,
            name: result.name || result.formatted_address.split(',')[0], // Fallback logic
            geometry: result.geometry
        };
    }
    return null;
  } catch (error) {
    console.error("reverseGeocode failed:", error);
    return null;
  }
};
