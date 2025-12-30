import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import autoFetchBg from "@/assets/auto-fetch.png";
import manualEntryBg from "@/assets/manual-entry.png";
import radioFilled from "@/assets/radio-filled.png";
import radioEmpty from "@/assets/radio-empty.png";
import recommendedBadge from "@/assets/recommended.png";
import otpInputField from "@/assets/otp-input-field.png";
import awaitingOtp from "@/assets/awaiting-otp.png";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/PhoneInput";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Selection = "auto" | "manual";

const AddBank = () => {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<Selection>("auto");
  const [mobile, setMobile] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Timer logic
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleRequestOTP = async () => {
    if (mobile.length < 10) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowOtpInput(true);
    setResendTimer(30);
  };

  const handleContinue = async () => {
    if (otp !== "123456") return; // Simple validation

    setIsLoading(true);
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    // For now, just log or navigate back since no specific destination was given
    console.log("Bank account verified");
    navigate("/banking/linked-accounts", { state: { mobile } });
  };

  const isButtonDisabled = () => {
    if (isLoading) return true;
    if (!showOtpInput) return mobile.length < 10;
    return otp.length < 6;
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col relative safe-area-top safe-area-bottom overflow-hidden"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between shrink-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">Banking</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 mt-8 overflow-y-auto scrollbar-hide pb-32">
        <p className="text-white text-[16px] font-medium leading-relaxed mb-8">
          Whether you like shortcuts or full control —
          <br />
          we’ve got you.
        </p>

        {/* Options */}
        <div className="space-y-4">
          {/* Auto Fetch */}
          <div
            className={`relative rounded-2xl p-[12px] border transition-all duration-200 overflow-hidden ${
              selection === "auto"
                ? "border-white/20 bg-white/5"
                : "border-white/10 bg-black/20"
            }`}
            onClick={() => setSelection("auto")}
          >
            {/* Background Asset */}
            <div
              className="absolute inset-0 z-0 opacity-100"
              style={{
                backgroundImage: `url(${autoFetchBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Content Layer */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <img
                    src={selection === "auto" ? radioFilled : radioEmpty}
                    alt="radio"
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="text-white text-[15px] font-medium">
                    Auto-fetch bank accounts
                  </span>
                </div>
                {/* Recommended Badge */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '109px',
                    height: '25px',
                    backgroundImage: `url(${recommendedBadge})`,
                    backgroundSize: 'cover'
                  }}
                >
                  <span className="text-white text-[12px] font-medium mb-[1px]">Recommended</span>
                </div>
              </div>

              {/* Description */}
              <div className="pl-9">
                <p className="text-white/60 text-[13px] leading-relaxed">
                  Let Anumati do the digging. We’ll fetch your linked<br />
                  accounts in a snap.<br />
                  Safe, fast, and totally RBI-approved.
                </p>
              </div>
            </div>
          </div>

          {/* Manual Entry */}
          <div
            className={`relative rounded-2xl p-[12px] border transition-all duration-200 overflow-hidden flex items-center ${
              selection === "manual"
                ? "border-white/20 bg-white/5"
                : "border-white/10 bg-black/20"
            }`}
            onClick={() => setSelection("manual")}
            style={{ height: "64px" }}
          >
            {/* Background Asset */}
            <div
              className="absolute inset-0 z-0 opacity-100"
              style={{
                backgroundImage: `url(${manualEntryBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex items-center gap-4 w-full">
              <img
                src={selection === "manual" ? radioFilled : radioEmpty}
                alt="radio"
                className="w-5 h-5 shrink-0"
              />
              <span className="text-white text-[15px] font-medium">
                Add bank account manually
              </span>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mt-10 animate-fade-in">
          <label className="text-white text-[15px] font-medium font-sans mb-4 block">
            Bank-registered mobile number
          </label>
          <PhoneInput
            value={mobile}
            onChange={setMobile}
            countryCode="+91"
            placeholder="Enter your mobile number"
            disabled={showOtpInput}
          />
        </div>

        {/* OTP Section */}
        {showOtpInput && (
          <div className="mt-8 animate-fade-in space-y-4">
            <p className="text-white/60 text-[14px]">
              An OTP has been sent to your registered mobile number.
            </p>

            <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
              <InputOTPGroup className="gap-2 w-full justify-between">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-[52px] w-12 rounded-[7px] border-none text-xl font-semibold text-white transition-all bg-cover bg-center ring-1 ring-white/10"
                    style={{
                      backgroundImage: `url(${otpInputField})`,
                      backgroundColor: 'transparent'
                    }}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <img src={awaitingOtp} alt="pending" className="w-5 h-5" />
                <span className="text-white/60 text-[13px]">Awaiting OTP verification</span>
              </div>
              <button
                onClick={() => {
                   if (resendTimer === 0) {
                     setResendTimer(30);
                     // Logic to resend OTP could go here
                   }
                }}
                disabled={resendTimer > 0}
                className="text-white/60 text-[13px] hover:text-white transition-colors disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Didn't receive OTP?"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-0 w-full px-5 flex justify-center z-20">
        <Button
          variant="gradient"
          className="w-full h-[48px] rounded-full text-[18px] font-medium"
          onClick={showOtpInput ? handleContinue : handleRequestOTP}
          disabled={isButtonDisabled()}
        >
          {isLoading ? (
             <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {showOtpInput ? "Verifying..." : "Requesting..."}
             </span>
          ) : (
            showOtpInput ? "Continue" : "Request OTP"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddBank;
