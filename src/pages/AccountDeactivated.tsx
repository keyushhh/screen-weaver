import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import warningBackground from "@/assets/warning-background.png";
import sadIcon from "@/assets/sad.png";
import containerBg from "@/assets/container-bg.png";
import warningEllipse from "@/assets/warning-ellipse.png";
import { Button } from "@/components/ui/button";

const AccountDeactivated = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown <= 0) {
      localStorage.clear();
      navigate("/");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, navigate]);

  const handlePanicked = () => {
    navigate("/security-dashboard");
  };

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col items-center safe-area-top safe-area-bottom overflow-hidden relative"
      style={{
        backgroundImage: `url(${warningBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center mt-4">
        <h1 className="text-white text-[26px] font-medium font-sans">
          Deactivated
        </h1>

        {/* Icon */}
        <img
            src={sadIcon}
            alt="Sad Face"
            className="w-[62px] h-[62px] mt-[12px]"
        />

        {/* Sub-heading */}
        <p className="text-white text-[16px] font-bold font-sans mt-[35px]">
          So we really are on a break, huh?
        </p>
      </div>

      {/* Info Container */}
      <div
        className="w-[362px] mt-[35px] relative"
        style={{
            backgroundImage: `url(${containerBg})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            // Padding Spec: T11 L15 B11
            paddingTop: "11px",
            paddingLeft: "15px",
            paddingBottom: "11px",
            paddingRight: "15px" // Assuming symmetric or auto right
        }}
      >
        {/* Title */}
        <h3 className="text-white text-[16px] font-medium font-sans leading-tight">
            We won’t beg. But we will be a little dramatic.
        </h3>

        {/* Body */}
        <p className="text-[#AFAFAF] text-[13px] font-normal font-sans leading-relaxed mt-[17px]">
            Deactivating won’t fix your commitment issues. But go ahead... we’ll be here, sipping sadness and session tokens.
        </p>

        {/* Status Row */}
        <div className="flex items-center gap-[6px] mt-[23px]">
            <img src={warningEllipse} alt="Status" className="w-[14px] h-[14px]" />
            <span className="text-[#D0D0D0] text-[13px] font-normal font-sans">
                You haven’t ghosted us completely.
            </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-[362px] mt-[29px]">
        <Button
            onClick={handlePanicked}
            className="w-full h-[52px] rounded-full bg-[#1C1C1E] text-white font-semibold text-[16px] hover:bg-[#2C2C2E] border-none"
        >
            I Panicked!
        </Button>
      </div>

      {/* Redirect Text */}
      <p className="text-[#AFAFAF] text-[14px] font-normal font-sans mt-[15px]">
          (Redirecting in {countdown}s..)
      </p>
    </div>
  );
};

export default AccountDeactivated;
