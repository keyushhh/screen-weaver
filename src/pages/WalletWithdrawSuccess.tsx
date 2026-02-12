import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.svg";
import cancelCta from "@/assets/cancel-cta.png";
import { useUser } from "@/contexts/UserContext";

const WalletWithdrawSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addTransaction, addWalletBalance } = useUser();
    const { amount: rawAmount, selectedMethod } = location.state || {};
    const amount = typeof rawAmount === 'number' ? rawAmount : parseFloat(rawAmount || '0');

    const [timeLeft, setTimeLeft] = useState(30);

    const formattedAmount = (amount || 0).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Handle redirection timer
    useEffect(() => {
        if (timeLeft <= 0) {
            navigate("/home");
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, navigate]);

    // Optional: Add the transaction to history on mount
    useEffect(() => {
        if (amount > 0) {
            addWalletBalance(-amount);
            addTransaction({
                id: `WTX${Math.random().toString(36).toUpperCase().substr(2, 10)}`,
                type: 'debit',
                amount: amount,
                status: 'success',
                date: new Date().toISOString(),
                description: 'Withdrawal to Bank',
                metadata: { paymentMethodId: selectedMethod }
            });
        }
    }, []); // Only once on mount

    return (
        <div
            className="h-full w-full overflow-y-auto overscroll-y-none flex flex-col safe-area-top safe-area-bottom pb-10"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${successBg})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="px-5 pt-12 flex items-center justify-center relative z-10 shrink-0">
                <button
                    onClick={() => navigate("/wallet-created")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md absolute left-5"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-white text-[22px] font-medium leading-[120%]" style={{ fontFamily: 'Satoshi-Medium' }}>
                    Withdraw
                </h1>
            </div>

            <div className="flex-1 flex flex-col items-center px-5 pt-[16px]">
                {/* Icon - 16px below heading */}
                <img src={checkIcon} alt="Success" className="w-[62px] h-[62px]" />

                {/* Sub-text - 35px below icon */}
                <h2 className="text-white text-[18px] font-bold mt-[35px] text-center px-4" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Your request has been processed. Big baller energy confirmed. 🎉
                </h2>

                {/* Container - 20px below sub-text */}
                <div
                    className="mt-[20px] w-[362px] h-[166px] rounded-[13px] relative overflow-hidden flex flex-col items-start justify-center text-left px-[22px]"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.20)",
                    }}
                >
                    {/* Border Overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none rounded-[13px]"
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                    />
                    <p className="text-[#AFAFAF] text-[16px] font-normal leading-tight" style={{ fontFamily: 'Satoshi-Regular' }}>
                        We just moved {formattedAmount} to your bank account. That’s not a withdrawal. That’s a flex. Your bank might even call to check if you’re okay.
                    </p>
                    <div style={{ height: '18px' }} />
                    <p className="text-[#AFAFAF] text-[16px] font-normal leading-tight" style={{ fontFamily: 'Satoshi-Regular' }}>
                        Give it up to 30 minutes to reflect. Or stare at your account like it owes you interest.
                    </p>
                </div>

                {/* CTAs Section - 71px below container */}
                <div className="mt-[71px] w-full flex flex-col items-center">
                    <button
                        onClick={() => navigate("/wallet-created")}
                        className="w-full h-[48px] rounded-full text-white text-[16px] font-medium flex items-center justify-center active:scale-95 transition-transform"
                        style={{ backgroundColor: "#5260FE" }}
                    >
                        View Withdrawal Status
                    </button>

                    <button
                        onClick={() => navigate("/home")}
                        className="mt-[10px] w-full h-[48px] rounded-full text-white text-[16px] font-medium flex items-center justify-center active:scale-95 transition-transform"
                        style={{
                            backgroundImage: `url(${cancelCta})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                        }}
                    >
                        Redirecting Home in {timeLeft}s...
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WalletWithdrawSuccess;
