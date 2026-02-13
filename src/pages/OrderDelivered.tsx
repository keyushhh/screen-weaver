import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkIcon from "@/assets/check-icon.svg";
import darkbgCta from "@/assets/darkbg-cta.png";

const OrderDelivered = () => {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(28);

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate("/home");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div
            className="fixed inset-0 w-full h-full flex flex-col safe-area-top safe-area-bottom overflow-hidden"
            style={{
                background: "linear-gradient(to bottom, #064e3b 0%, #0a0a12 60%)",
            }}
        >
            <div className="flex flex-col items-center px-[35px] safe-area-top" style={{ paddingTop: "24px" }}>
                {/* Header */}
                <h1 className="text-white text-[24px] font-medium font-satoshi text-center leading-tight">
                    Order Delivered
                </h1>

                {/* Status Icon - 21px below header */}
                <div className="mt-[21px] flex items-center justify-center">
                    <img src={checkIcon} alt="Success" style={{ width: '62px', height: '62px' }} />
                </div>

                {/* Sub-text - 35px below icon */}
                <p className="mt-[35px] text-white text-[18px] font-bold font-satoshi text-center leading-[140%]">
                    Wohoo! Your order was delivered 🎉
                </p>

                {/* Transaction Info - mt-10 */}
                <div
                    className="mt-10 p-4 rounded-[12px] border border-white/10 w-full"
                    style={{ backgroundColor: "rgba(25, 25, 25, 0.31)", backdropFilter: "blur(25px)" }}
                >
                    <p className="text-white text-[16px] font-medium font-satoshi mb-2">
                        Your order for amount ₹2000 has been delivered successfully.
                    </p>
                    <p className="text-white/60 text-[14px] font-normal font-satoshi leading-[150%] mb-4">
                        The amount held in your wallet for this order will be debited shortly. You will be notified for the same. Thank you for using Grid.Pe!
                    </p>
                    {/* Status Dot */}
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#10B981] border-4 border-[#064e3b]" />
                        <span className="text-white text-[14px] font-medium font-satoshi">Delivery confirmed</span>
                    </div>
                </div>

                {/* Countdown CTA - mt-12 */}
                <button
                    onClick={() => navigate("/home")}
                    className="mt-12 w-full h-[48px] flex items-center justify-center active:scale-95 transition-transform"
                    style={{
                        backgroundImage: `url(${darkbgCta})`,
                        backgroundSize: "100% 100%",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <span className="text-white text-[16px] font-medium font-satoshi">
                        Redirecting Home in {seconds}s...
                    </span>
                </button>
            </div>
        </div>
    );
};

export default OrderDelivered;
