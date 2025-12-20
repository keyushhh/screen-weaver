import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import stepsBg from "@/assets/kyc-steps-bg.png";
import { Button } from "@/components/ui/button";

const KYCSelfie = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">KYC</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 px-5 pt-4">
        {/* Steps Indicator */}
        <div
          className="w-full h-[88px] rounded-[20px] p-5 mb-8 relative overflow-hidden"
          style={{
            backgroundImage: `url(${stepsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-[14px] font-medium">Step 3/4</span>
            <span className="text-white text-[14px] font-medium">Verify Your Identity</span>
          </div>
          <div className="w-full h-[6px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-[75%] bg-[#5260FE] rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-white text-[18px] font-semibold mb-4">Verify your identity</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-white/60 mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              <p className="text-white/60 text-[14px]">Take a clear selfie</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white/60 mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              <p className="text-white/60 text-[14px]">Match against uploaded document</p>
            </li>
          </ul>
        </div>

        {/* Open Camera Button */}
        <div className="mt-8">
             <Button
                variant="default" // Using default since gradient variant might need check or custom class
                className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white"
                onClick={() => {
                    // Logic for opening camera will go here later
                    console.log("Open Camera");
                }}
            >
                Open Camera
            </Button>
        </div>

      </div>
    </div>
  );
};

export default KYCSelfie;
