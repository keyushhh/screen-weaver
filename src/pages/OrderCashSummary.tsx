import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import locationIcon from "@/assets/location.svg";
import deliveryIcon from "@/assets/delivery.svg";
import calendarIcon from "@/assets/calendar.svg";
import chevronDownIcon from "@/assets/chevron-down.svg";
import circleButtonBg from "@/assets/circle-button.png";
import pillContainerBg from "@/assets/pill-container-bg.png";
import { SlideToPay } from "@/components/SlideToPay";

const OrderCashSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state || { amount: "0.00" };

  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(true);

  const handlePay = () => {
      navigate("/order-cash-success");
  };

  // Common container style
  const containerStyle = {
    backgroundColor: "rgba(25, 25, 25, 0.30)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "0.65px solid rgba(255, 255, 255, 0.20)",
    borderRadius: "13px",
  };

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
      <div className="px-5 pt-4 flex items-center justify-between z-10 mb-6">
        <button
          onClick={() => navigate("/order-cash")}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-[18px] font-medium font-sans">
          Order Cash
        </h1>
        <div className="w-10" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-[300px] space-y-[10px] no-scrollbar">

        {/* Address Section */}
        <div
            style={containerStyle}
            className="w-full relative overflow-hidden"
        >
            <div
                className="flex items-start py-[11px] px-[12px]"
            >
                {/* Icon */}
                <div
                    className="w-[52px] h-[52px] shrink-0 flex items-center justify-center mr-[12px]"
                    style={{
                        backgroundImage: `url(${circleButtonBg})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                >
                    <img src={locationIcon} alt="Location" className="w-[22px] h-[22px]" />
                </div>

                {/* Text */}
                <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                        <span className="text-white text-[16px] font-medium font-sans">Home</span>
                        <img
                            src={chevronDownIcon}
                            alt="Toggle"
                            className="w-4 h-4"
                        />
                    </div>
                    <p className="text-white/80 text-[14px] font-normal font-sans mt-1 leading-tight">
                        C102, Pubali Estate, Guwahati - 781005
                    </p>
                </div>
            </div>
        </div>

        {/* Delivery Section */}
        <div style={containerStyle} className="w-full py-[11px] px-[12px] flex items-center justify-between">
             <div className="flex items-center gap-[12px]">
                {/* Icon with Circle BG */}
                <div
                    className="w-[52px] h-[52px] shrink-0 flex items-center justify-center"
                    style={{
                        backgroundImage: `url(${circleButtonBg})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                >
                    <img src={deliveryIcon} alt="Delivery" className="w-[24px] h-[24px]" />
                </div>
                <div>
                    <p className="text-white text-[14px] font-medium font-sans">Delivery</p>
                    <p className="text-white/60 text-[14px] font-normal font-sans">Deliver now</p>
                </div>
             </div>

             {/* Want it later */}
             <div className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100">
                <img src={calendarIcon} alt="Calendar" className="w-[18px] h-[18px]" />
                <span className="text-white text-[14px] font-medium font-sans underline underline-offset-2">Want it later?</span>
             </div>
        </div>

        {/* Flexibility Text */}
        <div className="py-2">
            <p className="text-white/50 text-[14px] font-medium font-sans">
                Want more flexibility?
            </p>
            <p className="text-white/50 text-[14px] font-normal font-sans mt-1 leading-tight">
                Schedule your delivery for later and pick a time-slot that suits you the best.
            </p>
        </div>

        {/* KYC Security Check */}
        <div style={containerStyle} className="w-full pt-[10px] px-[11px] pb-[12px]">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-white text-[16px] font-medium font-sans">KYC Security Check</span>
                <span className="text-[16px]">🔐</span>
            </div>
            <ul className="list-disc pl-4 space-y-2 text-white/80 text-[13px] font-normal font-sans leading-snug marker:text-white/60">
                <li>Your KYC has been verified. Please keep your original ID ready when accepting your cash delivery.</li>
                <li>Your delivery partner’s name, photo, and KYC details will be visible before drop-off.</li>
                <li>Please verify their ID before accepting the cash.</li>
            </ul>
            <div className="w-full h-[1px] bg-white/10 my-3" />
            <p className="text-white/40 text-[12px] font-normal font-sans">
                Both parties must match KYC details before the transaction is completed.
            </p>
        </div>

        {/* Redeem Reward Points */}
        <div style={containerStyle} className="w-full overflow-hidden">
            <button
                className="w-full py-[13px] px-[12px] flex items-center justify-between"
                onClick={() => setIsRewardsOpen(!isRewardsOpen)}
            >
                <span className="text-white text-[16px] font-medium font-sans">Redeem Reward Points</span>
                <img
                    src={chevronDownIcon}
                    alt="Toggle"
                    className={`w-4 h-4 transition-transform ${isRewardsOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isRewardsOpen && (
                <div className="px-[12px] pb-[13px] text-white/60 text-sm">
                    No points available.
                </div>
            )}
        </div>

        {/* To Pay */}
        <div style={containerStyle} className="w-full overflow-hidden">
             <div
                className="w-full py-[14px] px-[12px] flex flex-col"
            >
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-[16px] font-medium font-sans">To Pay</span>
                        <span className="text-white text-[16px] font-medium font-sans">
                            +₹{amount}
                        </span>
                    </div>
                    <img
                        src={chevronDownIcon}
                        alt="Toggle"
                        className="w-4 h-4"
                    />
                </div>

                <p className="text-white/60 text-[12px] font-normal font-sans mt-[6px]">
                    Incl. all taxes & charges
                </p>
            </div>
        </div>

      </div>

      {/* Fixed Bottom Sheet Overlay */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[30px] p-5 pb-10 flex flex-col gap-4"
        style={{
            backgroundColor: "#000000",
            boxShadow: "0px -10px 40px rgba(0,0,0,0.5)"
        }}
      >
        <div>
            <h2 className="text-white text-[18px] font-bold font-sans mb-1">
                Amount will be held from wallet
            </h2>
            <p className="text-white/60 text-[14px] font-normal font-sans leading-snug">
                You won’t be charged unless the delivery is completed.
            </p>
        </div>

        <SlideToPay onComplete={handlePay} />
      </div>
    </div>
  );
};

export default OrderCashSummary;
