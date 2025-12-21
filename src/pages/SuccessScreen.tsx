import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import successBg from "@/assets/success-bg.png";
import checkIcon from "@/assets/check-icon.png";
import redirectButton from "@/assets/redirect-home-button.png";

const SuccessScreen = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);

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
      className="min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden safe-area-top safe-area-bottom"
      style={{
        backgroundImage: `url(${successBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center gap-6 z-10 mt-[-100px]">
        <img src={checkIcon} alt="Success" className="w-[120px] h-[120px] object-contain" />
        <h1 className="text-white text-[24px] font-bold tracking-wide">KYC Successful!</h1>
        <p className="text-white/70 text-[14px] text-center px-8">
           Redirecting to home in {countdown}s...
        </p>
      </div>

       <div className="absolute bottom-10 left-0 right-0 px-5 flex flex-col items-center gap-4">
        <button onClick={() => navigate("/home")} className="w-full transition-transform active:scale-95">
             <img src={redirectButton} alt="Redirect Home" className="w-full h-auto" />
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
