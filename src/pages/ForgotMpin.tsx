import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import otpInputField from "@/assets/otp-input-field.png";

const ForgotMpin = () => {
  const navigate = useNavigate();
  const { phoneNumber } = useUser();
  const [step, setStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [error, setError] = useState("");

  // Extract last 4 digits or use default if empty
  const last4 = phoneNumber && phoneNumber.length >= 4
    ? phoneNumber.slice(-4)
    : "1234";

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleRequestOTP = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('VERIFY');
    setResendTimer(20);
  };

  const handleResend = () => {
    if (resendTimer === 0) {
        setResendTimer(20);
        // Simulate resend
    }
  };

  const handleSubmit = async () => {
    if (otp.length < 6) return;
    setIsLoading(true);

    // Simulate verify
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (otp === "123456") {
        navigate("/security/mpin-settings", { state: { resetMpin: true } });
    } else {
        setError("Invalid OTP");
        setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a12] flex flex-col safe-area-top safe-area-bottom font-sans"
      style={{
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-center relative">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md absolute left-5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        {/* Header Title: Centered */}
        <h1 className="text-white text-[22px] font-medium font-sans text-center">Forgot MPIN?</h1>
      </div>

      {/* Content */}
      <div className="px-5 flex flex-col w-full">
        {/* Subtext */}
        <p className="mt-[46px] text-white text-[16px] font-bold font-sans text-left leading-relaxed max-w-[340px]">
             {step === 'REQUEST'
                ? `We’ll send a one-time password (OTP) to your registered number ending in ••${last4}`
                : `OTP sent! If it doesn’t show up in 30 seconds, don’t stare at the screen—just tap resend.`
             }
        </p>

        {/* OTP Input - Single Instance */}
        <div className="mt-10 flex flex-col items-center w-full">
            <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => { setOtp(val); setError(""); }}
                autoFocus={step === 'VERIFY'}
                disabled={step === 'REQUEST'}
                className={step === 'REQUEST' ? "opacity-50" : "opacity-100"}
            >
                <InputOTPGroup className="gap-[10px]">
                {[0, 1, 2, 3, 4, 5].map(index => (
                    <InputOTPSlot
                    key={index}
                    index={index}
                    className={`h-[48px] w-[48px] rounded-[7px] border-none text-2xl font-semibold text-white transition-all bg-cover bg-center ${
                        error ? 'ring-1 ring-red-500' : 'ring-1 ring-white/10'
                    }`}
                    style={{
                        backgroundImage: `url(${otpInputField})`,
                        backgroundColor: 'transparent',
                        opacity: step === 'REQUEST' ? 0.5 : 1 // Manually enforce opacity on slots if parent doesn't propagate
                    }}
                    />
                ))}
                </InputOTPGroup>
            </InputOTP>

            {error && <p className="text-red-500 text-sm mt-2 w-full text-left pl-1">{error}</p>}

            {/* Resend Link - Only in Verify Step, Right Aligned */}
            {step === 'VERIFY' && (
                <div className="w-full flex justify-end mt-4 px-1 max-w-[340px]">
                    <button
                        onClick={handleResend}
                        disabled={resendTimer > 0}
                        className={`text-[14px] font-normal ${resendTimer > 0 ? 'text-[#5260FE]' : 'text-white underline'}`}
                    >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                </div>
            )}
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="mt-auto px-5 pb-10 w-full">
        <Button
          onClick={step === 'REQUEST' ? handleRequestOTP : handleSubmit}
          disabled={isLoading || (step === 'VERIFY' && otp.length < 6)}
          className="w-full h-[48px] bg-[#5260FE] hover:bg-[#5260FE]/90 text-white rounded-full text-[16px] font-medium"
        >
          {isLoading ? (
             <span className="flex items-center gap-2">
               <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
               </svg>
               {step === 'REQUEST' ? "Sending..." : "Verifying..."}
             </span>
          ) : (step === 'REQUEST' ? "Request OTP" : "Submit")}
        </Button>
      </div>
    </div>
  );
};

export default ForgotMpin;
