import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Map, { ViewState, ViewStateChangeEvent, MapRef } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import 'maplibre-gl/dist/maplibre-gl.css';
import { OpenLocationCode } from "open-location-code";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateDistance, reverseGeocode, getDistance, forwardGeocode, GeocodeResult } from "@/utils/geoUtils";
import { Geolocation } from '@capacitor/geolocation';

// Assets
import mapPinIcon from "@/assets/map-pin-icon.svg";
import locationPinIcon from "@/assets/location-pin.svg";
import navigationIcon from "@/assets/navigation-icon.svg";
import confirmCtaBg from "@/assets/confirm-location-cta.png";
import copyIcon from "@/assets/copy.svg";
import distanceCallout from "@/assets/distance-callout.svg";

const AddAddress = () => {
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 15,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  const [addressTitle, setAddressTitle] = useState<string>("Loading...");
  const [addressLine, setAddressLine] = useState<string>("");
  const [plusCode, setPlusCode] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [distanceInMeters, setDistanceInMeters] = useState<number | null>(null);
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  const debounce = <T extends (...args: unknown[]) => void>(func: T, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Hybrid Search (Plus Code & Text)
  const performSearch = async (query: string) => {
    console.log("performSearch called with:", query);
    if (!query) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // 1. Hybrid Check: Extract Plus Code pattern from mixed input
    // Regex matches 2-8 alphanumeric chars, a plus sign, and 2-3 alphanumeric chars
    // This catches "HXCV+JR", "87G8HXCV+JR", "HXCV+JR Bangalore", etc.
    const plusCodeRegex = /([A-Z0-9]{2,8}\+[A-Z0-9]{2,3})/i;
    const match = query.match(plusCodeRegex);

    if (match) {
       const potentialCode = match[0].toUpperCase();
       console.log("Potential Plus Code found:", potentialCode);

       try {
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           const olc = new OpenLocationCode() as any;

           // Attempt to recover nearest (handles short codes using context)
           // Use user location if available, otherwise map center
           const refLat = userLocation ? userLocation.lat : viewState.latitude;
           const refLng = userLocation ? userLocation.lng : viewState.longitude;

           // If it's a full code (8+ chars before +), recoverNearest handles it too (ignoring ref),
           // but mainly it resolves short codes relative to ref.
           const recoveredCode = olc.recoverNearest(potentialCode, refLat, refLng);

           if (olc.isValid(recoveredCode)) {
              console.log("Valid code recovered:", recoveredCode);
              const codeArea = olc.decode(recoveredCode);
              const lat = codeArea.latitudeCenter;
              const lng = codeArea.longitudeCenter;

              // We'll treat this as a single result for the dropdown
              const result: GeocodeResult = {
                  display_name: `Plus Code Location: ${potentialCode}`,
                  address: {}, // dummy
                  lat: lat.toString(),
                  lon: lng.toString()
              };
              setSearchResults([result]);
              setShowDropdown(true);
              return;
           }
       } catch (err) {
           console.log("Plus code resolution failed, falling back to text search", err);
       }
    }

    // 2. Fallback to Text Search (Geocoding) if no valid code found or code resolution failed
    try {
        console.log("Calling forwardGeocode...");
        const results = await forwardGeocode(query);
        console.log("Geocode results:", results);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
    } catch (error) {
        console.error("Search error:", error);
    }
  };

  const fetchAddress = async (lat: number, lng: number, overrideUserLocation?: {lat: number, lng: number}) => {
    setIsLoading(true);
    try {
      console.log("Fetching address for", lat, lng);
      // Generate Plus Code
      // Note: @types/open-location-code defines methods as static, but the JS library
      // implementation uses prototype methods, requiring instantiation.
      // Casting to 'any' bypasses the incorrect type definition.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const olc = new OpenLocationCode() as any;
      const fullCode = olc.encode(lat, lng);
      console.log("Generated Full Code:", fullCode);

      // Shorten the Plus Code for display (remove the first 4 characters, usually the area code)
      // This provides the 4+2 (e.g., 5Q5C+FX) format relative to the local city/region
      let shortCode = fullCode;
      if (fullCode.length >= 10 && fullCode.includes('+')) {
         // Assuming standard 10+ digit code (8 chars before +, 2+ after)
         // remove first 4 chars.
         shortCode = fullCode.substring(4);
      }

      setPlusCode(shortCode);

      // Fetch Real Address from Nominatim
      const geocodeResult = await reverseGeocode(lat, lng);
      const addr = geocodeResult.address;

      // Construct Title (Locality/Suburb/City)
      const title = addr.suburb || addr.neighbourhood || addr.city || addr.town || addr.village || "Unknown Location";
      setAddressTitle(title);

      // Construct Full Address Line
      // Priority: Road/House -> Locality -> City -> State -> Pincode
      const parts = [];
      if (addr.road || addr.house_number) {
        parts.push([addr.house_number, addr.road].filter(Boolean).join(" "));
      }
      if (addr.suburb && addr.suburb !== title) parts.push(addr.suburb);
      if (addr.neighbourhood && addr.neighbourhood !== title) parts.push(addr.neighbourhood);
      if (addr.city || addr.town || addr.village) parts.push(addr.city || addr.town || addr.village);
      if (addr.state) parts.push(addr.state);
      if (addr.postcode) parts.push(addr.postcode);

      // Remove duplicates and join
      const fullAddress = [...new Set(parts)].filter(Boolean).join(", ");
      setAddressLine(fullAddress || geocodeResult.display_name); // Fallback to display_name if construction fails

      const loc = overrideUserLocation || userLocation;
      if (loc) {
        setDistanceInMeters(getDistance(loc.lat, loc.lng, lat, lng));
      } else {
        setDistanceInMeters(null);
      }

    } catch (error) {
      console.error("Error fetching address:", error);
      setAddressTitle("Location not found");
      setAddressLine("Unable to fetch address details. Please try moving the pin.");
      setPlusCode("");
      setDistanceInMeters(null);
    } finally {
      setIsLoading(false);
    }
  };



  const performSearchRef = useRef(performSearch);
  useEffect(() => {
    performSearchRef.current = performSearch;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useMemo(() => {
    const func = (q: string) => performSearchRef.current(q);
    return debounce(func, 500);
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      console.log("Input changed:", val);
      setSearchQuery(val);
      debouncedSearch(val);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchAddress = useCallback(debounce(fetchAddress, 1000), [userLocation]);

  const fetchUserLocation = useCallback(async () => {
      try {
          console.log("Checking location permissions...");
          let permissionStatus = await Geolocation.checkPermissions();
          console.log('Initial permission status:', permissionStatus.location);

          // If not granted, explicitly request permission
          if (permissionStatus.location !== 'granted') {
              console.log("Permission not granted. Requesting explicitly...");
              permissionStatus = await Geolocation.requestPermissions();
              console.log('New permission status:', permissionStatus.location);
          }

          // If still not granted (denied or dismissed), exit
          if (permissionStatus.location !== 'granted') {
              console.log("Location permission denied or not granted.");
              return;
          }

          // Permission granted, fetch location
          console.log("Permission granted. Requesting fresh user location via Capacitor...");
          const position = await Geolocation.getCurrentPosition({
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
          });

          const { latitude, longitude } = position.coords;
          console.log("Got fresh location:", latitude, longitude);

          setUserLocation({
            lat: latitude,
            lng: longitude
          });

          // Center map on user location with smooth animation
          mapRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 18,
              duration: 1500
          });

          // Fetch address for this new GPS location
          fetchAddress(latitude, longitude, { lat: latitude, lng: longitude });

      } catch (error) {
          console.error("Error getting location via Capacitor:", error);
      }
  }, []);

  const handleSnapToGrid = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const olc = new OpenLocationCode() as any;
      const code = olc.encode(viewState.latitude, viewState.longitude);
      const decoded = olc.decode(code);
      const centerLat = decoded.latitudeCenter;
      const centerLng = decoded.longitudeCenter;

      setViewState(prev => ({
        ...prev,
        latitude: centerLat,
        longitude: centerLng,
        zoom: 18
      }));

      // Fetch address for the new snapped location
      fetchAddress(centerLat, centerLng);
    } catch (error) {
      console.error("Error snapping to grid:", error);
    }
  };

  const handleMove = (evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
    setIsDragging(true);
  };

  const handleMoveEnd = (evt: ViewStateChangeEvent) => {
    setIsDragging(false);
    // Fetch immediately on move end for snappier feeling, or use debounced if preferred.
    // Given the requirement for "Swiggy-like" where it loads after drag:
    fetchAddress(evt.viewState.latitude, evt.viewState.longitude);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
        handleSelectResult(searchResults[0]);
    }
  };

  const handleSelectResult = (result: GeocodeResult) => {
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      // Smooth FlyTo Transition
      mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: 18,
          duration: 1500 // 1.5s smooth animation
      });

      // Clear search
      setSearchResults([]);
      setShowDropdown(false);
      setSearchQuery(result.display_name.split(',')[0]); // Set input to the selected name
  };

  const copyPlusCode = () => {
      if (plusCode) {
          navigator.clipboard.writeText(plusCode);
          toast.success("Plus Code copied to clipboard!");
      }
  };

  useEffect(() => {
    // Initial fetch for default location immediately (fallback/last known)
    fetchAddress(viewState.latitude, viewState.longitude);

    // Initial fresh fetch
    fetchUserLocation();

    // Re-fetch on window focus (e.g. user comes back from Settings or another app)
    const handleFocus = () => {
        fetchUserLocation();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
        window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchUserLocation]);

  useEffect(() => {
    if (!bottomSheetRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use getBoundingClientRect to ensure we get the full visual height (including padding/borders)
        // contentRect (default) excludes padding, which causes overlap if the element has significant padding.
        setBottomSheetHeight(entry.target.getBoundingClientRect().height);
      }
    });
    observer.observe(bottomSheetRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full w-full relative bg-black text-white overflow-hidden">
      {/* Map */}
      <Map
        ref={mapRef}
        {...viewState}
        minZoom={3}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        attributionControl={false}
        touchZoom={true}
      />

      {/* Top Container Layer */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
      >
        <div
          className="rounded-b-[32px] overflow-hidden pointer-events-auto"
          style={{
              backgroundColor: "rgba(7, 7, 7, 0.81)", // #070707 at 81%
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              paddingBottom: "24px"
          }}
        >
          <div className="safe-area-top pt-4 px-5">
             {/* Header */}
            {/* Removed mb-[18px] to strictly enforce the container's 24px bottom padding */}
            <div className="flex items-center">
                <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center mr-2"
                >
                <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="flex-1 text-center text-lg font-medium pr-10">Add New Address</h1>
            </div>
          </div>
        </div>

        {/* Search Bar - 18px below the container */}
        <div className="flex justify-center mt-[18px] pointer-events-auto relative" style={{ zIndex: 60 }}>
             <div
                 className="flex items-center px-4"
                 style={{
                     width: "363px",
                     height: "44px",
                     borderRadius: "9999px",
                     background: "rgba(255, 255, 255, 0.1)", // Glass effect base
                     backdropFilter: "blur(10px)",
                     WebkitBackdropFilter: "blur(10px)",
                     border: "1px solid rgba(255, 255, 255, 0.1)"
                 }}
             >
                 <Search className="w-5 h-5 text-white mr-3" />
                 <input
                     type="text"
                     placeholder="“near the tree” doesn’t help anyone"
                     value={searchQuery}
                     onChange={handleSearchInput}
                     onKeyDown={handleSearch}
                     className="bg-transparent border-none outline-none flex-1 text-[14px] text-white placeholder-white font-normal font-sans"
                     style={{ fontFamily: 'Satoshi, sans-serif' }}
                 />
             </div>

             {/* Dropdown Results */}
             {showDropdown && searchResults.length > 0 && (
                <div
                    className="absolute top-[52px] w-[363px] bg-[#1A1A1A]/95 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto"
                    style={{ zIndex: 50 }}
                >
                    {searchResults.map((result, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSelectResult(result)}
                            className="px-4 py-3 border-b border-white/5 hover:bg-white/10 cursor-pointer flex items-center"
                        >
                            <img src={locationPinIcon} alt="Pin" className="w-3 h-3 mr-3 opacity-70" />
                            <span className="text-sm text-white font-satoshi truncate">
                                {result.display_name}
                            </span>
                        </div>
                    ))}
                </div>
             )}
         </div>
      </div>

      {/* Fixed Center Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
          {/* -mt-10 adjustment to make the pin tip land on center */}
          <div className="relative z-0 -mt-10">
            <img src={mapPinIcon} alt="Pin" className="w-[46px] h-[58px]" />
          </div>
      </div>

      {/* Helper Pill & Navigation Button Container */}
      {/* Dynamic bottom position to clear the bottom sheet */}
      <div
        className="absolute left-0 right-0 z-30 flex items-center justify-center pointer-events-none transition-all duration-300 ease-in-out"
        style={{ bottom: `${bottomSheetHeight + 14}px` }}
      >
         <div className="flex items-center pointer-events-auto">
            {/* Helper Pill */}
            <div
                className="flex items-center justify-center"
                style={{
                    width: "302px",
                    height: "40px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.1)"
                }}
            >
                <img
                    src={locationPinIcon}
                    alt="Snap"
                    className="w-4 h-4 mr-2 cursor-pointer hover:scale-110 transition-transform"
                    onClick={handleSnapToGrid}
                    data-testid="helper-pin-icon"
                />
                <span className="text-white font-medium text-[14px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Drag the pin to set your location
                </span>
            </div>

            <div style={{ width: "16px" }}></div>

            {/* Navigation Button */}
            <button
                onClick={fetchUserLocation}
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center overflow-hidden"
                style={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)"
                }}
            >
                <img src={navigationIcon} alt="Nav" className="w-[18px] h-[18px] object-cover" />
            </button>
         </div>
      </div>

      {/* Bottom Sheet */}
      <div
        ref={bottomSheetRef}
        className="absolute bottom-0 left-0 right-0 bg-black rounded-t-[32px] p-6 pb-10 safe-area-bottom z-20 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      >
        <h3 className="text-white text-base font-semibold mb-4">Order will be delivered here</h3>

        {/* Address Container */}
        <div
            className="flex items-start mb-6"
            style={{
                backgroundColor: "#000000",
                border: "1px solid rgba(82, 96, 254, 0.21)",
                borderRadius: "12px",
                paddingTop: "12px",
                paddingBottom: "12px",
                paddingLeft: "14px",
                paddingRight: "14px"
            }}
        >
          <img src={locationPinIcon} alt="Loc" className="w-5 h-5 mt-1 shrink-0 mr-3" />

          <div className="flex-1">
             {/* Changed to justify-between to push Plus Code to the right */}
             <div className="flex items-center justify-between mb-[6px]">
                {isDragging || isLoading ? (
                    <Skeleton className="h-6 w-3/4 bg-gray-800" />
                ) : (
                    <>
                    <h4 className="text-white font-bold text-[16px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                        {addressTitle}
                    </h4>
                    {plusCode && (
                        <div
                            onClick={copyPlusCode}
                            className="flex items-center gap-1.5 px-3 cursor-pointer hover:bg-white/5 transition-colors"
                            style={{
                                height: "22px",
                                backgroundColor: "rgba(7, 7, 7, 0.85)", // #070707 at 85% opacity
                                borderRadius: "9999px", // 100% pill shaped
                                border: "1px solid rgba(255, 255, 255, 0.12)", // #FFFFFF at 12% opacity
                                display: "inline-flex",
                                alignItems: "center"
                            }}
                            title="Click to copy Plus Code"
                        >
                            <span
                                data-testid="plus-code"
                                className="text-[#5260FE] font-bold text-xs" // text-xs approx 12px, adjust if needed
                                style={{ fontFamily: 'Satoshi, sans-serif' }}
                            >
                                {plusCode}
                            </span>
                            <img src={copyIcon} alt="Copy" className="w-3 h-3" />
                        </div>
                    )}
                    </>
                )}
            </div>

            {isDragging || isLoading ? (
                <Skeleton className="h-4 w-full bg-gray-800 mt-2" />
            ) : (
                <p className="text-gray-400 text-sm leading-relaxed">
                    {addressLine || "Fetching details..."}
                </p>
            )}

          </div>
        </div>

        {/* Distance Callout */}
        {!isDragging && !isLoading && distanceInMeters !== null && distanceInMeters > 200 && (
             <div className="relative w-full flex justify-center -mt-4 mb-6 z-0">
                 <div
                    className="w-full flex items-center justify-center relative"
                    style={{
                        height: "59px",
                        paddingTop: "10px"
                    }}
                 >
                    <img
                        src={distanceCallout}
                        alt=""
                        className="absolute inset-0 w-full h-full object-fill pointer-events-none"
                    />
                    <span
                        className="text-center font-medium text-[14px] relative z-10"
                        style={{
                            fontFamily: 'Satoshi, sans-serif',
                            color: "#FACC15",
                        }}
                    >
                        This is {distanceInMeters < 1000
                            ? `${Math.round(distanceInMeters)}m`
                            : `${(distanceInMeters/1000).toFixed(1)}km`} away from your current location.
                    </span>
                 </div>
             </div>
        )}

        {/* CTA or Warning */}
        {viewState.zoom < 16 ? (
            <div
                className="w-full flex items-center justify-center text-white font-medium text-[14px]"
                style={{
                    marginTop: "12px",
                    height: "45px",
                    backgroundColor: "rgba(255, 0, 0, 0.15)",
                    border: "1px solid rgba(255, 0, 0, 0.22)",
                    borderRadius: "12px",
                    fontFamily: 'Satoshi, sans-serif'
                }}
            >
                Zoom in to place the pin at exact delivery location
            </div>
        ) : (
            <div style={{ marginTop: "24px", opacity: isDragging || isLoading ? 0 : 1, transition: 'opacity 0.2s', visibility: isDragging || isLoading ? 'hidden' : 'visible' }}>
                <button
                    className="w-full flex items-center justify-center"
                    style={{
                        height: "48px",
                        backgroundImage: `url(${confirmCtaBg})`,
                        backgroundSize: "100% 100%",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "transparent",
                        border: "none"
                    }}
                >
                    <span className="text-white font-medium">Confirm Location</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default AddAddress;
