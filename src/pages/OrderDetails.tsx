import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Map, { Marker, Source, Layer, LineLayer } from "react-map-gl/maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';
import { OpenLocationCode } from "open-location-code";
import { supabase } from "@/lib/supabase";
import successBg from "@/assets/success-bg.png";
import errorBg from "@/assets/error-bg.png";
import popBgDefault from "@/assets/pop-bg-default.png";
import popBgExpanded from "@/assets/pop-bg-expanded.png";
import checkIcon from "@/assets/check-icon.png";
import crossIcon from "@/assets/cross-icon.png";
import hamburgerMenu from "@/assets/hamburger-menu.svg";
import currentLocationIcon from "@/assets/current-location.svg";
import deliveryRiderIcon from "@/assets/delivery-rider.svg";
import buttonPrimary from "@/assets/button-primary-wide.png";
import infoIcon from "@/assets/delivery-tip-info.svg";
import closeIcon from "@/assets/cross-icon.svg";
import cancelIcon from "@/assets/cancel-ico.svg";
import radioFilled from "@/assets/radio-fill.svg";
import radioEmpty from "@/assets/radio-empty.svg";
import { Order, dev_updateOrderStatus } from "@/lib/orders";

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Map State
  const [viewState, setViewState] = useState({
      latitude: 12.9716,
      longitude: 77.5946,
      zoom: 13
  });

  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelReason, setCancelReason] = useState<number | null>(0);
  const [otherReason, setOtherReason] = useState("");
  const [timer, setTimer] = useState(30);

  const cancelReasons = [
      "I changed my mind",
      "Wrong address selected",
      "Payment issue",
      "Expected quicker delivery",
      "Found a better alternative",
      "Other"
  ];

  // Refs for click outside
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Fetch Order logic
  useEffect(() => {
      const fetchOrder = async () => {
          if (location.state?.order) {
              setOrder(location.state.order);
              setLoading(false);
              return;
          }

          if (orderId) {
              try {
                  const { data, error } = await supabase
                      .from('orders')
                      .select('*, addresses(*)')
                      .eq('id', orderId)
                      .single();

                  if (data) {
                      setOrder(data as Order);
                  } else {
                      console.error("Order not found", error);
                  }
              } catch (e) {
                  console.error("Failed to fetch order", e);
              } finally {
                  setLoading(false);
              }
          }
      };
      fetchOrder();
  }, [orderId, location.state]);

  // Timer Logic (mock countdown for "Assigning partner")
  useEffect(() => {
    if (order?.status === 'processing' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, order?.status]);

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Decode Plus Code or use default
  useEffect(() => {
      if (order?.addresses?.plus_code) {
          try {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const olc = new OpenLocationCode() as any;
              const decoded = olc.decode(order.addresses.plus_code);
              setViewState({
                  latitude: decoded.latitudeCenter,
                  longitude: decoded.longitudeCenter,
                  zoom: 14
              });
          } catch (e) {
              console.error("Failed to decode Plus Code", e);
          }
      } else if (order?.addresses?.latitude && order?.addresses?.longitude) {
           setViewState({
               latitude: order.addresses.latitude,
               longitude: order.addresses.longitude,
               zoom: 14
           });
      }
  }, [order]);

  const handleCancelOrder = async () => {
      if (!order) return;

      try {
          const reasonText = cancelReason === 5 ? otherReason : cancelReasons[cancelReason || 0];

          const { error } = await supabase
              .from('orders')
              .update({
                  status: 'cancelled',
                  metadata: {
                      // @ts-ignore
                      ...(order.metadata || {}),
                      cancelled_by: 'user',
                      cancel_reason_type: reasonText,
                      cancelled_at: new Date().toISOString()
                  }
              })
              .eq('id', order.id);

          if (error) throw error;

          // Optimistic update
          setOrder({ ...order, status: 'cancelled' });
          setShowCancelPopup(false);

          // Navigate to cancelled screen (or re-render this screen as cancelled)
          // The requirement says "Order Details screen... Render different layouts based on status".
          // So we should just stay here and let the UI update to "cancelled" state.
          // However, existing flow navigated to '/order-cancelled'.
          // Let's stick to the new requirement: "Order Details screen... Render... cancelled".
          // So we update state and stay here.

      } catch (e) {
          console.error("Failed to cancel order", e);
      }
  };

  const getAddressDisplay = () => {
    if (!order?.addresses) return "Unknown Location";
    const parts = [order.addresses.apartment, order.addresses.area];
    const fullString = parts.filter(Boolean).join(", ");
    return fullString.length > 20 ? fullString.substring(0, 20) + "..." : fullString;
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

  if (loading || !order) {
      return <div className="h-full w-full bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  // --- CONFIG FOR DIFFERENT STATES ---
  const getStatusConfig = (currentOrder: Order) => {
      // Default / Processing
      let config = {
          bgImage: successBg,
          mainIcon: checkIcon,
          headerTitle: "Order Successful",
          statusTitle: "Your order is being processed!",
          statusAmount: currentOrder.amount,
          showMap: true,
          deliveryText: "We’re assigning a delivery\npartner soon!",
          deliverySubText: "Assigning a delivery partner in the next 2 minutes.",
          transactionNote: "No charges yet — your wallet will only be debited after you confirm the delivery.",
          canCancel: true
      };

      if (currentOrder.status === 'success' || currentOrder.status === 'delivered') {
          config = {
              bgImage: successBg,
              mainIcon: checkIcon,
              headerTitle: "Order Delivered",
              statusTitle: "Order delivered successfully!",
              statusAmount: currentOrder.amount,
              showMap: true,
              deliveryText: "Order Delivered",
              deliverySubText: "Your package has arrived.",
              transactionNote: "Amount deducted from your wallet.",
              canCancel: false
          };
      } else if (currentOrder.status === 'failed') {
          config = {
              bgImage: errorBg,
              mainIcon: crossIcon,
              headerTitle: "Order Failed",
              statusTitle: "Order could not be processed",
              statusAmount: currentOrder.amount,
              showMap: false,
              deliveryText: "Payment Failed",
              // @ts-ignore
              deliverySubText: currentOrder.metadata?.failure_reason || "Something went wrong.",
              transactionNote: "If any amount was deducted, it will be refunded instantly.",
              canCancel: false
          };
      } else if (currentOrder.status === 'cancelled') {
          config = {
              bgImage: errorBg,
              mainIcon: cancelIcon,
              headerTitle: "Order Cancelled",
              statusTitle: "Order Cancelled",
              statusAmount: currentOrder.amount,
              showMap: false,
              deliveryText: "Order Cancelled",
              // @ts-ignore
              deliverySubText: currentOrder.metadata?.cancel_reason_type || "Order cancelled by user.",
              transactionNote: "Refund has been initiated to your wallet.",
              canCancel: false
          };
      }

      return config;
  };

  const statusConfig = getStatusConfig(order);

  // --- RENDER ---
  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col safe-area-top safe-area-bottom animate-in fade-in duration-500 relative"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${statusConfig.bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* DEV CONTROLS */}
      {import.meta.env.DEV && (
          <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-2 bg-black/90 p-2 rounded-lg border border-red-500/50 shadow-xl pointer-events-auto">
              <span className="text-white text-[10px] font-bold text-center border-b border-white/20 pb-1">DEV CONTROLS</span>
              <button
                onClick={async () => {
                    try {
                        await dev_updateOrderStatus(order.id, 'success');
                    } catch (e) {
                        console.error("Dev update failed (likely RLS), proceeding with local mock", e);
                    }
                    setOrder({ ...order, status: 'success' });
                }}
                className="px-2 py-1 bg-green-600 text-white text-[10px] rounded hover:bg-green-500"
              >
                  Set Success
              </button>
              <button
                onClick={async () => {
                    try {
                        await dev_updateOrderStatus(order.id, 'failed');
                    } catch (e) {
                        console.error("Dev update failed (likely RLS), proceeding with local mock", e);
                    }
                    setOrder({ ...order, status: 'failed' });
                }}
                className="px-2 py-1 bg-red-600 text-white text-[10px] rounded hover:bg-red-500"
              >
                  Set Failed
              </button>
              <button
                onClick={async () => {
                    try {
                        await dev_updateOrderStatus(order.id, 'cancelled');
                    } catch (e) {
                        console.error("Dev update failed (likely RLS), proceeding with local mock", e);
                    }
                    setOrder({ ...order, status: 'cancelled', metadata: { ...order.metadata, cancel_reason_type: 'Simulated dev cancellation' } as any });
                }}
                className="px-2 py-1 bg-gray-600 text-white text-[10px] rounded hover:bg-gray-500"
              >
                  Set Cancelled
              </button>
          </div>
      )}

      {/* Header */}
      <div className="flex-none px-5 pt-4 flex items-center justify-between z-10 mb-[21px] relative">
        <div className="w-6" /> {/* Spacer */}
        <h1 className="text-white text-[18px] font-medium font-sans">
          {statusConfig.headerTitle}
        </h1>
        <button
          ref={hamburgerRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-6 h-6 flex items-center justify-center"
        >
            <img src={hamburgerMenu} alt="Menu" className="w-full h-full" />
        </button>

        {/* Hamburger Menu Dropdown */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-[50px] right-[20px] rounded-[12px] flex flex-col items-start overflow-hidden z-50 border border-white/20"
            style={{
              width: "145px",
              height: "auto",
              minHeight: "69px",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Need Help? */}
            <button className="w-full text-left px-[12px] py-[8px] text-white text-[12px] font-medium font-sans hover:bg-white/10 transition-colors">
              Need Help?
            </button>

            {/* Divider (Only if canCancel) */}
            {statusConfig.canCancel && <div className="w-full h-[0.5px]" />}

            {/* Cancel Order (Only if canCancel) */}
            {statusConfig.canCancel && (
            <div
              className="w-full px-[12px] py-[8px] flex items-start justify-between cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => {
                  if (timer > 0) {
                      setShowCancelPopup(true);
                      setIsMenuOpen(false);
                  }
              }}
            >
              <span className={`text-[12px] font-medium font-sans ${timer === 0 ? 'text-[#878787]' : 'text-white'}`}>
                {timer > 0 ? `Cancel Order (${timer}s)` : 'Cancel Order (unavailable)'}
              </span>
              {timer === 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfoPopup(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-[14px] h-[14px] ml-1 flex-shrink-0 mt-[2px]"
                >
                  <img src={infoIcon} alt="Info" className="w-full h-full" />
                </button>
              )}
            </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden px-5 pb-[10px] flex flex-col items-center">
          {/* Main Icon */}
          <div className="w-[62px] h-[62px] mb-[35px]">
              <img src={statusConfig.mainIcon} alt="Status" className="w-full h-full object-contain" />
          </div>

          {/* Status Text */}
          <h2 className="text-white text-[18px] font-bold font-sans mb-[1px]">
              {statusConfig.statusTitle}
          </h2>

          {/* Amount */}
          <p className="text-white text-[25px] font-medium font-sans mb-[39px]">
              ₹{(statusConfig.statusAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>

          {/* Delivery Container */}
          <div className="w-full mb-[16px] flex flex-col">
              {/* Header Row (Top Container) */}
              <div
                  className="w-full px-[16px] py-[9px] flex justify-between items-start z-10 shrink-0 rounded-t-[14px]"
                  style={{
                      backgroundColor: "#000000",
                  }}
              >
                  <span className="text-white text-[12px] font-medium font-sans whitespace-nowrap mr-2">
                      Delivering to - {order.addresses?.label || "Home"}
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
                      <p className="text-white text-[14px] font-medium font-sans leading-snug mb-[12px] whitespace-pre-line">
                          {statusConfig.deliveryText}
                      </p>
                      <p className="text-white text-[12px] font-light font-sans leading-snug mb-[4px]">
                          {statusConfig.deliverySubText}
                      </p>
                  </div>

                  {/* Mini Map (Only if showMap is true) */}
                  {statusConfig.showMap && (
                  <div
                    className="shrink-0 relative rounded-[8px] overflow-hidden"
                    style={{
                        width: "110px",
                        height: "82px",
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

                           {/* Mock Rider Marker (only for processing?) */}
                           {order.status === 'processing' && (
                           <Marker
                                latitude={viewState.latitude + 0.002}
                                longitude={viewState.longitude + 0.002}
                           >
                                <img src={deliveryRiderIcon} alt="Rider" className="w-6 h-6" />
                           </Marker>
                           )}
                       </Map>
                  </div>
                  )}
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
                  <span className="text-white text-[13px] font-bold font-sans">{order.id.slice(0, 8).toUpperCase()}...</span>
              </div>

              <div className="flex justify-between items-center mb-[8px]">
                  <span className="text-white text-[13px] font-normal font-sans">Date & Time</span>
                  <span className="text-white text-[13px] font-bold font-sans">
                      {new Date(order.created_at).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'
                      })}
                  </span>
              </div>

              <div className="flex justify-between items-center mb-[12px]">
                  <span className="text-white text-[13px] font-normal font-sans">Payment Mode</span>
                  <span className="text-white text-[13px] font-bold font-sans">grid.pe Wallet</span>
              </div>

              <p className="text-white/50 text-[13px] font-normal font-sans mb-[14px] leading-snug">
                  {statusConfig.transactionNote}
              </p>

              {statusConfig.canCancel && (
              <p className="text-white text-[13px] font-normal font-sans leading-snug">
                  If you need to cancel, you can do so within 30 seconds or before a delivery partner is assigned, whichever is earlier.
              </p>
              )}
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

      {/* Info Popup (Toaster) */}
      {showInfoPopup && (
        <div
          className="absolute inset-0 z-50 flex items-start justify-center pt-4 bg-black/50 backdrop-blur-sm safe-area-top"
          onClick={() => {
              setShowInfoPopup(false);
              setIsMenuOpen(true);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-[12px] border border-white/20 p-[12px] flex items-start"
            style={{
              width: "362px",
              height: "auto",
              minHeight: "79px",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
             <p className="text-white text-[12px] font-medium font-sans leading-[1.4] pr-6">
                The cancellation window has expired. <br />
                If something went wrong or you need help, we’ve got your back — reach out anytime.
             </p>
             <button
                onClick={() => {
                    setShowInfoPopup(false);
                    setIsMenuOpen(true);
                }}
                className="absolute top-[12px] right-[12px] w-[16px] h-[16px]"
             >
                <img src={closeIcon} alt="Close" className="w-full h-full" />
             </button>
          </div>
        </div>
      )}

      {/* Cancel Order Popup */}
      {showCancelPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-5">
              <div
                  className="relative rounded-[13px] p-[22px] w-full max-w-[353px] flex flex-col items-center border border-white/10"
                  style={{
                      backgroundImage: `url(${cancelReason === 5 ? popBgExpanded : popBgDefault})`,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                  }}
              >
                  {/* Icon */}
                  <div className="w-[32px] h-[32px] mb-[16px]">
                      <img src={cancelIcon} alt="Cancel" className="w-full h-full" />
                  </div>

                  {/* Header */}
                  <h2 className="text-white text-[18px] font-bold font-sans mb-[8px] text-center">
                      Cancel Order?
                  </h2>

                  {/* Subtext */}
                  <p className="text-white text-[13px] font-medium font-sans text-center leading-[1.4] mb-[24px] px-[13px]">
                      We’re not mad. Just disappointed. Help us understand why<br/>
                      you’re cancelling. It helps us improve your experience (and<br/>
                      emotionally prepare for this moment).
                  </p>

                  {/* Reason List Container */}
                  <div
                    className="flex flex-col mb-[24px] overflow-hidden w-full"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.60)",
                        borderRadius: "12px",
                    }}
                  >
                      {/* Title inside container */}
                      <div className="pt-[14px] px-[12px]">
                           <p className="text-white text-[12px] font-medium font-sans">
                              Reason for Cancellation? (Required)
                           </p>
                      </div>

                      {/* Divider */}
                      <div className="mt-[14px] w-full h-[1px] bg-white/10" />

                      {/* List */}
                      <div>
                          {cancelReasons.map((reason, index) => (
                              <div
                                  key={index}
                                  onClick={() => setCancelReason(index)}
                                  className={`w-full h-[44px] flex items-center px-[12px] cursor-pointer ${
                                      index !== cancelReasons.length - 1 ? 'border-b border-white/5' : ''
                                  } hover:bg-white/5 transition-colors`}
                              >
                                  <img
                                      src={cancelReason === index ? radioFilled : radioEmpty}
                                      alt="radio"
                                      className="w-[16px] h-[16px] mr-[12px]"
                                  />
                                  <span className="text-white text-[13px] font-medium font-sans">
                                      {reason}
                                  </span>
                              </div>
                          ))}
                      </div>

                       {/* Other Input */}
                       {cancelReason === 5 && (
                          <div className="w-full p-[12px] animate-in fade-in slide-in-from-top-2 duration-200">
                              <textarea
                                  value={otherReason}
                                  onChange={(e) => setOtherReason(e.target.value)}
                                  placeholder="Tell us more..."
                                  className="w-full h-[80px] bg-white/5 rounded-[12px] border border-white/10 p-[12px] text-white text-[13px] font-sans focus:outline-none focus:border-white/20 resize-none placeholder:text-[#6F6F6F]"
                              />
                          </div>
                      )}
                  </div>

                  {/* Buttons */}
                  <div className="w-full flex gap-[12px] justify-center">
                      <button
                          onClick={() => setShowCancelPopup(false)}
                          className="rounded-full text-white text-[14px] font-medium font-sans flex items-center justify-center shrink-0"
                          style={{
                              width: '158px',
                              height: '37px',
                              backgroundImage: `url(${buttonPrimary})`,
                              backgroundSize: "100% 100%",
                              backgroundRepeat: "no-repeat",
                              }}
                          >
                              Fine, I'll stay
                          </button>
                          <button
                              onClick={handleCancelOrder}
                              className="rounded-full bg-[#FF3B30] text-white text-[14px] font-medium font-sans hover:bg-[#FF3B30]/90 transition-colors shrink-0 flex items-center justify-center"
                              style={{
                                  width: '158px',
                                  height: '37px',
                              }}
                          >
                              Pull the plug
                          </button>
                      </div>
                  </div>
              </div>
          )}
        </div>
      );
  }

export default OrderDetails;
