import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import upiIcon from "@/assets/upi.png";
import credIcon from "@/assets/cred.png";
import gpayIcon from "@/assets/gpay.png";
import phonepeIcon from "@/assets/phonepe.png";
import hdfcLogo from "@/assets/hdfc-bank-logo.png";
import amazonIcon from "@/assets/amazon.png";
import addPaymentCta from "@/assets/add-payment-cta.png";

const SelectPaymentMethod = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { amount } = location.state || {};
    const [selectedMethod, setSelectedMethod] = useState<string>("hdfc-card");

    const glassContainerStyle: React.CSSProperties = {
        backgroundColor: "rgba(25, 25, 25, 0.31)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "relative",
        borderRadius: "22px",
    };

    const StrokeOverlay = () => (
        <div
            className="absolute inset-0 pointer-events-none rounded-[22px]"
            style={{
                padding: "0.63px",
                background:
                    "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.20))",
                WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
            }}
        />
    );

    const Divider = () => (
        <div className="w-[338px] h-[1px] bg-[#202020] mx-auto" />
    );

    const RadioButton = ({ selected }: { selected: boolean }) => (
        <div
            className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "border-[#6C72FF]" : "border-[#6C72FF]/50"
                }`}
        >
            {selected && (
                <div className="w-[12px] h-[12px] rounded-full bg-[#6C72FF]" />
            )}
        </div>
    );

    const upiMethods = [
        { id: "cred", name: "CRED UPI", icon: credIcon },
        { id: "gpay", name: "Google Pay UPI", icon: gpayIcon },
        { id: "phonepe", name: "PhonePe UPI", icon: phonepeIcon },
        { id: "upi-id", name: "UPI ID", subtitle: "Required" },
    ];

    const cardMethods = [
        { id: "hdfc-card", name: "3232 **** **** 5233", icon: hdfcLogo },
    ];

    const moreMethods = [
        { id: "amazon", name: "Amazon Pay Wallet", icon: amazonIcon },
        { id: "netbanking", name: "HDFC Netbanking", icon: hdfcLogo, subtitle: "Savings account | 5233" },
    ];

    return (
        <div
            className="h-full w-full overflow-hidden flex flex-col safe-area-top safe-area-bottom"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="px-5 pt-12 flex items-center justify-between relative z-10 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-white text-[22px] font-medium leading-[120%] font-satoshi absolute left-1/2 -translate-x-1/2">
                    Select Payment
                </h1>
            </div>

            <div className="flex-1 flex flex-col px-5 pt-[34px] overflow-y-auto pb-[180px]">
                {/* Sub-text - 34px below header */}
                <p className="text-white text-[16px] font-bold font-satoshi leading-tight mb-[22px]">
                    Select a payment method where you want the amount to be refunded.
                </p>

                {/* UPI Section */}
                <div className="w-full flex flex-col mb-[36px]">
                    <div className="mb-[12px]">
                        <img src={upiIcon} alt="UPI" className="w-[32px] h-[32px] object-contain" />
                    </div>

                    <div
                        className="w-full rounded-[22px] flex flex-col px-[10px] overflow-hidden"
                        style={glassContainerStyle}
                    >
                        <StrokeOverlay />
                        {upiMethods.map((method, i) => (
                            <React.Fragment key={method.id}>
                                <div
                                    className="flex items-center h-[60px] cursor-pointer"
                                    onClick={() => setSelectedMethod(method.id)}
                                >
                                    {method.icon && <img src={method.icon} alt={method.name} className="w-[32px] h-[32px] object-contain" />}
                                    <div className={`flex flex-col flex-1 ${method.icon ? 'ml-[12px]' : ''}`}>
                                        <span className="text-white text-[16px] font-bold font-sans">
                                            {method.name}
                                        </span>
                                        {method.subtitle && (
                                            <span className="text-white/40 text-[12px] font-medium font-sans">
                                                {method.subtitle}
                                            </span>
                                        )}
                                    </div>
                                    <RadioButton selected={selectedMethod === method.id} />
                                </div>
                                {i < upiMethods.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Cards Section */}
                <div className="w-full mb-[36px]">
                    <h2 className="text-white text-[16px] font-bold font-sans mb-[12px]">
                        Cards
                    </h2>
                    <div
                        className="w-full rounded-[22px] flex flex-col px-[10px] overflow-hidden"
                        style={glassContainerStyle}
                    >
                        <StrokeOverlay />
                        {cardMethods.map((method, i) => (
                            <React.Fragment key={method.id}>
                                <div
                                    className="flex items-center h-[60px] cursor-pointer"
                                    onClick={() => setSelectedMethod(method.id)}
                                >
                                    <img src={method.icon} alt={method.name} className="w-[32px] h-[32px] object-contain" />
                                    <span className="ml-[12px] text-white text-[16px] font-bold font-sans flex-1">
                                        {method.name}
                                    </span>
                                    <RadioButton selected={selectedMethod === method.id} />
                                </div>
                                {i < cardMethods.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* More Payment Options */}
                <div className="w-full mb-8">
                    <h2 className="text-white text-[16px] font-bold font-sans mb-[12px]">
                        More Payment Options
                    </h2>
                    <div
                        className="w-full rounded-[22px] flex flex-col px-[10px] overflow-hidden"
                        style={glassContainerStyle}
                    >
                        <StrokeOverlay />
                        {moreMethods.map((method, i) => (
                            <React.Fragment key={method.id}>
                                <div
                                    className="flex items-center h-[60px] cursor-pointer"
                                    onClick={() => setSelectedMethod(method.id)}
                                >
                                    <img src={method.icon} alt={method.name} className="w-[32px] h-[32px] object-contain" />
                                    <div className="flex flex-col flex-1 ml-[12px]">
                                        <span className="text-white text-[16px] font-bold font-sans">
                                            {method.name}
                                        </span>
                                        {method.subtitle && (
                                            <span className="text-white/40 text-[12px] font-medium font-sans">
                                                {method.subtitle}
                                            </span>
                                        )}
                                    </div>
                                    <RadioButton selected={selectedMethod === method.id} />
                                </div>
                                {i < moreMethods.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer CTAs - Absolute with blur */}
            <div
                className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-5 flex flex-col gap-3 z-30"
                style={{
                    backgroundColor: "rgba(10, 10, 18, 0.4)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                }}
            >
                <button
                    onClick={() => navigate('/withdraw-otp', { state: { selectedMethod, amount } })}
                    className="w-full h-[48px] rounded-full text-white text-[16px] font-medium flex items-center justify-center active:scale-95 transition-transform"
                    style={{
                        backgroundColor: "#5260FE"
                    }}
                >
                    Proceed
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="w-full h-[48px] rounded-full bg-transparent border border-white/10 text-white text-[16px] font-medium active:scale-95 transition-transform flex items-center justify-center"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default SelectPaymentMethod;
