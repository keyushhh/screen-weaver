import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Map, { Marker, Source, Layer, LineLayer } from "react-map-gl/maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';
import { OpenLocationCode } from "open-location-code";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.png";
import hamburgerMenu from "@/assets/hamburger-menu.svg";
import currentLocationIcon from "@/assets/current-location.svg";
import deliveryRiderIcon from "@/assets/delivery-rider.svg";
import buttonPrimary from "@/assets/button-primary-wide.png";

const OrderCashSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalAmount, savedAddress } = location.state || {};

  // Map State
  const [viewState, setViewState] = useState({
      latitude: 12.9716,
      longitude: 77.5946,
      zoom: 13
  });

  // Decode Plus Code or use default
  useEffect(() => {
      if (savedAddress?.plusCode) {
          try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const olc = new OpenLocationCode() as any;
              const decoded = olc.decode(savedAddress.plusCode);
              setViewState({
                  latitude: decoded.latitudeCenter,
                  longitude: decoded.longitudeCenter,
                  zoom: 14
              });
          } catch (e) {
              console.error("Failed to decode Plus Code", e);
          }
      }
  }, [savedAddress]);

  // Generate random transaction ID and date once
  const [transactionDetails] = useState(() => {
    const randomId = "20" + Math.random().toString(36).substring(2, 12).toUpperCase();
    const now = new Date();
    // Format: 15 June 2025, 11:38 PM
    const dateStr = now.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
    });

    return {
        id: randomId,
        dateTime: `${dateStr}, ${timeStr}`
    };
  });

  const getAddressDisplay = () => {
    if (!savedAddress) return "Unknown Location";
    const parts = [savedAddress.house, savedAddress.area, savedAddress.city];
    return parts.filter(Boolean).join(", ");
  };

  const routeGeoJson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [
        [viewState.longitude, viewState.latitude],
        [viewState.longitude + 0.002, viewState.latitude + 0.002],
      ],
    },
  };

  const routeLayer: LineLayer = {
    id: "route-line",
    type: "line",
    paint: {
      "line-color": "#5260FE",
      "line-width": 2,
      "line-dasharray": [2, 1],
    },
  };

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col safe-area-top safe-area-bottom animate-in fade-in duration-500"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${successBg})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="flex-none px-5 pt-4 flex items-center justify-between z-10 mb-[21px]">
        <div className="w-6" /> {/* Spacer */}
        <h1 className="text-white text-[18px] font-medium font-sans">
          Order Successful
        </h1>
        <button className="w-6 h-6 flex items-center justify-center">
            <img src={hamburgerMenu} alt="Menu" className="w-full h-full" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-[100px] no-scrollbar flex flex-col items-center">
          {/* Check Icon */}
          <div className="w-[62px] h-[62px] mb-[35px]">
              <img src={checkIcon} alt="Success" className="w-full h-full object-contain" />
          </div>

          {/* Status Text */}
          <h2 className="text-white text-[18px] font-bold font-sans mb-[1px]">
              Your order is being processed!
          </h2>

          {/* Amount */}
          <p className="text-white text-[25px] font-medium font-sans mb-[39px]">
              ₹{(totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>

          {/* Delivery Container */}
          <div className="w-full mb-[16px] flex flex-col">
              {/* Header Row (Top Container) */}
              <div
                  className="w-full px-[16px] py-[9px] flex justify-between items-start z-10 shrink-0 rounded-t-[14px]"
                  style={{
                      background: "linear-gradient(to bottom, #000000 0%, rgba(0,0,0,0) 100%)",
                  }}
              >
                  <span className="text-white text-[12px] font-medium font-sans whitespace-nowrap mr-2">
                      Delivering to - {savedAddress?.tag || "Home"}
                  </span>
                  <span className="text-white text-[12px] font-medium font-sans text-right leading-tight">
                      {getAddressDisplay()}
                  </span>
              </div>

              {/* Status & Map Container (Bottom Container) */}
              <div
                  className="w-full rounded-b-[14px] flex"
                  style={{
                      backgroundColor: "rgba(25, 25, 25, 0.34)",
                      padding: "12px",
                      marginTop: 0
                  }}
              >
                  {/* Left Text */}
                  <div className="flex-1 flex flex-col justify-start pr-2">
                      <p className="text-white text-[14px] font-medium font-sans leading-snug mb-[12px]">
                          We’re assigning a delivery<br />partner soon!
                      </p>
                      <p className="text-white text-[12px] font-light font-sans leading-snug mb-[4px]">
                          Assigning a delivery partner in the next 2 minutes.
                      </p>
                  </div>

                  {/* Mini Map */}
                  <div
                    className="shrink-0 relative rounded-[8px] overflow-hidden"
                    style={{
                        width: "130px",
                        height: "130px",
                        backgroundColor: "#1A1A1A"
                    }}
                  >
                       <Map
                           {...viewState}
                           style={{ width: "100%", height: "100%" }}
                           mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                           attributionControl={false}
                           interactive={false}
                       >
                           {/* Dashed Route Line */}
                           <Source id="route" type="geojson" data={routeGeoJson}>
                               <Layer {...routeLayer} />
                           </Source>

                           {/* Delivery/User Location Marker */}
                           <Marker latitude={viewState.latitude} longitude={viewState.longitude}>
                               <img src={currentLocationIcon} alt="User" className="w-4 h-4" />
                           </Marker>

                           {/* Mock Rider Marker (slightly offset) */}
                           <Marker
                                latitude={viewState.latitude + 0.002}
                                longitude={viewState.longitude + 0.002}
                           >
                                <img src={deliveryRiderIcon} alt="Rider" className="w-6 h-6" />
                           </Marker>
                       </Map>
                  </div>
              </div>
          </div>

          {/* Transaction Details Container */}
          <div
            className="w-full rounded-[13px] p-[12px] mb-[29px]"
            style={{
                height: "239px",
                backgroundColor: "rgba(25, 25, 25, 0.34)"
            }}
          >
              <h3 className="text-white text-[16px] font-medium font-sans">
                  Transaction Details
              </h3>
              <div className="w-full h-[1px] bg-[#202020] mt-[10px] mb-[10px]" />

              <div className="flex justify-between items-center mb-[8px]">
                  <span className="text-white text-[13px] font-normal font-sans">Transaction Number</span>
                  <span className="text-white text-[13px] font-bold font-sans">{transactionDetails.id}</span>
              </div>

              <div className="flex justify-between items-center mb-[8px]">
                  <span className="text-white text-[13px] font-normal font-sans">Date & Time</span>
                  <span className="text-white text-[13px] font-bold font-sans">{transactionDetails.dateTime}</span>
              </div>

              <div className="flex justify-between items-center mb-[12px]">
                  <span className="text-white text-[13px] font-normal font-sans">Payment Mode</span>
                  <span className="text-white text-[13px] font-bold font-sans">Dot.Pe Wallet</span>
              </div>

              <p className="text-white/50 text-[13px] font-normal font-sans mb-[14px] leading-snug">
                  No charges yet — your wallet will only be debited after you confirm the delivery.
              </p>

              <p className="text-white text-[13px] font-normal font-sans leading-snug">
                  If you need to cancel, you can do so within 30 seconds or before a delivery partner is assigned, whichever is earlier.
              </p>
          </div>

          {/* Footer CTA */}
          <div className="w-full">
            <button
                onClick={() => navigate("/home")}
                className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans"
                style={{
                    backgroundImage: `url(${buttonPrimary})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                }}
            >
                Go Home
            </button>
          </div>
      </div>
    </div>
  );
};

export default OrderCashSuccess;
