import React, { useState, useEffect, useCallback } from "react";
import Map, { ViewState, ViewStateChangeEvent } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import 'maplibre-gl/dist/maplibre-gl.css';

// Assets
import mapPinIcon from "@/assets/map-pin-icon.svg";
import locationPinIcon from "@/assets/location-pin.svg";
import navigationIcon from "@/assets/navigation-icon.svg";
import confirmCtaBg from "@/assets/confirm-location-cta.png";

const AddAddress = () => {
  const navigate = useNavigate();
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
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      console.log("Fetching address for", lat, lng);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Dynamic Mock Address Logic
      setAddressTitle("Bangalore, India");
      setAddressLine("C-102, Lotus Residency, 5th Cross Road, JP Nagar, Bangalore, Karnataka – 560078");

    } catch (error) {
      console.error("Error fetching address:", error);
      setAddressTitle("Error fetching location");
      setAddressLine("");
    }
  };

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

  useEffect(() => {
    debouncedFetchAddress(viewState.latitude, viewState.longitude);
  }, []);

  return (
    <div className="h-full w-full relative bg-black text-white overflow-hidden">
      {/* Map */}
      <Map
        {...viewState}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        attributionControl={false}
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
            <div className="flex items-center mb-[18px]">
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
        <div className="flex justify-center mt-[18px] pointer-events-auto">
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
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="bg-transparent border-none outline-none flex-1 text-[14px] text-white placeholder-white font-normal font-sans"
                     style={{ fontFamily: 'Satoshi, sans-serif' }}
                 />
             </div>
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
      {/* 280px from bottom to clear the bottom sheet */}
      <div className="absolute bottom-[280px] left-0 right-0 z-10 flex items-center justify-center pointer-events-none">
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
                <span className="text-white font-medium text-[14px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                    Drag the pin to set your location
                </span>
            </div>

            <div style={{ width: "16px" }}></div>

            {/* Navigation Button */}
            <button
                onClick={() => {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                            setViewState(prev => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
                            debouncedFetchAddress(pos.coords.latitude, pos.coords.longitude);
                        });
                    }
                }}
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center overflow-hidden"
                style={{
                    backgroundColor: "#1A1A1A",
                    border: "1px solid rgba(255,255,255,0.1)"
                }}
            >
                <img src={navigationIcon} alt="Nav" className="w-full h-full object-cover" />
            </button>
         </div>
      </div>

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-black rounded-t-[32px] p-6 pb-10 safe-area-bottom z-20 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
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
            <h4 className="text-white font-bold text-[16px] mb-[6px]" style={{ fontFamily: 'Satoshi, sans-serif' }}>
                {addressTitle}
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {addressLine || "Fetching details..."}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: "24px" }}>
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
      </div>
    </div>
  );
};

export default AddAddress;
