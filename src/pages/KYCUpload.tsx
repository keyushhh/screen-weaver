import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import stepsBg from "@/assets/kyc-steps-bg.png";
import iconFlash from "@/assets/icon-flash.png";
import iconGallery from "@/assets/icon-gallery.png";
import iconPlaceholder from "@/assets/icon-gallery-placeholder.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const KYCUpload = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");

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
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32 no-scrollbar">
        {/* Steps Indicator */}
        <div
          className="w-full h-[88px] rounded-[20px] p-5 mb-6 relative overflow-hidden"
          style={{
            backgroundImage: `url(${stepsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-[14px] font-medium">Step 2/4</span>
            <span className="text-white text-[14px] font-medium">Upload & Verify</span>
          </div>
          <div className="w-full h-[6px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-[50%] bg-[#5260FE] rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h2 className="text-white text-[18px] font-semibold mb-1">Upload Document</h2>
          <p className="text-muted-foreground text-[14px]">
            Position your ID clearly within the frame.
          </p>
        </div>

        {/* Camera Area */}
        <div className="w-full h-[220px] bg-black rounded-[24px] mb-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Controls */}
          <div className="absolute bottom-4 flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95">
              <img src={iconFlash} alt="Flash" className="w-10 h-10" />
            </button>
             <button className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95">
              <img src={iconGallery} alt="Gallery" className="w-10 h-10" />
            </button>
          </div>
          <p className="text-white/60 text-[12px] mb-8">Upload front side</p>
        </div>

        {/* Thumbnails Section */}
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex gap-4">
                    {/* Front Side */}
                    <div className="w-[100px] h-[80px] rounded-[12px] border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2">
                        <img src={iconPlaceholder} alt="" className="w-6 h-6 opacity-50" />
                        <span className="text-white/60 text-[10px]">Front side</span>
                    </div>
                     {/* Back Side */}
                    <div className="w-[100px] h-[80px] rounded-[12px] border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2">
                        <img src={iconPlaceholder} alt="" className="w-6 h-6 opacity-50" />
                        <span className="text-white/60 text-[10px]">Back side</span>
                    </div>
                </div>
                <button className="text-red-500 text-[12px] underline underline-offset-2">
                    Clear All
                </button>
            </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-8">
            <Input
                placeholder="Document Number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="h-[54px] rounded-[27px] bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/60 px-6"
            />
            <Input
                placeholder="Full Name as per Document"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-[54px] rounded-[27px] bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/60 px-6"
            />
            <Input
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-[54px] rounded-[27px] bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/60 px-6"
            />
        </div>

        {/* OTP Section */}
        <div className="space-y-4">
            <p className="text-muted-foreground text-[14px]">
                An OTP has been sent to your registered mobile number.
            </p>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="w-full justify-between gap-2">
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="h-[54px] w-full rounded-[12px] border border-white/10 bg-white/5 text-xl font-semibold text-white"
                    />
                  ))}
                </InputOTPGroup>
            </InputOTP>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="text-white/80 text-[12px]">Awaiting OTP verification</span>
                </div>
                <button className="text-muted-foreground text-[12px] hover:text-white">
                    Didn't receive OTP?
                </button>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-[#0a0a12] to-transparent">
        <Button
          variant="gradient"
          className="w-full h-[48px] rounded-full text-[16px] font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default KYCUpload;
