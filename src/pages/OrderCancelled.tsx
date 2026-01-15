import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import errorBg from "@/assets/error-bg.png";
import cancelledIcon from "@/assets/cancelled-ico.svg";
import deliveryCancelledIcon from "@/assets/delivery-cancelled-ico.svg";

const OrderCancelled = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalAmount } = location.state || {};
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      navigate("/home");
    }
  }, [timer, navigate]);

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col items-center safe-area-top safe-area-bottom relative"
      style={{
        backgroundColor: "#0a0a12", // Fallback
        backgroundImage: `url(${errorBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header Spacer or Content */}
      <div className="mt-[60px] flex flex-col items-center w-full px-5">

        {/* Title */}
        <h1 className="text-white text-[26px] font-medium font-sans mb-[20px]">
          Order Cancelled
        </h1>

        {/* Big Icon */}
        <div className="w-[62px] h-[62px] mb-[24px]">
            <img src={cancelledIcon} alt="Cancelled" className="w-full h-full object-contain" />
        </div>

        {/* Subheader */}
        <h2 className="text-white text-[18px] font-bold font-sans text-center mb-[24px]">
          Well, that escalated unnecessarily fast.
        </h2>

        {/* Info Container */}
        <div
          className="w-full rounded-[13px] p-[16px] mb-[32px]"
          style={{
             border: "1px solid rgba(255, 255, 255, 0.20)",
             background: "rgba(0, 0, 0, 0.20)", // Semi-transparent based on screenshot look
             backdropFilter: "blur(10px)",
          }}
        >
            {/* Amount Text */}
            <p className="text-white text-[16px] font-medium font-sans mb-[8px]">
                Your order for amount ₹{(totalAmount || 0).toLocaleString('en-IN')} has been cancelled.
            </p>

            {/* Body Text */}
            <p className="text-[#AFAFAF] text-[14px] font-normal font-sans leading-[1.5] mb-[20px]">
                The delivery gods were halfway out the door when you pulled the plug. <br/>
                Your refund will arrive in 30 minutes.. unlike closure, or that text back from 2020.
            </p>

            {/* Footer Row */}
            <div className="flex items-center">
                 <img src={deliveryCancelledIcon} alt="Status" className="w-[16px] h-[16px] mr-[8px]" />
                 <span className="text-[#D0D0D0] text-[13px] font-normal font-sans">
                     Delivery cancelled.
                 </span>
            </div>
        </div>

        {/* Countdown Button */}
        <button
            onClick={() => navigate("/home")}
            className="w-full h-[50px] rounded-full flex items-center justify-center text-white text-[16px] font-medium font-sans mb-[16px] transition-colors hover:bg-white/10"
            style={{
                border: "1px solid rgba(255, 255, 255, 0.20)",
                backgroundColor: "transparent",
            }}
        >
            Redirecting Home in {timer}s...
        </button>

        {/* Bottom Text */}
        <p className="text-[#6F6F6F] text-[13px] font-normal font-sans text-center leading-snug px-4">
            (so you don't sit here questioning your life choices — <br /> again)
        </p>

      </div>
    </div>
  );
};

export default OrderCancelled;
