import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Button from "@/components/ui/button";
import MpinSheet from "@/components/MpinSheet";
import bannerComplete from "@/assets/banner-complete.png";
import kycBadge from "@/assets/kyc-badge.png";

const MpinSettings = () => {
  const navigate = useNavigate();
  const [showMpinSheet, setShowMpinSheet] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col safe-area-top safe-area-bottom font-sans">
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md absolute left-5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-[18px] font-medium font-sans">MPIN</h1>
      </div>

      {/* Content */}
      <div className="px-5 mt-8 flex flex-col gap-6">
        <p className="text-[#A3A3A3] text-[14px] font-normal leading-[20px]">
          For your security, this MPIN will be used to log in, approve payments, and keep the wrong hands out.
        </p>

        {/* Status Card */}
        <div
          className="w-full h-[101px] rounded-xl relative overflow-hidden flex items-center px-5"
          style={{
            backgroundImage: `url(${bannerComplete})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex flex-col w-full gap-1">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <img src={kycBadge} alt="Secure" className="w-6 h-6 object-contain" />
                <span className="text-white text-[18px] font-medium">MPIN Set</span>
              </div>
              <button className="text-white/60 text-[13px] font-normal underline decoration-white/30 underline-offset-2">
                Forgot MPIN?
              </button>
            </div>
            <p className="text-[#7E7E7E] text-[13px] font-normal leading-tight mt-1">
              Your MPIN’s set. Want to update it? Tap ‘Change MPIN’ below.
            </p>
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
