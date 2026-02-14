import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Circle, CheckCircle2 } from "lucide-react";
import { Order } from "@/lib/orders";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import processingIcon from "@/assets/processing.svg";
import successIcon from "@/assets/success.svg";
import failedIcon from "@/assets/failed.svg";
import refreshIcon from "@/assets/refresh.svg";
import checkIcon from "@/assets/check.svg";
import crossIcon from "@/assets/cross.svg";
import innerFrameBg from "@/assets/inner-frame.png";
import optionBg from "@/assets/option-bg.png";
import textInputBg from "@/assets/text-input.png";
import hourGlassIcon from "@/assets/hour-glass.svg";
import darkCtaBg from "@/assets/darkbg-cta.png";

const ISSUE_CATEGORIES = [
    "I did not receive this order",
    "Order was delayed",
    "Wrong amount received",
    "Report a delivery partner fraud incident",
    "Report a safety incident",
    "Order cancelled but charged",
    "Other"
];

const NeedHelp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order as Order | null;
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [description, setDescription] = useState("");

    if (!order) {
        return (
            <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center text-white">
                <p>Order not found</p>
                <button onClick={() => navigate(-1)}>Back</button>
            </div>
        );
    }

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

    const hexAlpha = Math.round(config.bgOpacity * 255).toString(16).padStart(2, '0');

    return (
        <div
            className="fixed inset-0 w-full flex flex-col bg-[#0a0a12] safe-area-top"
            style={{
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <header className="px-5 pt-8 pb-4 flex items-center justify-between relative z-10 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-md border border-white/10"
                >
                    <ChevronLeft className="text-white w-6 h-6" />
                </button>
                <h1 className="text-white text-[20px] font-medium font-satoshi flex-1 text-center pr-10">Need Help?</h1>
            </header>

            <main className="flex-1 px-5 pt-4 overflow-hidden relative z-10">
                {/* Order Summary Card (Mirrored from Bottom Sheet) */}
                <div
                    className="relative mb-6 mx-auto overflow-hidden"
                    style={{
                        width: '362px',
                        height: '137px',
                        background: `linear-gradient(${config.color}${hexAlpha}, ${config.color}${hexAlpha}) padding-box, linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(0, 0, 0, 0.20) 100%) border-box`,
                        border: '0.63px solid transparent',
                        borderRadius: '13px',
                        backdropFilter: 'blur(25.02px)',
                        WebkitBackdropFilter: 'blur(25.02px)',
                    }}
                >
                    {/* Status Frame */}
                    <div className="h-[25px] flex items-center pl-[13.5px]">
                        <div className="flex items-center gap-[6px]">
                            <img src={config.statusIcon} alt="" className="w-[14px] h-[14px]" />
                            <span className="text-[12px] font-bold font-satoshi tracking-wide" style={{ color: config.color }}>
                                {config.label}
                            </span>
                        </div>
                    </div>

                    {/* Inner Frame */}
                    <div
                        className="absolute top-[25px] left-0 w-full rounded-[13px]"
                        style={{
                            height: '112px',
                            backgroundImage: `url(${innerFrameBg})`,
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        <img src={config.icon} alt="" className="absolute top-[17px] left-[17px] w-[35px] h-[35px]" />

                        <div className="absolute top-[17px] left-[65px] flex flex-col">
                            <span className="text-white text-[16px] font-satoshi leading-tight">
                                {order.addresses?.label ? `Order to ${order.addresses.label}` : "Cash Order"}
                            </span>
                            <span className="text-white text-[12px] font-medium font-satoshi mt-1">
                                {formatOrderDate(order.created_at)}
                            </span>
                        </div>

                        <span className="absolute top-[25px] right-[17px] text-white text-[16px] font-medium font-satoshi">
                            ₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>

                        <div className="absolute left-[12px] h-[1px]" style={{ top: '65px', width: '338px', backgroundColor: '#363636' }} />

                        <div className="absolute left-[17px] right-[17px] flex justify-between items-center px-0" style={{ top: '78px' }}>
                            <span className="text-white text-[12px] font-satoshi font-medium">Order ID</span>
                            <span className="text-white text-[12px] font-bold font-satoshi tracking-wider uppercase">
                                DTP{order.id.substring(0, 8).toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Issue Category Section */}
                <section
                    className="w-full mb-4 pb-[14px]"
                    style={{
                        height: '309px',
                        backgroundImage: `url(${optionBg})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        overflow: 'hidden'
                    }}
                >
                    <div className="pt-[14px] px-[14px] pb-[14px]">
                        <h3 className="text-white text-[14px] font-medium font-satoshi">Issue Category</h3>
                    </div>

                    <div className="w-full h-[1px] bg-[#747474]/23" />

                    <div className="flex flex-col">
                        {ISSUE_CATEGORIES.map((cat, idx) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`flex items-center gap-[12px] px-[14px] py-[8.5px] ${idx < ISSUE_CATEGORIES.length - 1 ? 'border-b border-white/5' : ''}`}
                            >
                                {selectedCategory === cat ? (
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#5260FE] flex items-center justify-center shrink-0">
                                        <div className="w-[6px] h-[6px] rounded-full bg-white" />
                                    </div>
                                ) : (
                                    <div className="w-[18px] h-[18px] rounded-full border-2 border-[#5260FE] shrink-0" />
                                )}
                                <span className="text-white text-[14px] font-satoshi font-normal text-left leading-tight">{cat}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Description Section */}
                <section
                    className="w-full"
                    style={{
                        height: '166px',
                        backgroundImage: `url(${textInputBg})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="p-[14px]">
                        <h3 className="text-white text-[14px] font-medium font-satoshi mb-[14px]">Describe your issue (Optional)</h3>
                        <div className="relative">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                                placeholder="Add any extra details about your issue..."
                                className="w-full h-[85px] bg-transparent text-white text-[14px] font-satoshi resize-none focus:outline-none placeholder:text-white/20"
                            />
                            <span className="absolute -bottom-1 right-0 text-white/20 text-[10px] font-satoshi">
                                {description.length}/200
                            </span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Bottom Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#0a0a12]/80 backdrop-blur-md z-20">
                <button
                    disabled={!selectedCategory}
                    className={`w-full h-12 rounded-full flex items-center justify-center text-white text-[16px] font-medium active:scale-95 transition-all
                        ${!selectedCategory ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
                    `}
                    style={{
                        backgroundColor: '#5260FE',
                    }}
                    onClick={() => {
                        // Handle Submit logic
                        navigate('/help/success');
                    }}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default NeedHelp;
