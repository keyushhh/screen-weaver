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
      className="min-h-[100dvh] flex flex-col items-center safe-area-top safe-area-bottom overflow-hidden relative"
      style={{
        backgroundImage: `url(${warningBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header Content */}
      <div className="flex flex-col items-center mt-[120px] w-full px-6">
        <h1 className="text-white text-[32px] font-medium font-sans mb-[30px]">
          Deactivated
        </h1>
        <img src={sadIcon} alt="Sad Face" className="w-[80px] h-[80px] mb-[40px]" />
        <p className="text-white text-[16px] font-semibold font-sans text-center">
          So we really are on a break, huh?
        </p>
      </div>

      {/* Status Box */}
      <div className="w-full px-5 mt-[36px]">
        <div
            className="w-full relative rounded-[20px] p-[24px]"
            style={{
                backgroundImage: `url(${containerBg})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
            }}
        >
            <h3 className="text-white text-[18px] font-medium font-sans mb-[12px] leading-tight">
                We won’t beg. But we will be a little dramatic.
            </h3>
            <p className="text-[#9CA3AF] text-[15px] font-normal font-sans leading-relaxed mb-[28px]">
                Deactivating won’t fix your commitment issues. But go ahead... we’ll be here, sipping sadness and session tokens.
            </p>

            <div className="flex items-center gap-3">
                <img src={warningEllipse} alt="Status" className="w-[20px] h-[20px]" />
                <span className="text-[#D1D5DB] text-[13px] font-normal font-sans">
                    You haven’t ghosted us completely.
                </span>
            </div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="mt-12 w-full px-5 flex flex-col items-center">
        <Button
            variant="outline"
            onClick={handlePanicked}
            className="w-full h-[52px] rounded-full bg-transparent border border-white/20 text-white font-semibold text-[16px] hover:bg-white/10 hover:text-white"
        >
            I Panicked!
        </Button>
        <p className="text-[#9CA3AF] text-[14px] font-normal font-sans mt-[15px]">
            (Redirecting in {countdown}s..)
        </p>
      </div>
    </div>
  );
};

export default AccountDeactivated;
