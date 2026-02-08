import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.png";
import buttonPrimaryWide from "@/assets/button-primary-wide.png";
import { useUser } from "@/contexts/UserContext";

const WalletTopUpSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addWalletBalance, addTransaction, activateWallet } = useUser();
    const processedRef = useRef(false);

    // creditAmount is the actual amount added to wallet. totalAmount includes fees.
    const { totalAmount, creditAmount } = location.state || { totalAmount: 0, creditAmount: 0 };
    const [formattedAmount, setFormattedAmount] = useState<string>("0.00");

    useEffect(() => {
        // Display the amount that actually landed in the wallet
        const amountDisplay = creditAmount || totalAmount;
        if (amountDisplay) {
            setFormattedAmount(amountDisplay.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        }

        // Process the transaction only once
        if (creditAmount && !processedRef.current) {
            processedRef.current = true;

            // update balance
            addWalletBalance(creditAmount);

            // log transaction
            addTransaction({
                id: crypto.randomUUID(),
                type: 'credit',
                amount: creditAmount,
                status: 'success',
                date: new Date().toISOString(),
                description: 'Added via Netbanking'
            });

            // Activate wallet (skip intro in future)
            activateWallet();
        }
    }, [creditAmount, totalAmount, addWalletBalance, addTransaction, activateWallet]);

    return (
        <div
            className="h-full w-full overflow-hidden flex flex-col items-center relative overflow-hidden safe-area-top safe-area-bottom px-5"
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
                <img src={checkIcon} alt="Success" className="w-[80px] h-[80px] object-contain" />
            </div>

            {/* Subheading */}
            <h2 className="text-white text-[18px] font-bold font-sans text-center mt-[35px]">
                Money? Added. Mood? Elevated.
            </h2>

            {/* Info Container */}
            <div
                className="mt-[45px] w-full rounded-[22px] px-[15px] pt-[11px] pb-[18px]"
                style={{
                    backgroundColor: "rgba(25, 25, 25, 0.31)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                {/* Amount Text */}
                <p className="text-white text-[16px] font-medium font-sans">
                    ₹{formattedAmount} just landed in your Grid.Pe wallet.
                </p>

                {/* Body Text */}
                <p className="text-[#AFAFAF] text-[16px] font-normal font-sans mt-[12px] leading-snug">
                    You didn’t add it to spend digitally. You added it... to make that cash come to YOU. No ATMs, no queues, no awkward eye contact with security guards.
                    <br />
                    Just pure financial laziness, powered by tech.
                </p>

                <p className="text-[#AFAFAF] text-[16px] font-normal font-sans mt-[18px]">
                    We respect it.
                </p>

                {/* Wallet loaded text */}
                <p className="text-[#D0D0D0] text-[12px] font-normal font-sans mt-[18px]">
                    Wallet loaded.
                </p>
            </div>

            {/* CTA Button */}
            <div className="w-full mt-[54px]">
                <button
                    onClick={() => navigate("/home")}
                    className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans active:scale-95 transition-transform"
                    style={{
                        backgroundImage: `url(${buttonPrimaryWide})`, // Using primary button as placeholder for "dark cta" if specific dark asset not found, but context implies similar style
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.8) contrast(1.2)' // Adjust to make it look "darker" if needed, or rely on asset
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
