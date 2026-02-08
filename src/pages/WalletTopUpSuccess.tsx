import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.png";
import buttonPrimaryWide from "@/assets/button-primary-wide.png";

const WalletTopUpSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalAmount } = location.state || { totalAmount: 0 };
    const [formattedAmount, setFormattedAmount] = useState<string>("0.00");

    useEffect(() => {
        if (totalAmount) {
            setFormattedAmount(
                totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            );
        }
    }, [totalAmount]);

    return (
        <div
            className="h-full w-full flex flex-col items-center relative safe-area-top safe-area-bottom px-5"
            style={{
                backgroundImage: `url(${successBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Payment Success Heading */}
            <div className="w-full pt-6 flex justify-center">
                <h1 className="text-white text-[18px] font-semibold font-sans">
                    Payment Success!
                </h1>
            </div>

            {/* Check Icon */}
            <div className="mt-[21px] flex justify-center">
                <img
                    src={checkIcon}
                    alt="Success"
                    className="w-[80px] h-[80px] object-contain"
                />
            </div>

            {/* Subheading */}
            <h2 className="text-white text-[18px] font-bold font-sans text-center mt-[35px]">
                Money? Added. Mood? Elevated.
            </h2>

            {/* Info Container */}
            <div
                className="mt-[45px] w-full rounded-[22px] px-[15px] pt-[11px] pb-[18px] relative overflow-hidden"
                style={{
                    backgroundColor: "rgba(25, 25, 25, 0.31)", // #191919 @ 31%
                    backdropFilter: "blur(25px)",
                    WebkitBackdropFilter: "blur(25px)",
                }}
            >
                {/* Linear Stroke */}
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

                {/* Amount Text */}
                <p className="text-white text-[16px] font-medium font-sans relative z-10">
                    ₹{formattedAmount} just landed in your Grid.Pe wallet.
                </p>

                {/* Body Text */}
                <p className="text-[#AFAFAF] text-[16px] font-normal font-sans mt-[12px] leading-snug relative z-10">
                    You didn’t add it to spend digitally. You added it... to make that cash come to YOU.
                    No ATMs, no queues, no awkward eye contact with security guards.
                    <br />
                    Just pure financial laziness, powered by tech.
                </p>

                <p className="text-[#AFAFAF] text-[16px] font-normal font-sans mt-[18px] relative z-10">
                    We respect it.
                </p>

                {/* Wallet Loaded Row */}
                <div className="flex items-center mt-[18px] relative z-10">
                    {/* Green Status Dot */}
                    <div
                        className="w-[14px] h-[14px] rounded-full"
                        style={{
                            backgroundColor: "#1CB956",
                            boxShadow: "0 0 0 5px rgba(28, 185, 86, 0.25)",
                        }}
                    />
                    <span className="ml-[13px] text-[#D0D0D0] text-[12px] font-normal font-sans">
                        Wallet loaded.
                    </span>
                </div>
            </div>

            {/* CTA Button */}
            <div className="w-full mt-[54px]">
                <button
                    onClick={() => navigate("/home")}
                    className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans active:scale-95 transition-transform"
                    style={{
                        backgroundImage: `url(${buttonPrimaryWide})`,
                        backgroundSize: "100% 100%",
                        backgroundPosition: "center",
                        filter: "brightness(0.8) contrast(1.2)",
                    }}
                >
                    Order Cash Pickup
                </button>
            </div>

            {/* Footer Text */}
            <p className="text-white/60 text-[12px] font-medium font-sans mt-[12px] text-center">
                (Because walking to the ATM is so 2017)
            </p>
        </div>
    );
};

export default WalletTopUpSuccess;
