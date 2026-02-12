import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

// Assets
import warningBg from "@/assets/warning-background.png";
import alertIcon from "@/assets/alert.svg";
import addPaymentCta from "@/assets/add-payment-cta.png";

import { Button } from "@/components/ui/button";

const PaymentMissing = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const { amount } = location.state || {};

    return (
        <div
            className="h-full w-full overflow-hidden flex flex-col relative safe-area-top safe-area-bottom"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${warningBg})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="shrink-0 relative flex items-center justify-center w-full px-5 pt-12 pb-2 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-white text-[22px] font-medium font-satoshi">
                    Withdraw
                </h1>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center pt-[16px] px-[44px] text-center relative z-10">
                {/* Icon - 16px below heading */}
                <img src={alertIcon} alt="Alert" className="w-[62px] h-[62px] mb-[35px]" />

                {/* Subtext - 35px below icon */}
                <p className="text-white text-[16px] font-bold font-satoshi leading-[140%] whitespace-nowrap">
                    Plot twist: There’s nowhere to send your money.
                </p>

                {/* Styled Container - 35px below subtext */}
                <div
                    className="mt-[35px] rounded-[13px] border relative overflow-hidden px-5 py-6 flex flex-col items-start justify-center text-left"
                    style={{
                        width: '362px',
                        height: '158px',
                        backgroundColor: 'rgba(0, 0, 0, 0.20)',
                        borderColor: 'rgba(255, 255, 255, 0.06)',
                    }}
                >
                    <h2 className="text-white text-[16px] font-medium font-satoshi mb-[17px]">
                        You don’t have a payment method added.
                    </h2>
                    <p className="text-[#AFAFAF] text-[16px] font-normal font-satoshi leading-tight">
                        So unless you plan to launch your own bank in the next 3 seconds... We suggest you add one. We’re ready to send the cash to your account - just tell us where to drop it (legally).
                    </p>
                </div>

                {/* CTA - 30px below container */}
                <button
                    onClick={() => navigate("/select-payment-method", { state: { flow: 'withdrawal', amount } })}
                    className="mt-[30px] w-[363px] h-[48px] rounded-full text-white text-[16px] font-medium flex items-center justify-center active:scale-95 transition-transform"
                    style={{
                        backgroundImage: `url(${addPaymentCta})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat"
                    }}
                >
                    Add Payment Method
                </button>

                {/* Note - 12px below CTA */}
                <p className="mt-[12px] text-white text-[14px] font-light font-satoshi opacity-100">
                    (because hiding your money under the mattress isn’t scalable)
                </p>
            </div>
        </div>
    );
};

export default PaymentMissing;
