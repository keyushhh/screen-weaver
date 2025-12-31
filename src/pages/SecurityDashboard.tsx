import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import bannerIncomplete from "@/assets/banner-incomplete.png";
import bannerPending from "@/assets/banner-pending.png";
import bannerComplete from "@/assets/banner-complete.png";
import kycAlertIcon from "@/assets/kyc-alert-icon.png";
import kycIconMenu from "@/assets/kyc-icon-menu.png";
import biometricIcon from "@/assets/biometric-icon-menu.png";
import mpinIcon from "@/assets/mpin-icon.png";
import deleteAccountIcon from "@/assets/delete-account-icon.png";
import { Switch } from "@/components/ui/switch";

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const { kycStatus } = useUser();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const getStatusBanner = () => {
    switch (kycStatus) {
      case "incomplete":
        return (
          <div
            className="w-full h-[88px] rounded-xl flex items-center justify-between px-4 cursor-pointer"
            style={{
              backgroundImage: `url(${bannerIncomplete})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => navigate("/kyc-intro")}
          >
            <div className="flex items-center gap-3">
              <img src={kycAlertIcon} className="w-[42px] h-[36px] object-contain" alt="Alert" />
              <div className="flex flex-col">
                <span className="text-white text-[16px] font-bold font-sans">Action Required</span>
                <span className="text-white/80 text-[12px] font-sans">Complete your KYC</span>
              </div>
            </div>
            <ChevronRight className="text-white w-5 h-5" />
          </div>
        );
      case "pending":
        return (
          <div
            className="w-full h-[88px] rounded-xl flex items-center px-4"
            style={{
              backgroundImage: `url(${bannerPending})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
             <div className="flex flex-col ml-2">
                <span className="text-[#84680B] text-[16px] font-bold font-sans">In Progress</span>
                <span className="text-[#84680B]/80 text-[12px] font-sans">Verification underway</span>
             </div>
          </div>
        );
      case "complete":
        return (
          <div
            className="w-full h-[88px] rounded-xl flex items-center px-4"
            style={{
              backgroundImage: `url(${bannerComplete})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
             <div className="flex flex-col ml-2">
                <span className="text-[#0E542D] text-[16px] font-bold font-sans">Looks Good</span>
                <span className="text-[#0E542D]/80 text-[12px] font-sans">All set</span>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderKycMenuItem = () => {
    const commonClasses = "flex items-center justify-between p-4 rounded-xl border";

    if (kycStatus === "incomplete") {
      return (
        <div
          className={`${commonClasses} bg-[#381111] border-[#FF3B30]/30 cursor-pointer`}
          onClick={() => navigate("/kyc-intro")}
        >
            <div className="flex items-center gap-4">
                <img src={kycAlertIcon} alt="KYC Alert" className="w-6 h-6 object-contain" />
                <div className="flex flex-col">
                    <span className="text-[#FF3B30] text-[16px] font-medium font-sans">KYC</span>
                    <span className="text-[#FF3B30]/80 text-[12px] font-sans">KYC also unlocks wallet limits, faster refunds, and your inner peace.</span>
                </div>
            </div>
            <ChevronRight className="text-[#FF3B30] w-5 h-5" />
        </div>
      );
    }

    if (kycStatus === "pending") {
      return (
        <div
          className={`${commonClasses} bg-[#342805] border-[#FFCC00]/30 cursor-pointer`}
        >
            <div className="flex items-center gap-4">
                <img src={kycIconMenu} alt="KYC Pending" className="w-6 h-6 object-contain opacity-80" style={{ filter: 'sepia(1) hue-rotate(5deg) saturate(5)' }} />
                <div className="flex flex-col">
                    <span className="text-[#FFCC00] text-[16px] font-medium font-sans">KYC</span>
                    <span className="text-[#FFCC00]/80 text-[12px] font-sans">KYC also unlocks wallet limits, faster refunds, and your inner peace.</span>
                </div>
            </div>
            <ChevronRight className="text-[#FFCC00] w-5 h-5" />
        </div>
      );
    }

    // Complete
    return (
        <div
          className={`${commonClasses} bg-white/5 border-white/10 cursor-pointer`}
        >
            <div className="flex items-center gap-4">
                <img src={kycIconMenu} alt="KYC" className="w-6 h-6 object-contain" />
                <div className="flex flex-col">
                    <span className="text-white text-[16px] font-medium font-sans">KYC</span>
                    <span className="text-white/60 text-[12px] font-sans">KYC also unlocks wallet limits, faster refunds, and your inner peace.</span>
                </div>
            </div>
            <ChevronRight className="text-white/40 w-5 h-5" />
        </div>
    );
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/settings")}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-[18px] font-semibold font-sans">Security & KYC</h1>
      </div>

      {/* Radar Animation Section */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
         {/* Placeholder Radar */}
        <div className="w-[200px] h-[200px] rounded-full border border-white/10 flex items-center justify-center relative">
            <div className="absolute w-full h-full rounded-full border border-[#5260FE]/30 animate-pulse"></div>
            <div className="w-[140px] h-[140px] rounded-full bg-[#5260FE]/10 flex items-center justify-center">
                 <div className="w-[10px] h-[10px] bg-[#5260FE] rounded-full shadow-[0_0_20px_#5260FE]"></div>
            </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="px-5 pb-10 flex flex-col gap-6">

        {/* Dynamic KYC Banner */}
        {getStatusBanner()}

        {/* Menu Items */}
        <div className="flex flex-col gap-4">

            {/* KYC Menu Item */}
            {renderKycMenuItem()}

            {/* Change MPIN */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                    <img src={mpinIcon} alt="MPIN" className="w-6 h-6 object-contain" />
                    <div className="flex flex-col">
                        <span className="text-white text-[16px] font-medium font-sans">Change MPIN</span>
                        <span className="text-white/60 text-[12px] font-sans">No birthdays, no 1234. We're judging you silently.</span>
                    </div>
                </div>
                <ChevronRight className="text-white/40 w-5 h-5" />
            </div>

            {/* Biometric Unlock */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                    <img src={biometricIcon} alt="Biometric" className="w-6 h-6 object-contain" />
                    <div className="flex flex-col">
                        <span className="text-white text-[16px] font-medium font-sans">Biometric Unlock</span>
                        <span className="text-white/60 text-[12px] font-sans max-w-[200px]">Don't worry, your face/finger data stays on your phone.</span>
                    </div>
                </div>
                <Switch
                    checked={biometricEnabled}
                    onCheckedChange={setBiometricEnabled}
                />
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                    <img src={deleteAccountIcon} alt="Delete" className="w-6 h-6 object-contain" />
                    <div className="flex flex-col">
                        <span className="text-white text-[16px] font-medium font-sans">Delete Account</span>
                        <span className="text-white/60 text-[12px] font-sans">Thinking of leaving? It's okay, we can handle heartbreak.</span>
                    </div>
                </div>
                <ChevronRight className="text-white/40 w-5 h-5" />
            </div>

        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
