import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import bannerIncomplete from "@/assets/banner-incomplete.png";
import bannerPending from "@/assets/banner-pending.png";
import bannerComplete from "@/assets/banner-complete.png";
import kycAlertIcon from "@/assets/kyc-alert-icon.png";
import kycBadge from "@/assets/kyc-badge.png";
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
    // Height 80px, Badge Icon, Centered Header, Secondary Text
    const commonClasses = "w-full h-[80px] rounded-xl flex items-center justify-between px-4 cursor-pointer relative overflow-hidden";
    const bgStyle = (img: string) => ({
      backgroundImage: `url(${img})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    });

    switch (kycStatus) {
      case "incomplete":
        return (
          <div
            className={commonClasses}
            style={bgStyle(bannerIncomplete)}
            onClick={() => navigate("/kyc-intro")}
          >
            {/* Flex Column for Text */}
            <div className="flex flex-col justify-center w-full h-full">
               <div className="flex items-center gap-2">
                  <img src={kycBadge} className="w-5 h-5 object-contain" alt="Badge" />
                  <span className="text-white text-[16px] font-medium font-sans">Security Breach-ish.</span>
               </div>
               <span className="text-[#7E7E7E] text-[16px] font-normal font-sans mt-[2px]">Some settings need your attention. Give ‘em a tap.</span>
            </div>
            {/* Right Arrow? User didn't ask for one in the new banner spec, but previous had it. Leaving it out as spec didn't mention it. */}
          </div>
        );
      case "pending":
         return (
          <div
            className={commonClasses}
            style={bgStyle(bannerPending)}
          >
            <div className="flex flex-col justify-center w-full h-full">
               <div className="flex items-center gap-2">
                  <img src={kycBadge} className="w-5 h-5 object-contain" alt="Badge" />
                  <span className="text-white text-[16px] font-medium font-sans">In Progress…</span>
               </div>
               <span className="text-[#7E7E7E] text-[16px] font-normal font-sans mt-[2px]">We’re working our magic. Check back soon.</span>
            </div>
          </div>
        );
      case "complete":
        return (
          <div
            className={commonClasses}
            style={bgStyle(bannerComplete)}
          >
            <div className="flex flex-col justify-center w-full h-full">
               <div className="flex items-center gap-2">
                  <img src={kycBadge} className="w-5 h-5 object-contain" alt="Badge" />
                  <span className="text-white text-[16px] font-medium font-sans">Looks Good!</span>
               </div>
               <span className="text-[#7E7E7E] text-[16px] font-normal font-sans mt-[2px]">Your security setup looks good and completed.</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSubmenu = () => {
    const rowHeight = "h-[68px]";
    const chevronClass = "text-[#7E7E7E] w-5 h-5 mr-[10px]"; // Adjusted mr to visually align with '26px from right' including padding

    // KYC Row Logic
    let kycBg = "#0B0B0B";
    let kycIcon = kycIconMenu;
    let kycIconClass = "w-6 h-6 object-contain";

    // Incomplete specific overrides
    if (kycStatus === "incomplete") {
        kycBg = "rgba(255, 30, 30, 0.12)";
        kycIcon = kycAlertIcon;
    } else if (kycStatus === "pending") {
        kycBg = "rgba(250, 204, 21, 0.12)";
        // kycIcon remains kycIconMenu but might need tint? Spec didn't say tint icon, just container.
        // User said "Use the 'kyc' icon for this"
    }

    return (
        <div className="flex flex-col gap-[4px] w-full">

            {/* ROW 1: KYC */}
            <div
                className={`w-full ${rowHeight} flex items-center justify-between px-4 cursor-pointer rounded-t-xl rounded-b-none`}
                style={{ backgroundColor: kycBg }}
                onClick={() => kycStatus === 'incomplete' && navigate("/kyc-intro")}
            >
                <div className="flex items-center gap-4">
                    <img src={kycIcon} alt="KYC" className={kycIconClass} />
                    <div className="flex flex-col justify-center">
                        <span className="text-white text-[14px] font-medium font-sans">KYC</span>
                        <span className="text-[#7E7E7E] text-[12px] font-normal font-sans leading-tight">KYC also unlocks wallet limits, faster refunds, and your inner peace.</span>
                    </div>
                </div>
                <ChevronRight className={chevronClass} />
            </div>

            {/* ROW 2: MPIN */}
            <div className={`w-full ${rowHeight} flex items-center justify-between px-4 bg-[#0B0B0B] cursor-pointer`}>
                 <div className="flex items-center gap-4">
                    <img src={mpinIcon} alt="MPIN" className="w-6 h-6 object-contain" />
                    <div className="flex flex-col justify-center">
                        <span className="text-white text-[14px] font-medium font-sans">MPIN</span>
                        <span className="text-[#7E7E7E] text-[12px] font-normal font-sans leading-tight">No birthdays, no 1234. We're judging you silently.</span>
                    </div>
                </div>
                <ChevronRight className={chevronClass} />
            </div>

            {/* ROW 3: Biometric */}
            <div className={`w-full ${rowHeight} flex items-center justify-between px-4 bg-[#0B0B0B]`}>
                 <div className="flex items-center gap-4">
                    <img src={biometricIcon} alt="Biometric" className="w-6 h-6 object-contain" />
                    <div className="flex flex-col justify-center">
                        <span className="text-white text-[14px] font-medium font-sans">Biometric Unlock</span>
                        <span className="text-[#7E7E7E] text-[12px] font-normal font-sans leading-tight max-w-[240px]">Don’t worry, your face/finger data stays on your phone. We don’t want it. Promise</span>
                    </div>
                </div>
                <div className="mr-[12px]">
                    <Switch
                        checked={biometricEnabled}
                        onCheckedChange={setBiometricEnabled}
                        className="data-[state=checked]:bg-[#5260FE]"
                    />
                </div>
            </div>

            {/* ROW 4: Delete Account */}
            <div className={`w-full ${rowHeight} flex items-center justify-between px-4 bg-[#0B0B0B] cursor-pointer rounded-t-none rounded-b-xl`}>
                 <div className="flex items-center gap-4">
                    <img src={deleteAccountIcon} alt="Delete" className="w-6 h-6 object-contain" />
                    <div className="flex flex-col justify-center">
                        <span className="text-white text-[14px] font-medium font-sans">Delete Account</span>
                        <span className="text-[#7E7E7E] text-[12px] font-normal font-sans leading-tight">Thinking of leaving? It's okay, we can handle heartbreak.</span>
                    </div>
                </div>
                <ChevronRight className={chevronClass} />
            </div>

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

        {/* Submenu */}
        {renderSubmenu()}

      </div>
    </div>
  );
};

export default SecurityDashboard;
