import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.svg";

const HelpReportSuccess = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(30);

    // Reference ID
    const referenceId = "1420250537";

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/home'); // Redirect to real homepage
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <div
            className="fixed inset-0 w-full flex flex-col bg-[#0a0a12] safe-area-top overflow-hidden"
            style={{
                backgroundImage: `url(${successBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <header className="px-5 pt-8 pb-0 flex items-center justify-center relative z-10 shrink-0">
                <h1 className="text-white text-[22px] font-medium font-satoshi">Need Help</h1>
            </header>

            <main className="flex-1 flex flex-col items-center px-5 relative z-10">
                {/* Icon: 21px below heading */}
                <div className="mt-[21px] flex items-center justify-center">
                    <img src={checkIcon} alt="Success" className="w-[62px] h-[62px]" />
                </div>

                {/* Sub-heading: 35px below icon */}
                <h2 className="mt-[35px] text-white text-[18px] font-bold font-satoshi text-center tracking-tight">
                    Reference ID #{referenceId}
                </h2>

                {/* Body Text 1: 39px below sub-heading */}
                <div className="mt-[39px] w-[341px] mx-auto">
                    <p className="text-white text-[16px] font-satoshi font-normal text-center leading-[1.4]">
                        We’ve received your request and our team will review it soon. You’ll get a notification in the app as soon as there’s an update.
                    </p>
                </div>

                {/* Body Text 2: 20px below Body Text 1 */}
                <div className="mt-[20px] w-[277px] mx-auto text-center">
                    <p className="text-white text-[16px] font-satoshi font-normal leading-[1.4]">
                        You can track your request anytime in<br />
                        <span className="font-bold">Help & Support.</span>
                    </p>
                </div>

                {/* Redirecting CTA: 125px below texts */}
                <div className="mt-[125px] w-full px-5">
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/80 text-[15px] font-satoshi transition-all active:scale-95"
                    >
                        Redirecting Back in {countdown}s...
                    </button>
                </div>
            </main>
        </div>
    );
};

export default HelpReportSuccess;
