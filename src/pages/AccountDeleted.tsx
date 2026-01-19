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
    localStorage.removeItem("gridpe_user_state");
    localStorage.removeItem("gridpe_user_cards");
    localStorage.removeItem("gridpe_user_bank_accounts");
    localStorage.removeItem("gridpe_user_mpin");

    // Redirect to root
    navigate("/");
  };

  const handleTakeMeBack = () => {
    navigate("/account-retrieved");
  };

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col items-center pt-[60px] pb-10 px-5 safe-area-top safe-area-bottom overflow-hidden relative"
      style={{
        backgroundImage: `url(${accountDeletedBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <h1 className="text-white text-[26px] font-medium font-sans mb-[12px]">
        Delete Account
      </h1>

      {/* Icon */}
      <div className="mb-[35px]">
        <img src={sadFace} alt="Sad Face" className="w-[62px] h-[62px] object-contain" />
      </div>

      {/* Subtext */}
      <h2 className="text-white text-[18px] font-bold font-sans mb-[32px] text-center leading-tight">
        And just like that... you ghosted us.
      </h2>

      {/* Container */}
      <div
        className="w-full relative px-[15px] py-[11px] flex flex-col rounded-2xl"
        style={{
            backgroundImage: `url(${deleteAccContainer})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
        }}
      >
        <p className="text-white text-[16px] font-medium font-sans mb-[12px]">
          No worries — it’s not like we cried or anything.
        </p>

        <div className="text-[#AFAFAF] text-[16px] font-normal font-sans leading-relaxed mb-[12px]">
            <p className="mb-1">
                No judgment though — digital breakups happen.
            </p>
            <p>
                But if the loneliness hits different at 3AM, you can come back. Just wait 24 hours. We’re petty, not cruel.
            </p>
        </div>

        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.6)]"></div>
            <span className="text-[#D0D0D0] text-[12px] font-normal font-sans">
                Deleted but still in our feels.
            </span>
        </div>
      </div>

      {/* Footer / Action */}
      <div className="w-full mt-[32px] flex flex-col items-center">
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

        <p className="text-white/40 text-[13px] font-sans mt-[8px]">
            (Redirecting in {timeLeft}s..)
        </p>
      </div>
    </div>
  );
};

export default AccountDeleted;