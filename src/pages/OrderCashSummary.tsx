import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import locationIcon from "@/assets/location.svg";
import deliveryIcon from "@/assets/delivery.svg";
import calendarIcon from "@/assets/calendar.svg";
import chevronDownIcon from "@/assets/chevron-down.svg";
import circleButtonBg from "@/assets/circle-button.png";
import pillContainerBg from "@/assets/pill-container-bg.png"; // Reusing for containers if appropriate, or css

const OrderCashSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { amount } = location.state || { amount: "0.00" };

  const [isAddressOpen, setIsAddressOpen] = useState(true);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(true);

  // Common container style
  const containerStyle = {
    backgroundColor: "rgba(25, 25, 25, 0.30)", // #191919 at ~30%
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "0.65px solid rgba(255, 255, 255, 0.20)",
    borderRadius: "13px",
  };

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="relative px-5 pt-4 flex items-center justify-between z-10 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="absolute left-0 right-0 text-center text-white text-[18px] font-medium font-sans pointer-events-none">
          Order Cash
        </h1>
        <div className="w-10" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-[10px] no-scrollbar">

        {/* Address Section */}
        <div
            style={containerStyle}
            className="w-full relative overflow-hidden transition-all duration-300"
        >
            <div
                className="flex items-start p-[11px] cursor-pointer"
                onClick={() => setIsAddressOpen(!isAddressOpen)}
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
                            className={`w-4 h-4 transition-transform ${isAddressOpen ? 'rotate-180' : ''}`}
                        />
                    </div>
                    {isAddressOpen && (
                        <p className="text-white/80 text-[14px] font-normal font-sans mt-1 leading-tight">
                            C102, Pubali Estate, Guwahati - 781005
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* Delivery Section */}
        <div style={containerStyle} className="w-full p-[12px] flex items-center justify-between">
             <div className="flex items-center gap-[12px]">
                <div
                    className="w-[46px] h-[46px] rounded-full border border-white/20 flex items-center justify-center"
                    style={{ backgroundColor: 'transparent' }}
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
        <div style={containerStyle} className="w-full p-5">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-white text-[16px] font-medium font-sans">KYC Security Check</span>
                {/* Using Lucide Lock for now as icon-security.svg might be a shield. Using yellow lock to match screenshot */}
                <Lock className="w-4 h-4 text-[#FACC15]" fill="#FACC15" />
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
                className="w-full h-[48px] px-[15px] flex items-center justify-between"
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
                <div className="px-[15px] pb-4 text-white/60 text-sm">
                    No points available.
                </div>
            )}
        </div>

        {/* To Pay */}
        <div style={containerStyle} className="w-full overflow-hidden">
             <button
                className="w-full px-[15px] py-[15px] flex items-center justify-between"
                onClick={() => setIsPayOpen(!isPayOpen)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-white text-[16px] font-medium font-sans">To Pay</span>
                    <span className="text-white text-[16px] font-medium font-sans">
                        +₹{amount}
                    </span>
                </div>
                <img
                    src={chevronDownIcon}
                    alt="Toggle"
                    className={`w-4 h-4 transition-transform ${isPayOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isPayOpen && (
                <div className="px-[15px] pb-[15px]">
                    <p className="text-white/60 text-[12px] font-normal font-sans">
                        Incl. all taxes & charges
                    </p>
                </div>
            )}
        </div>

      </div>

      {/* Footer CTA */}
      <div className="p-5 pt-0 mt-4">
        <Button
          variant="gradient"
          className="w-full h-12 text-[16px] font-bold font-sans rounded-full"
          onClick={() => {}}
        >
          Pay {amount ? `₹${amount}` : "₹0"}
        </Button>
      </div>
    </div>
  );
};

export default OrderCashSummary;
