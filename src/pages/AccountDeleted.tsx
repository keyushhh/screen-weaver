import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import accountDeletedBg from "@/assets/account-deleted-bg.png";
import sadFace from "@/assets/sad-face.png";
import deleteAccContainer from "@/assets/delete-acc-container.png";
import buttonCancelWide from "@/assets/button-cancel-wide.png";

const AccountDeleted = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleTimeout();
    }
  }, [timeLeft]);

  const handleTimeout = () => {
    // Clear user state
    localStorage.removeItem("dotpe_user_state");
    localStorage.removeItem("dotpe_user_cards");
    localStorage.removeItem("dotpe_user_bank_accounts");
    localStorage.removeItem("dotpe_user_mpin");

    // Redirect to root
    navigate("/");
  };

  const handleTakeMeBack = () => {
    navigate("/account-retrieved");
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center pt-[60px] pb-10 px-5 safe-area-top safe-area-bottom overflow-hidden relative"
      style={{
        backgroundImage: `url(${accountDeletedBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <h1 className="text-white text-[18px] font-medium font-sans mb-8">
        Delete Account
      </h1>

      {/* Icon */}
      <div className="mb-6">
        <img src={sadFace} alt="Sad Face" className="w-[80px] h-[80px] object-contain" />
      </div>

      {/* Subtext */}
      <h2 className="text-white text-[18px] font-normal font-sans mb-8 text-center">
        And just like that... you ghosted us.
      </h2>

      {/* Container */}
      <div
        className="w-full relative p-6 flex flex-col gap-4 rounded-2xl mb-auto"
        style={{
            backgroundImage: `url(${deleteAccContainer})`,
            backgroundSize: "100% 100%", // Stretch to fit
            backgroundRepeat: "no-repeat",
            minHeight: "260px" // Approximate height based on content
        }}
      >
        <p className="text-white text-[15px] font-medium font-sans">
          No worries — it’s not like we cried or anything.
        </p>

        <div className="space-y-4 text-white/70 text-[14px] font-sans leading-relaxed">
            <p>
                No judgment though — digital breakups happen.
            </p>
            <p>
                But if the loneliness hits different at 3AM, you can come back. Just wait 24 hours. We’re petty, not cruel.
            </p>
        </div>

        <div className="mt-auto pt-6 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.6)]"></div>
            <span className="text-[#FF3B30] text-[13px] font-medium font-sans">
                Deleted but still in our feels.
            </span>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="w-full mt-8 flex flex-col items-center gap-3">
        <button
            className="w-full h-[48px] relative flex items-center justify-center active:scale-95 transition-transform"
            onClick={handleTakeMeBack}
        >
            <img
                src={buttonCancelWide}
                alt="Take Me Back"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
            <span className="relative z-10 text-white text-[16px] font-semibold font-sans">
                Ugh, Take Me Back
            </span>
        </button>

        <p className="text-white/40 text-[13px] font-sans">
            (Redirecting in {timeLeft}s..)
        </p>
      </div>
    </div>
  );
};

export default AccountDeleted;
