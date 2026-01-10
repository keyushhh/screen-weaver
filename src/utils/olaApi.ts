
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

  const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(query)}&api_key=${API_KEY}`;
  console.log(`Ola Autocomplete Request: ${url.replace(API_KEY, 'MASKED_KEY')}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Ola API Error:', response.status, response.statusText);
      throw new Error(`Ola Maps Autocomplete error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Ola Autocomplete Response:", JSON.stringify(data));

    if (!data.predictions) {
        console.warn("Ola Autocomplete: No predictions found in response");
        return [];
    }
    return data.predictions;
  } catch (error) {
    console.error("searchPlaces failed:", error);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lng: number): Promise<OlaReverseGeocodeResult | null> => {
  if (!API_KEY) {
    console.warn("Ola Maps API key is missing. Check VITE_MAPS_API_KEY in .env");
    return {
        formatted_address: "Address Unavailable",
        name: "Location",
        geometry: { location: { lat, lng } }
    };
  }

  const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${API_KEY}`;
  console.log(`Ola Reverse Geocode Request: ${url.replace(API_KEY, 'MASKED_KEY')}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Ola API Error:', response.status, response.statusText);
      // Return fallback instead of throwing to prevent crash
      return {
          formatted_address: "Address Unavailable",
          name: "Location",
          geometry: { location: { lat, lng } }
      };
    }

    const data = await response.json();
    console.log("Ola Reverse Geocode Response:", JSON.stringify(data));

    if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
            formatted_address: result.formatted_address,
            name: result.name || result.formatted_address.split(',')[0],
            geometry: result.geometry
        };
    }

    console.warn("Ola Reverse Geocode: No results found");
    return {
        formatted_address: "Address Unavailable",
        name: "Location",
        geometry: { location: { lat, lng } }
    };

  } catch (error) {
    console.error("reverseGeocode failed:", error);
    // Return fallback on error
    return {
        formatted_address: "Address Unavailable",
        name: "Location",
        geometry: { location: { lat, lng } }
    };
  }
};
