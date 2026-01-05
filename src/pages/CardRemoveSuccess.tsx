import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.png";
import buttonPrimaryWide from "@/assets/button-primary-wide.png";

const CardRemoveSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(30);

  // Get last4 from state, fallback if missing
  const last4 = location.state?.last4 || "XXXX";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/cards");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col items-center relative overflow-hidden safe-area-top safe-area-bottom px-6"
      style={{
        backgroundImage: `url(${successBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="w-full pt-6 flex justify-center">
        <h1 className="text-white text-[18px] font-semibold">My Cards</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center mb-10">
         {/* Icon */}
        <div className="mb-8">
             <img src={checkIcon} alt="Success" className="w-[80px] h-[80px] object-contain" />
        </div>

        {/* Title */}
        <h2 className="text-white text-[22px] font-bold text-center leading-tight mb-4 px-4">
          You have successfully removed a card ending with **** {last4}
        </h2>

        {/* Subtitle */}
        <p className="text-white/80 text-[14px] text-center leading-relaxed max-w-[320px]">
          Your card has been successfully removed, but you can add it back anytime you want from the ‘My Cards’ section!
        </p>
      </div>

      {/* Bottom Section */}
      <div className="w-full pb-10 flex flex-col items-center gap-4">
        {/* Countdown Button */}
        <button
          onClick={() => navigate("/cards")}
          className="flex items-center justify-center text-foreground text-[14px] font-medium transition-transform active:scale-95"
          style={{
            backgroundImage: `url(${buttonPrimaryWide})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            width: '362px',
            height: '48px'
          }}
        >
          Redirecting Back in {countdown}s...
        </button>

         {/* Spacer to match layout if needed, though not explicitly in screenshot, adhering to previous success screen structure */}
         <div className="h-8" />

      </div>
    </div>
  );
};

export default CardRemoveSuccess;
