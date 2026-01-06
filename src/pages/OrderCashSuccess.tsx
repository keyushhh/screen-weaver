import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.png";
import buttonPrimary from "@/assets/button-primary-wide.png";

const OrderCashSuccess = () => {
  const navigate = useNavigate();

  // Auto redirect after 30 seconds as a fallback
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 30000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col items-center safe-area-top safe-area-bottom"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${successBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full px-5">
        {/* Success Icon */}
        <div className="mb-6 animate-in zoom-in duration-500">
          <img src={checkIcon} alt="Success" className="w-[80px] h-[80px]" />
        </div>

        {/* Text */}
        <h1 className="text-white text-[24px] font-bold font-sans mb-2 text-center">
          Order Placed!
        </h1>
        <p className="text-white/60 text-[16px] font-normal font-sans text-center max-w-[280px]">
            Your cash delivery is on its way.
        </p>
      </div>

      {/* Footer */}
      <div className="w-full px-5 pb-10">
        <button
          onClick={() => navigate("/home")}
          className="w-full h-[48px] flex items-center justify-center text-white text-[16px] font-medium font-sans"
          style={{
            backgroundImage: `url(${buttonPrimary})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderCashSuccess;
