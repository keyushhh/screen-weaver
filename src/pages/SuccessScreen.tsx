import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.png";
import redirectHomeButton from "@/assets/redirect-home-button.png";

const SuccessScreen = () => {
  const navigate = useNavigate();
  const { submitKyc } = useUser();
  const [countdown, setCountdown] = useState(30);

  // Set KYC status to pending on mount
  useEffect(() => {
    submitKyc();
  }, [submitKyc]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/home");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center relative overflow-hidden safe-area-top safe-area-bottom px-6"
      style={{
        backgroundImage: `url(${successBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="w-full pt-6 flex justify-center">
        <h1 className="text-white text-[18px] font-semibold">KYC</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mb-10">
         {/* Icon */}
        <div className="mb-8">
             <img src={checkIcon} alt="Success" className="w-[80px] h-[80px] object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-white text-[22px] font-bold text-center leading-tight mb-4">
          Your KYC details has been submitted successfully!
        </h2>

        {/* Subtitle */}
        <p className="text-white/80 text-[14px] text-center leading-relaxed max-w-[320px]">
          We’ve received your KYC details. Verification typically takes under 30 minutes.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="w-full pb-10 flex flex-col items-center gap-4">
        {/* Countdown Button */}
        <button
            onClick={() => navigate("/home")}
            className="w-[361px] h-[48px] rounded-full text-white text-[17px] font-medium transition-transform active:scale-95 flex items-center justify-center relative"
        >
          <img
            src={redirectHomeButton}
            alt="Redirect Button Background"
            className="absolute inset-0 w-full h-full"
          />
          <span className="relative z-10">Redirecting Home in {countdown}s...</span>
        </button>

        {/* Disclaimer 1 */}
        <p className="text-white/40 text-[12px] text-center">
          (Because refreshing the screen won’t make it go faster.)
        </p>

         <div className="h-8" /> {/* Spacer */}

        {/* Footer Text */}
        <p className="text-white/60 text-[13px] text-center leading-snug px-4">
          If accepted, you’ll officially be one of us. If rejected... it’s probably your lighting.
        </p>
      </div>
    </div>
  );
};

export default SuccessScreen;
