import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MpinSheet from "@/components/MpinSheet";
import bannerComplete from "@/assets/banner-complete.png";
import kycBadge from "@/assets/kyc-badge.png";
import bgDarkMode from "@/assets/bg-dark-mode.png";

const MpinSettings = () => {
  const navigate = useNavigate();
  const [showMpinSheet, setShowMpinSheet] = useState(false);

  return (
    <div
      className="min-h-screen bg-[#0a0a12] flex flex-col safe-area-top safe-area-bottom font-sans"
      style={{
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md absolute left-5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        {/* Header: Satoshi Medium 22px, White, Centered */}
        <h1 className="text-white text-[22px] font-medium font-sans text-center">MPIN</h1>
      </div>

      {/* Content */}
      <div className="px-5 flex flex-col">
        {/* Body Text: Spacing 46px from header, Satoshi Bold 16px, White */}
        <p className="mt-[46px] text-white text-[16px] font-bold leading-[22px]">
          For your security, this MPIN will be used to log in, approve payments, and keep the wrong hands out.
        </p>

        {/* Status Card - Spacing added top (arbitrary visual gap based on screenshot, likely ~24px or similar) */}
        <div className="mt-6 flex justify-center">
            <div
            className="w-[362px] h-[101px] rounded-xl relative overflow-hidden flex items-center px-5 shrink-0"
            style={{
                backgroundImage: `url(${bannerComplete})`,
                backgroundSize: "100% 100%", // Force fit to container to fix stroke issues
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}
            >
            <div className="flex flex-col w-full gap-1">
                <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <img src={kycBadge} alt="Secure" className="w-6 h-6 object-contain" />
                    <span className="text-white text-[18px] font-medium">MPIN Set</span>
                </div>
                {/* Forgot MPIN: White color */}
                <button className="text-white text-[13px] font-normal underline decoration-white/30 underline-offset-2">
                    Forgot MPIN?
                </button>
                </div>
                <p className="text-[#7E7E7E] text-[13px] font-normal leading-tight mt-1">
                Your MPIN’s set. Want to update it? Tap ‘Change MPIN’ below.
                </p>
            </div>
            </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-auto px-5 pb-10">
        <Button
          onClick={() => setShowMpinSheet(true)}
          className="w-full h-[48px] bg-[#5260FE] hover:bg-[#5260FE]/90 text-white rounded-full text-[16px] font-medium"
        >
          Change MPIN
        </Button>
      </div>

      {/* MPIN Sheet in 'change' mode */}
      {showMpinSheet && (
        <MpinSheet
          mode="change"
          onClose={() => setShowMpinSheet(false)}
          onSuccess={() => {
            // User requested to pause flow here
            setShowMpinSheet(false);
          }}
        />
      )}
    </div>
  );
};

export default MpinSettings;
