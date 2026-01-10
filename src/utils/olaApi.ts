
export interface OlaPlacePrediction {
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

export interface OlaAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface OlaReverseGeocodeResult {
  formatted_address: string;
  name?: string;
  address_components?: OlaAddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface OlaPlaceDetails {
  result: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    name: string;
    formatted_address: string;
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
    const response = await fetch(url, {
      headers: {
        'Referer': 'http://localhost',
        'X-Request-Id': Date.now().toString(),
      }
    });

    if (!response.ok) {
      console.error('API Error Status:', response.status, await response.text());
      if (response.status === 401) {
          console.error("Ola Maps API Unauthorized: Please enable Places/Search APIs in the Ola Dashboard for this API Key.");
      }
      throw new Error(`Ola Maps Autocomplete error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Autocomplete Results:', data.predictions);

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

export const getPlaceDetails = async (placeId: string): Promise<OlaPlaceDetails | null> => {
  if (!API_KEY) return null;

  const url = `https://api.olamaps.io/places/v1/details?place_id=${placeId}&api_key=${API_KEY}`;
  console.log(`Ola Place Details Request: ${url.replace(API_KEY, 'MASKED_KEY')}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Referer': 'http://localhost',
        'X-Request-Id': Date.now().toString(),
      }
    });

    if (!response.ok) {
      console.error('API Error Status:', response.status, await response.text());
      if (response.status === 401) {
          console.error("Ola Maps API Unauthorized: Please enable Places/Search APIs in the Ola Dashboard for this API Key.");
      }
      return null;
    }

    const data = await response.json();
    console.log('Place Details Response:', data);
    return data;
  } catch (error) {
    console.error("getPlaceDetails failed:", error);
    return null;
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
    const response = await fetch(url, {
      headers: {
        'Referer': 'http://localhost',
        'X-Request-Id': Date.now().toString(),
      }
    });

    if (!response.ok) {
      console.error('API Error Status:', response.status, await response.text());
      if (response.status === 401) {
          console.error("Ola Maps API Unauthorized: Please enable Places/Search APIs in the Ola Dashboard for this API Key.");
          return {
              formatted_address: "API Configuration Error (401)",
              name: "Unauthorized Key",
              geometry: { location: { lat, lng } }
          };
      }
      return {
          formatted_address: "Address Unavailable",
          name: "Location",
          geometry: { location: { lat, lng } }
      };
    }

    const data = await response.json();
    console.log('Reverse Geocode Response:', JSON.stringify(data));

    // Check for geocodingResults based on user input
    const results = data.geocodingResults || data.results;

    if (results && results.length > 0) {
        const result = results[0];
        return {
            formatted_address: result.formatted_address,
            name: result.name || result.formatted_address.split(',')[0],
            address_components: result.address_components,
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
    return {
        formatted_address: "Address Unavailable",
        name: "Location",
        geometry: { location: { lat, lng } }
    };
  }
};
