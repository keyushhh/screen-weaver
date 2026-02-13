import React from "react";
import { X } from "lucide-react";
import Map, { Marker, Source, Layer } from "react-map-gl/maplibre";
import 'maplibre-gl/dist/maplibre-gl.css';
import { Order } from "@/lib/orders";
import processingIcon from "@/assets/processing.svg";
import successIcon from "@/assets/success.svg";
import failedIcon from "@/assets/failed.svg";
import refreshIcon from "@/assets/refresh.svg";
import checkIcon from "@/assets/check.svg";
import crossIcon from "@/assets/cross.svg";
import currentLocationIcon from "@/assets/current-location.svg";
import deliveryRiderIcon from "@/assets/delivery-rider.svg";
import hourGlassIcon from "@/assets/hour-glass.svg";
import transactionDetailsBg from "@/assets/transaction-details.png";
import darkCtaBg from "@/assets/darkbg-cta.png";

interface OrderDetailsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    onCancel?: (orderId: string) => void;
}

const OrderDetailsSheet: React.FC<OrderDetailsSheetProps> = ({ isOpen, onClose, order, onCancel }) => {
    if (!isOpen || !order) return null;

    const formatOrderDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();

            const timeStr = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            if (isToday) {
                return `Today | ${timeStr}`;
            } else {
                const day = date.getDate().toString().padStart(2, '0');
                const month = date.toLocaleString('en-GB', { month: 'short' });
                return `${day} ${month} | ${timeStr}`;
            }
        } catch (e) {
            return "Today | 12:00 PM";
        }
    };

    const getStatusConfig = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'processing' || s === 'out_for_delivery' || s === 'arrived') {
            return {
                color: '#FACC15',
                bgOpacity: 0.21,
                icon: processingIcon,
                statusIcon: refreshIcon,
                label: 'Processing'
            };
        } else if (s === 'success' || s === 'delivered') {
            return {
                color: '#1CB956',
                bgOpacity: 0.21,
                icon: successIcon,
                statusIcon: checkIcon,
                label: 'Success'
            };
        } else {
            return {
                color: '#FF1E1E',
                bgOpacity: 0.21,
                icon: failedIcon,
                statusIcon: crossIcon,
                label: s === 'cancelled' ? 'Cancelled' : 'Failed'
            };
        }
    };

    const config = getStatusConfig(order.status);
    const isProcessing = ['processing', 'out_for_delivery', 'arrived'].includes(order.status);

    const viewState = {
        latitude: order.addresses?.latitude || 12.9716,
        longitude: order.addresses?.longitude || 77.5946,
        zoom: 14.5
    };

    const routeGeoJson = {
        type: "Feature" as const,
        properties: {},
        geometry: {
            type: "LineString" as const,
            coordinates: [
                [viewState.longitude, viewState.latitude],
                [viewState.longitude + 0.002, viewState.latitude + 0.002],
            ],
        },
    };

    const routeLayer: any = {
        id: "route-line",
        type: "line",
        paint: {
            "line-color": "#5260FE",
            "line-width": 2,
            "line-dasharray": [2, 1],
        },
    };

    if (!isProcessing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className="relative w-full bg-[#0D0D0D] rounded-t-[36px] pt-4 pb-10 px-5 overflow-hidden"
                style={{
                    boxShadow: "0px -4px 20px rgba(0, 0, 0, 0.5)",
                }}
            >


                {/* Order Summary Card - Refined Main Frame */}
                <div
                    className="relative rounded-[13px] overflow-hidden mb-[13px] mx-auto border-[0.63px] border-transparent"
                    style={{
                        width: '362px',
                        height: '137px',
                        backgroundImage: 'linear-gradient(rgba(250, 204, 21, 0.21), rgba(250, 204, 21, 0.21)), linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.20) 100%)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        backdropFilter: 'blur(25.02px)',
                    }}
                >
                    {/* Status Frame - Top Left (Top 25px margin) */}
                    <div className="h-[25px] flex items-center pl-[13.5px]">
                        <div className="flex items-center gap-[6px]">
                            <img src={config.statusIcon} alt="" className="w-[14px] h-[14px]" />
                            <span className="text-[14px] font-bold font-satoshi" style={{ color: config.color }}>
                                {config.label}
                            </span>
                        </div>
                    </div>

                    {/* Inner Frame - starts 25px from top */}
                    <div
                        className="absolute top-[25px] left-0 w-full rounded-[13px]"
                        style={{
                            height: '112px',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                    >
                        {/* Hour Glass Icon */}
                        <img
                            src={hourGlassIcon}
                            alt=""
                            className="absolute top-[17px] left-[17px] w-[35px] h-[35px]"
                        />

                        {/* Order Details Text */}
                        <div className="absolute top-[17px] left-[65px] flex flex-col">
                            <span className="text-white text-[16px] font-satoshi leading-tight">
                                {order.addresses?.label ? `Order to ${order.addresses.label}` : "Cash Order"}
                            </span>
                            <span className="text-white text-[12px] font-medium font-satoshi mt-1">
                                {formatOrderDate(order.created_at)}
                            </span>
                        </div>

                        {/* Price */}
                        <span className="absolute top-[25px] right-[17px] text-white text-[16px] font-medium font-satoshi">
                            ₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>

                        {/* Divider - 13px below icon/text */}
                        <div
                            className="absolute left-[12px] h-[1px]"
                            style={{
                                top: '65px',
                                width: '338px',
                                backgroundColor: '#363636'
                            }}
                        />

                        {/* Order ID Section - 12px below divider */}
                        <div
                            className="absolute left-[17px] right-[17px] flex justify-between items-center px-0"
                            style={{ top: '78px' }}
                        >
                            <span className="text-white text-[12px] font-satoshi font-medium">Order ID</span>
                            <span className="text-white text-[12px] font-bold font-satoshi tracking-wider uppercase">
                                DTP{order.id.substring(0, 8).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Details Separator */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-[0.6px] bg-white/10" />
                    <span className="text-white/40 text-[12px] font-bold tracking-[0.2em]">DETAILS</span>
                    <div className="flex-1 h-[0.6px] bg-white/10" />
                </div>

                {/* Delivery Container - Refined Main Frame */}
                <div
                    className="relative rounded-[13px] overflow-hidden mb-6 mx-auto border-[0.63px] border-transparent"
                    style={{
                        width: '362px',
                        height: '143px',
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.20) 100%)',
                        backgroundOrigin: 'border-box',
                        backgroundClip: 'padding-box, border-box',
                        backdropFilter: 'blur(25.02px)',
                    }}
                >
                    {/* Address Info - 8px from top, 16px from sides */}
                    <div className="absolute top-[8px] left-[16px] right-[16px] flex justify-between items-start z-10">
                        <span className="text-white text-[12px] font-medium font-satoshi">Delivering to - {order.addresses?.label || "Home"}</span>
                        <span className="text-white text-[12px] font-satoshi max-w-[150px] truncate text-right">
                            {order.addresses?.apartment}, {order.addresses?.area}
                        </span>
                    </div>

                    {/* Inner Frame - starts 33px from top */}
                    {isProcessing ? (
                        <div
                            className="absolute top-[33px] left-0 w-full rounded-[13px]"
                            style={{
                                height: '110px',
                                backgroundColor: 'rgba(25, 25, 25, 0.34)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                        >
                            <div className="relative h-full p-[14px]">
                                {/* Status Text Section */}
                                <div className="max-w-[180px]">
                                    <p className="text-white text-[14px] font-medium font-satoshi leading-tight mb-[12px]">
                                        We’re assigning a delivery <br /> partner soon!
                                    </p>
                                    <p className="text-white text-[12px] font-light font-satoshi">Assigning a delivery partner in the next 2 minutes.</p>
                                </div>

                                {/* Precise Map Container */}
                                <div
                                    className="absolute rounded-[6px] overflow-hidden"
                                    style={{
                                        top: '14px',
                                        left: '238px',
                                        width: '110px',
                                        height: '82px'
                                    }}
                                >
                                    <Map
                                        {...viewState}
                                        style={{ width: "100%", height: "100%" }}
                                        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                                        attributionControl={false}
                                        interactive={false}
                                    >
                                        <Source id="route" type="geojson" data={routeGeoJson}>
                                            <Layer {...routeLayer} />
                                        </Source>
                                        <Marker latitude={viewState.latitude} longitude={viewState.longitude}>
                                            <div className="animate-pulse">
                                                <img src={currentLocationIcon} alt="User" className="w-4 h-4" />
                                            </div>
                                        </Marker>
                                        <Marker latitude={viewState.latitude + 0.002} longitude={viewState.longitude + 0.002}>
                                            <img src={deliveryRiderIcon} alt="Rider" className="w-5 h-5" />
                                        </Marker>
                                    </Map>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="absolute top-[33px] left-[-0.63px] right-[-0.63px] h-[110px] flex items-center justify-center rounded-[13px] border border-dashed border-white/10 bg-black/20"
                        >
                            <span className="text-white/20 text-[12px] font-satoshi">Delivery Completed</span>
                        </div>
                    )}
                </div>

                {/* Transaction Details */}
                <div
                    className="w-full rounded-[12px] overflow-hidden mb-8 relative border border-[#202020]/50 mx-auto"
                    style={{
                        width: '362px',
                        height: '249px',
                        backgroundImage: `url(${transactionDetailsBg})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        padding: '12px 12px 17px 12px'
                    }}
                >
                    <h3 className="text-white text-[16px] font-medium font-satoshi">Transaction Details</h3>

                    {/* Divider - 10px below heading */}
                    <div
                        className="h-[1px] bg-[#202020] mx-auto my-[10px]"
                        style={{ width: '338px' }}
                    />

                    {/* Data Rows - 10px below divider, 8px vertical spacing */}
                    <div className="mt-[10px] space-y-[8px]">
                        <div className="flex justify-between items-center">
                            <span className="text-white text-[12px] font-medium font-satoshi">Transaction Number</span>
                            <span className="text-white text-[12px] font-bold font-satoshi tracking-wider uppercase">201239AHSUBW234</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-white text-[12px] font-medium font-satoshi">Date & Time</span>
                            <span className="text-white text-[12px] font-bold font-satoshi">15 June 2025, 11:38 PM</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-white text-[12px] font-medium font-satoshi">Payment Mode</span>
                            <span className="text-white text-[12px] font-bold font-satoshi">Grid.Pe Wallet</span>
                        </div>

                        <div className="pt-2 space-y-2">
                            <p className="text-white/30 text-[12px] font-medium font-satoshi leading-relaxed">
                                No charges yet — your wallet will only be debited after you confirm the delivery.
                            </p>
                            <p className="text-white text-[12px] font-medium font-satoshi leading-relaxed">
                                If you need to cancel, you can do so within 30 seconds or before a delivery partner is assigned, whichever is earlier.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cancel Button */}
                {isProcessing && (
                    <button
                        onClick={() => onCancel?.(order.id)}
                        className="mx-auto rounded-full flex items-center justify-center text-white text-[16px] font-bold active:scale-95 transition-transform border-none"
                        style={{
                            width: '364px',
                            height: '48px',
                            backgroundImage: `url(${darkCtaBg})`,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsSheet;
