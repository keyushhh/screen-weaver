import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import hdfcIcon from "@/assets/hdfc-bank-logo.png";
import infoIcon from "@/assets/infopurple.svg";
import { SlideToPay } from "@/components/SlideToPay";

const OrderSummary = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { amount, retry } = location.state || { amount: "0.00", retry: false };

    const parsedAmount = parseFloat(amount) || 0;
    const processingFee = 5.0;
    const platformFee = 0.0;
    const totalPayable = parsedAmount + processingFee + platformFee;

    const glassContainerStyle: React.CSSProperties = {
        backgroundColor: "rgba(25, 25, 25, 0.31)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "22px",
        position: "relative",
    };

    const StrokeOverlay22 = () => (
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

    const StrokeOverlay13 = () => (
        <div
            className="absolute inset-0 pointer-events-none rounded-[13px]"
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
        <div className="w-[340px] h-[1px] bg-[#202020] mx-auto" />
    );

    return (
        <div
            className="h-full w-full overflow-y-auto overscroll-y-none flex flex-col safe-area-top safe-area-bottom pb-8"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="px-5 pt-4 flex items-center justify-between relative z-10 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <h1 className="text-white text-[18px] font-medium font-sans absolute left-1/2 -translate-x-1/2">
                    Order Summary
                </h1>

                <div className="w-10" />
            </div>

            <div className="flex-1 flex flex-col items-center pt-[37px] px-5">
                {/* Payment Method Header */}
                <div className="w-[363px] flex items-center mb-[12px]">
                    <span className="text-white text-[16px] font-bold font-sans">
                        Payment Method
                    </span>
                </div>

                {/* Payment Method Container */}
                <div
                    className="w-[363px] h-[66px] rounded-[22px] flex items-center px-[15px] overflow-hidden"
                    style={glassContainerStyle}
                >
                    <StrokeOverlay22 />

                    <img
                        src={hdfcIcon}
                        alt="HDFC"
                        className="w-[32px] h-[32px] object-contain"
                    />
                    <span className="ml-[20px] text-white text-[14px] font-medium font-sans tracking-wider">
                        3232 **** **** 5233
                    </span>
                </div>

                {/* To Pay Container */}
                <div
                    className="w-[363px] mt-[15px] flex flex-col px-[11px] py-[14px] overflow-hidden rounded-[13px]"
                    style={{ ...glassContainerStyle, borderRadius: "13px" }}
                >
                    <StrokeOverlay13 />

                    <span className="text-white text-[16px] font-bold font-sans">
                        To Pay
                    </span>

                    <p className="text-white text-[14px] font-light font-sans mt-[10px] leading-tight">
                        No additional taxes apply. Processing fee is inclusive of all charges.
                    </p>

                    <div className="mt-[15px] mb-[12px]">
                        <Divider />
                    </div>

                    {/* Wallet Top Up */}
                    <div className="flex items-center justify-between w-full px-1">
                        <span className="text-white text-[14px] font-medium font-sans">
                            Wallet top up
                        </span>
                        <span className="text-white text-[14px] font-bold font-sans">
                            ₹{parsedAmount}
                        </span>
                    </div>

                    {/* Processing Fee */}
                    <div className="flex items-center justify-between w-full mt-[8px] px-1">
                        <div className="flex items-center gap-[6px]">
                            <span className="text-white text-[14px] font-medium font-sans">
                                Processing Fee
                            </span>
                            <img
                                src={infoIcon}
                                alt="Info"
                                className="w-[12px] h-[12px]"
                            />
                        </div>
                        <span className="text-white text-[14px] font-bold font-sans">
                            ₹{processingFee.toFixed(2)}
                        </span>
                    </div>

                    {/* Platform Fee */}
                    <div className="flex items-center justify-between w-full mt-[8px] px-1">
                        <span className="text-white text-[14px] font-medium font-sans">
                            Platform Fee
                        </span>
                        <span className="text-white text-[14px] font-bold font-sans">
                            ₹{platformFee.toFixed(2)}
                        </span>
                    </div>

                    <div className="mt-[8px] mb-[8px]">
                        <Divider />
                    </div>

                    {/* Total Payable */}
                    <div className="flex items-center justify-between w-full px-1">
                        <span className="text-white text-[14px] font-medium font-sans">
                            Total Payable
                        </span>
                        <span className="text-white text-[14px] font-bold font-sans">
                            ₹{totalPayable.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>

                {/* Info Container */}
                <div
                    className="w-[362px] mt-[14px] overflow-hidden rounded-[13px]"
                    style={{ ...glassContainerStyle, borderRadius: "13px" }}
                >
                    <StrokeOverlay13 />

                    <div className="flex items-start gap-[10px] px-[14px] py-[12px]">
                        <img
                            src={infoIcon}
                            alt="Info"
                            className="w-[12px] h-[12px] mt-[2px]"
                        />

                        <p className="text-white text-[14px] font-normal font-sans leading-snug">
                            This fee helps cover gateway and transaction costs. UPI methods are free.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Slider CTA */}
            <div className="w-full px-5 pb-[20px]">
                <SlideToPay
                    onComplete={() => {
                        if (retry) {
                            // Pass the original entered amount for wallet credit
                            navigate('/wallet-topup-success', { state: { totalAmount: totalPayable, creditAmount: parsedAmount } });
                        } else {
                            navigate('/wallet-topup-failed', { state: { amount } });
                        }
                    }}
                    label="Confirm and Place Order"
                />
            </div>
        </div>
    );
};

export default OrderSummary;
