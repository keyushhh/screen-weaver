import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MpinSheet from "@/components/MpinSheet";
import bannerComplete from "@/assets/banner-complete.png";
import kycBadge from "@/assets/kyc-badge.png";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import popupBg from "@/assets/popup-bg.png";
import buttonCloseBg from "@/assets/button-close.png";
import mpinIcon from "@/assets/mpin-icon.png";

const MpinSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMpinSheet, setShowMpinSheet] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [sheetMode, setSheetMode] = useState<'change' | 'reset'>('change');

  useEffect(() => {
    if (location.state?.resetMpin) {
        setSheetMode('reset');
        setShowMpinSheet(true);
        // Clean up state
        window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
          onClick={() => navigate('/security-dashboard')}
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
          onClick={() => {
            setSheetMode('change');
            setShowMpinSheet(true);
          }}
          className="w-full h-[48px] bg-[#5260FE] hover:bg-[#5260FE]/90 text-white rounded-full text-[16px] font-medium"
        >
          Change MPIN
        </Button>
      </div>

      {/* MPIN Sheet in 'change' mode */}
      {showMpinSheet && (
        <MpinSheet
          mode={sheetMode}
          onClose={() => setShowMpinSheet(false)}
          onSuccess={() => {
            setShowMpinSheet(false);
            setShowSuccessPopup(true);
          }}
        />
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 backdrop-blur-md bg-black/40"
            onClick={() => setShowSuccessPopup(false)}
          />

          {/* Popup Box */}
          <div
            className="relative rounded-[20px] p-6 max-w-[320px] w-full z-10 min-h-[220px] flex flex-col items-center justify-center gap-4"
            style={{
              backgroundImage: `url(${popupBg})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
            }}
          >
             {/* Icon */}
             <div className="w-[48px] h-[48px] flex items-center justify-center">
                 <img src={mpinIcon} alt="Locked" className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                 {/* Note: mpin-icon.png might be colored or dark.
                     The screenshot shows a white outline lock.
                     If mpin-icon.png is the purple icon from the menu,
                     I might need to use a different icon or filter it.
                     However, user explicitly asked to use mpin-icon.png.
                     I will try without filter first if it looks right, or inverted if it's black.
                     Actually the screenshot shows a simple white line icon.
                     The menu icon is usually colored.
                     Let's check the asset.
                     For now I will assume user knows best and use it as is.
                     If it looks wrong in verification I will fix.
                  */}
             </div>

             {/* Header */}
             <h2 className="text-white text-[18px] font-medium font-sans text-center">
                MPIN Updated!
             </h2>

             {/* Body Pill */}
             <div className="bg-[#090909] rounded-xl px-4 py-3 w-full">
                <p className="text-white text-[14px] font-normal leading-snug text-center">
                  All set. Just don’t write it on a sticky note. Or worse—use 1234 again.
                </p>
             </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setShowSuccessPopup(false)}
            className="relative z-10 mt-6 px-8 py-3 rounded-full flex items-center justify-center gap-2 w-[160px]"
            style={{
              backgroundImage: `url(${buttonCloseBg})`,
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
            }}
          >
            <X className="w-4 h-4 text-white" />
            <span className="text-white text-[14px] font-medium">Close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MpinSettings;
