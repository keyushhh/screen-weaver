import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import errorBg from "@/assets/error-bg.png";
import cancelledIco from "@/assets/cancelled-ico.svg";
import cancelCta from "@/assets/cancel-cta.png";

const WalletWithdrawFailed = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const rawAmount = location.state?.amount;
    const amount = typeof rawAmount === 'number' ? rawAmount : parseFloat(rawAmount || '0');

    const formattedAmount = (amount || 0).toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div
            className="h-full w-full overflow-y-auto overscroll-y-none flex flex-col safe-area-top safe-area-bottom pb-10"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${errorBg})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="px-5 pt-12 flex items-center justify-center relative z-10 shrink-0">
                <button
                    onClick={() => navigate(-1)}
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
                <img src={cancelledIco} alt="Cancelled" className="w-[62px] h-[62px]" />

                {/* Sub-text - 32px below icon */}
                <h2 className="text-white text-[18px] font-bold mt-[32px] text-center" style={{ fontFamily: 'Satoshi-Bold' }}>
                    Your money got cold feet.
                </h2>

                {/* Container - 25px below sub-text */}
                <div
                    className="mt-[25px] w-[362px] h-[180px] rounded-[13px] relative overflow-hidden flex flex-col items-start justify-center text-left px-[22px]"
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
                        We tried sending {formattedAmount} to your bank. It hesitated, paused, whispered “I’m not ready for this” and ran back into your wallet.
                    </p>
                    <div style={{ height: '18px' }} />
                    <p className="text-[#AFAFAF] text-[16px] font-normal leading-tight" style={{ fontFamily: 'Satoshi-Regular' }}>
                        No worries - you won’t lose a rupee. It’s still safe with us, clinging to the comfort of digital walls. Check your payment method, try again, and remind your bank who’s the boss.
                    </p>
                </div>

                {/* CTAs Section - 72px below container */}
                <div className="mt-[72px] w-full flex flex-col items-center">
                    <button
                        onClick={() => navigate("/wallet-withdraw")}
                        className="w-full h-[48px] rounded-full text-white text-[16px] font-medium flex items-center justify-center active:scale-95 transition-transform"
                        style={{ backgroundColor: "#5260FE" }}
                    >
                        Retry Withdrawal
                    </button>
                    <p className="mt-[12px] text-white/70 text-[12px] font-normal" style={{ fontFamily: 'Satoshi-Regular' }}>
                        (Because second chances are a thing.)
                    </p>

                    <button
                        onClick={() => navigate("/home")}
                        className="mt-[32px] w-full h-[48px] rounded-full text-white text-[16px] font-medium flex items-center justify-center active:scale-95 transition-transform"
                        style={{
                            backgroundImage: `url(${cancelCta})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                        }}
                    >
                        Go Home
                    </button>
                    <p className="mt-[12px] text-white/70 text-[12px] font-normal" style={{ fontFamily: 'Satoshi-Regular' }}>
                        (Let me pretend I didn’t just panic.)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WalletWithdrawFailed;
