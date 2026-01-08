import React, { useState, useEffect, useCallback } from "react";
import Map, { ViewState, ViewStateChangeEvent } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search, MapPin, Navigation } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const AddAddress = () => {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 12.9716, // Default to Bangalore (as per screenshot)
    longitude: 77.5946,
    zoom: 15,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  const [address, setAddress] = useState<string>("Loading address...");
  const [detailedAddress, setDetailedAddress] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce function for geocoding
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes("placeholder")) {
        // Mock response if token is placeholder
        console.log("Using placeholder token - mocking address");
        setAddress("Bangalore, India");
        setDetailedAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} - Mock Address`);
        return;
      }

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const place = data.features[0];
        setAddress(place.text || "Unknown Location");
        setDetailedAddress(place.place_name || "");
      } else {
        setAddress("Unknown Location");
        setDetailedAddress("");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setAddress("Error fetching location");
    }
  };

  // Create debounced version of fetchAddress
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchAddress = useCallback(debounce(fetchAddress, 1000), []);

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
    setIsDragging(true);
  };

  const handleMoveEnd = (evt: ViewStateChangeEvent) => {
    setIsDragging(false);
    debouncedFetchAddress(evt.viewState.latitude, evt.viewState.longitude);
  };

  // Initial fetch
  useEffect(() => {
    debouncedFetchAddress(viewState.latitude, viewState.longitude);
  }, []); // Run once on mount

  return (
    <div className="h-full w-full relative bg-black text-white overflow-hidden">
      {/* Map */}
      <Map
        {...viewState}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
      />

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="flex-1 text-center text-lg font-medium">Add New Address</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Search Bar Overlay */}
      <div className="absolute top-28 left-4 right-4 z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl flex items-center px-4 h-12 border border-white/10">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder='"near the tree" doesn’t help anyone'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-sm text-white placeholder-gray-400 font-normal"
          />
        </div>
      </div>

      {/* Fixed Center Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center justify-center pb-8">
         {/* The pin point usually sits at the bottom center of the icon, so we adjust slightly */}
         {/* Pulse effect */}
         <div className="absolute w-24 h-24 bg-purple-500/20 rounded-full blur-xl animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
         <div className="relative">
            <div className="w-12 h-12 bg-black/40 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-sm"></div>
            <MapPin className="w-10 h-10 text-[#5260FE] relative z-10 fill-[#5260FE]/20" />
         </div>
      </div>

      {/* Helper text above bottom sheet */}
      <div className="absolute bottom-[240px] left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
           <span className="text-sm font-medium">Drag the pin to set your location</span>
        </div>
      </div>

      {/* My Location Button */}
      <button
        className="absolute bottom-[240px] right-4 z-10 w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-white/10 shadow-lg"
        onClick={() => {
            // Mock geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    setViewState(prev => ({
                        ...prev,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        zoom: 15
                    }));
                    debouncedFetchAddress(pos.coords.latitude, pos.coords.longitude);
                });
            }
        }}
      >
        <Navigation className="w-5 h-5 text-[#5260FE] fill-[#5260FE]" />
      </button>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-black rounded-t-[32px] p-6 pb-10 z-20 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <h3 className="text-white text-base font-semibold mb-4">Order will be delivered here</h3>

        <div className="bg-[#1A1A1A] rounded-2xl p-4 flex items-start gap-4 mb-6 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center shrink-0">
             <MapPin className="w-5 h-5 text-[#5260FE] fill-[#5260FE]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-bold text-base">{address}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {detailedAddress || "Fetching detailed address..."}
            </p>
          </div>
        </div>

        <button className="w-full h-12 bg-[#1A1A1A] hover:bg-[#252525] text-white font-medium rounded-full border border-white/20 transition-colors">
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default AddAddress;
