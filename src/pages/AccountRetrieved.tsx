import React from "react";
import { useNavigate } from "react-router-dom";
import accountRetrievedBg from "@/assets/account-retrieved-bg.png";
import checkIconLarge from "@/assets/check-icon-large.png";
import accRetrievedContainer from "@/assets/acc-retrieved-container.png";
import buttonPrimaryWide from "@/assets/button-primary-wide.png";

const AccountRetrieved = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center pt-[60px] pb-10 px-5 safe-area-top safe-area-bottom overflow-hidden relative"
      style={{
        backgroundImage: `url(${accountRetrievedBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <h1 className="text-white text-[18px] font-medium font-sans mb-8">
        Crisis Averted
      </h1>

      {/* Icon */}
      <div className="mb-6">
        <img src={checkIconLarge} alt="Success" className="w-[80px] h-[80px] object-contain" />
      </div>

      {/* Subtext */}
      <h2 className="text-white text-[18px] font-normal font-sans mb-8 text-center">
        You panicked, we caught you.
      </h2>

      {/* Container */}
      <div
        className="w-full relative p-6 flex flex-col gap-4 rounded-2xl mb-auto"
        style={{
            backgroundImage: `url(${accRetrievedContainer})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            minHeight: "220px"
        }}
      >
        <p className="text-white text-[15px] font-medium font-sans">
            Everything’s back. You’re safe, we're chill, no one cried. (Okay maybe just a little.)
        </p>

        <p className="text-white/70 text-[14px] font-sans leading-relaxed">
            Account reactivated. Let’s pretend this emotional dip never happened. We got you.
        </p>

        <div className="mt-auto pt-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00FF00] shadow-[0_0_8px_rgba(0,255,0,0.6)]"></div>
            <span className="text-[#a1a1a1] text-[13px] font-medium font-sans">
                We don’t talk about the last 2 minutes.
            </span>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="w-full mt-[32px]">
        <button
            className="w-full h-[48px] relative flex items-center justify-center active:scale-95 transition-transform"
            onClick={handleBackHome}
        >
            <img
                src={buttonPrimaryWide}
                alt="Back Home"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
            <span className="relative z-10 text-white text-[16px] font-semibold font-sans">
                Back Home
            </span>
        </button>
      </div>
    </div>
  );
};

export default AccountRetrieved;
