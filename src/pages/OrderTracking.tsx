import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Map, { Marker, Source, Layer, LineLayer } from "react-map-gl/maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';
import { ChevronLeft } from "lucide-react";
import { OpenLocationCode } from "open-location-code";

import arrivingIcon from "@/assets/arriving.svg";
import riderIcon from "@/assets/rider.svg";
import verifiedIcon from "@/assets/verified.svg";
import callIcon from "@/assets/call.svg";
import awaitingPng from "@/assets/awaiting-otp.png";
import currentLocationIcon from "@/assets/current-location.svg";

const OrderTracking = () => {
  const navigate = useNavigate();

  // Map State
  const [viewState, setViewState] = useState({
      latitude: 12.9716, // Default Bangalore
      longitude: 77.5946,
      zoom: 14.5
  });

  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);

  // Loader Animation State
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    // 1. Get active order from localStorage
    const activeOrderStr = localStorage.getItem("dotpe_active_order");
    if (activeOrderStr) {
        try {
            const activeOrder = JSON.parse(activeOrderStr);
            if (activeOrder.address && activeOrder.address.plusCode) {
                 // 2. Decode Plus Code
                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                 const olc = new OpenLocationCode() as any;
                 const decoded = olc.decode(activeOrder.address.plusCode);
                 const newLat = decoded.latitudeCenter;
                 const newLng = decoded.longitudeCenter;

                 // 3. Update View State & User Location
                 setViewState(prev => ({
                     ...prev,
                     latitude: newLat,
                     longitude: newLng
                 }));
                 setUserLocation({ latitude: newLat, longitude: newLng });
            }
        } catch (e) {
            console.error("Failed to parse active order or decode location", e);
        }
    }

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic coordinates
  // If userLocation is set, use it. Otherwise fall back to viewState (default or updated)
  const currentLat = userLocation?.latitude || viewState.latitude;
  const currentLng = userLocation?.longitude || viewState.longitude;

  // Simulate Rider Location (offset from user)
  const riderLat = currentLat + 0.003;
  const riderLng = currentLng + 0.004;

  const routeGeoJson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [currentLng, currentLat], // User
        [currentLng + 0.001, currentLat + 0.001],
        [currentLng + 0.001, currentLat + 0.003],
        [riderLng, riderLat], // Rider
      ],
    },
  };

  const routeLayer: LineLayer = {
    id: "route-line",
    type: "line",
    paint: {
      "line-color": "#5260FE",
      "line-width": 4,
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a12] flex flex-col safe-area-top safe-area-bottom pb-8 overflow-y-auto">

      {/* Header Overlay */}
      <div className="fixed top-0 left-0 right-0 z-20 px-5 pt-4 flex items-center justify-between pointer-events-none">
          {/* Back Button (Pointer events auto to allow click) */}
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center pointer-events-auto"
          >
             <ChevronLeft className="text-white w-6 h-6" />
          </button>

          <h1 className="text-white text-[18px] font-medium font-sans pointer-events-auto">
            Order Tracking
          </h1>

          <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Map Container */}
      <div
        className="w-full relative overflow-hidden shrink-0 rounded-b-[32px]"
        style={{ height: "305px" }}
      >
          <Map
             {...viewState}
             onMove={evt => setViewState(evt.viewState)}
             style={{ width: "100%", height: "100%" }}
             mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
             attributionControl={false}
          >
             {/* Route Line */}
             <Source id="route" type="geojson" data={routeGeoJson}>
                 <Layer {...routeLayer} />
             </Source>

             {/* User Marker */}
             <Marker latitude={currentLat} longitude={currentLng}>
                 <img src={currentLocationIcon} alt="User" className="w-6 h-6" />
             </Marker>

             {/* Rider Marker */}
             <Marker
                latitude={riderLat}
                longitude={riderLng}
             >
                 <img src={riderIcon} alt="Rider" className="w-10 h-10" />
             </Marker>
          </Map>
      </div>

      {/* Status Container */}
      <div className="px-3 mt-[12px]">
        <div
            className="w-full rounded-[13px] relative"
            style={{
                height: "135px",
                backgroundColor: "#111111", // Dark container bg
                border: "1px solid rgba(255,255,255,0.05)"
            }}
        >
            <div className="absolute top-[12px] left-[13px]">
                <p className="text-[#707070] text-[14px] font-bold font-sans leading-none">
                    ARRIVING IN
                </p>
                <p className="text-white text-[20px] font-bold font-sans mt-[1px] leading-none">
                    8 Mins
                </p>
            </div>

            <div className="absolute top-[12px] right-[13px]">
                <img src={arrivingIcon} alt="Arriving" className="w-[31px] h-[31px]" />
            </div>

            {/* Loader */}
            <div className="absolute top-[65px] left-[13px] right-[13px] h-[9px] bg-[#302655] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#5260FE] rounded-full transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="absolute top-[86px] left-[13px]">
                 <p className="text-white text-[12px] font-medium font-sans leading-tight">
                    Your order is packed and is ready to pickup!
                 </p>
                 <p className="text-[#D0D0D0] text-[12px] font-light font-sans mt-[3px] leading-tight">
                    Delivery partner is on the way to pick up your order.
                 </p>
            </div>
        </div>
      </div>

      {/* Rider Details Container */}
      <div className="px-3 mt-[12px]">
        <div
            className="w-full rounded-[13px] p-[12px] relative"
            style={{
                height: "319px",
                backgroundColor: "rgba(25, 25, 25, 0.31)",
            }}
        >
            <div className="flex items-start">
                {/* Photo Frame */}
                <div className="w-[81px] h-[89px] relative shrink-0">
                    <img
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
                        alt="Rider"
                        className="w-full h-full object-cover rounded-[6px]"
                    />
                    {/* Verified Banner */}
                    <div className="absolute bottom-0 left-0 right-0 h-[18px] bg-[#16B751] rounded-b-[6px] flex items-center justify-center gap-1">
                        <img src={verifiedIcon} alt="V" className="w-3 h-3" />
                        <span className="text-white text-[10px] font-medium font-sans">Verified</span>
                    </div>
                </div>

                {/* Rider Info */}
                <div className="ml-[15px] pt-0 flex-1">
                    <div className="flex justify-between items-start">
                        <p className="text-white text-[15px] font-bold font-sans leading-tight">
                            Hi, I’m Rohit Khandelwal,<br/>
                            your delivery partner
                        </p>
                        <button className="w-[32px] h-[32px] shrink-0">
                            <img src={callIcon} alt="Call" className="w-full h-full" />
                        </button>
                    </div>

                    {/* CTA View KYC */}
                    <button
                        className="mt-[14px] bg-[#1CB956] rounded-[8px] h-[36px] w-[248px] text-white text-[13px] font-medium font-sans flex items-center justify-center"
                    >
                        View KYC
                    </button>
                </div>
            </div>

            {/* KYC Text */}
            <p className="mt-[12px] text-[#D0D0D0] opacity-50 text-[14px] font-normal font-sans leading-snug">
                Your delivery partner is KYC Verified. Please check the KYC details while accepting the order.
            </p>

            {/* Divider */}
            <div className="mt-[7px] w-full h-[1px] bg-[#202020]" />

            {/* OTP Section */}
            <div className="mt-[13px]">
                <p className="text-white text-[15px] font-bold font-sans">
                    Please provide this OTP to confirm the delivery
                </p>
                <div className="mt-[12px] flex gap-3">
                    {['1', '3', '0', '5', '9', '6'].map((digit, i) => (
                         <div
                            key={i}
                            className="w-[45px] h-[56px] rounded-[12px] bg-[#1A1A1A] border border-[#333] flex items-center justify-center"
                         >
                             <span className="text-white text-[32px] font-bold font-sans">{digit}</span>
                         </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-[12px] flex items-center gap-2">
                 <img src={awaitingPng} alt="Awaiting" className="w-5 h-5" />
                 <span className="text-[#D0D0D0] text-[14px] font-normal font-sans">
                    Awaiting delivery confirmation.
                 </span>
            </div>
        </div>
      </div>

      {/* Need Help CTA */}
      <div className="px-5 mt-[16px]">
         <button className="w-full h-[52px] rounded-full border border-white/20 text-white text-[16px] font-medium font-sans flex items-center justify-center bg-transparent">
             Need Help?
         </button>
      </div>

    </div>
  );
};

export default OrderTracking;
