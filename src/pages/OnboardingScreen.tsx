import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/PhoneInput";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LockOpen } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import logo from "@/assets/logo.svg";
import iconGoogle from "@/assets/icon-google.svg";
import iconApple from "@/assets/icon-apple.svg";
import iconX from "@/assets/icon-x.svg";
import otpInputField from "@/assets/otp-input-field.png";
import toggleOn from "@/assets/toggle-on.svg";
import toggleOff from "@/assets/toggle-off.svg";
import mpinInputSuccess from "@/assets/mpin-input-success.png";
import mpinInputError from "@/assets/mpin-input-error.png";
import buttonBiometricBg from "@/assets/button-biometric-bg.png";
import biometricIcon from "@/assets/biometric-icon.png";
import { isWeakMpin } from "@/utils/validationUtils";

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const { setPhoneNumber: savePhoneNumber, setMpin: saveMpin, setBiometricEnabled: saveBiometricEnabled } = useUser();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showMpinSetup, setShowMpinSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation State
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // MPIN State
  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [mpinError, setMpinError] = useState("");
  const [mpinSuccess, setMpinSuccess] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // Validation Logic
  useEffect(() => {
    // Reset success/error on change
    setMpinSuccess(false);

    // Predictable check
    if (mpin.length === 4) {
      const check = isWeakMpin(mpin);
      if (check.weak) {
        setMpinError("Let's stop you right there, try something less predictable?");
        return;
      }
    }

    if (confirmMpin.length === 4 && mpin.length === 4) {
       if (mpin !== confirmMpin) {
         setMpinError("Bro... seriously? That's not even close.");
       } else {
         setMpinError("");
         setMpinSuccess(true);
       }
    } else {
       if (!isWeakMpin(mpin).weak) setMpinError("");
    }
  }, [mpin, confirmMpin]);

  const handleRequestOTP = async () => {
    setPhoneError("");
    if (phoneNumber.length < 10) {
      setPhoneError("Don't ghost us, drop your number.");
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowOtpInput(true);
    setResendTimer(20);
  };

  const handleVerifyOTP = async () => {
    setOtpError("");
    if (otp !== "123456") {
      setOtpError("That code's off target. Double-check your SMS.");
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Save verified phone number to context/localStorage
    savePhoneNumber(`+91 ${phoneNumber}`);
    setShowOtpInput(false);
    setShowMpinSetup(true);
  };

  const handleMpinChange = (val: string) => {
    const numericOnly = val.replace(/\D/g, '');
    setMpin(numericOnly);
  };

  const handleConfirmMpinChange = (val: string) => {
    const numericOnly = val.replace(/\D/g, '');
    setConfirmMpin(numericOnly);
  };

  const handleSetupMpin = async () => {
    // Final validation before submit
    if (mpinError || !mpinSuccess) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Save MPIN to context/storage
    saveMpin(mpin);
    saveBiometricEnabled(biometricEnabled);

    console.log("MPIN Setup Complete!", { biometricEnabled });
    navigate("/home");
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} Login clicked`);
  };

  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    if (phoneError) setPhoneError("");
  };

  const handleOtpChange = (val: string) => {
    setOtp(val);
    if (otpError) setOtpError("");
  };

  // Determine which error type for styling
  const isPredictableError = mpinError.includes("predictable");
  const isMismatchError = mpinError.includes("close");

  return (
    <div
      className="h-full w-full overflow-y-auto overscroll-y-none flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: '#0a0a12',
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Logo Section - only show for phone/OTP screens */}
      {!showMpinSetup && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
          <div className="animate-fade-in flex flex-col items-center" style={{ animationDelay: "0.1s" }}>
            <img src={logo} alt="dot.pe" className="h-12 mb-3" />
            <p className="text-muted-foreground text-[18px] font-normal text-center">
              Cash access, reimagined.
            </p>
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className={`px-6 pb-8 space-y-6 ${showMpinSetup ? 'flex-1 flex flex-col pt-12' : ''}`}>
        {/* Phone Input Screen */}
        {!showOtpInput && !showMpinSetup && (
          <>
            <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h2 className="text-[26px] font-medium text-foreground">Let's get started!</h2>
              <p className="text-muted-foreground text-[14px] font-normal">
                We'll send a one-time code for instant access.
              </p>
            </div>

            <div className="animate-fade-in space-y-2" style={{ animationDelay: "0.3s" }}>
              <PhoneInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                countryCode="+91"
                placeholder="Enter your mobile number"
                error={!!phoneError}
              />
              {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
            </div>

            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button
                variant="gradient"
                className="w-full h-[48px] rounded-full text-[18px] font-medium"
                onClick={handleRequestOTP}
                disabled={isLoading || phoneNumber.length === 0}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : "Request OTP"}
              </Button>
            </div>

            <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-muted-foreground text-sm">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <button onClick={() => handleSocialLogin("Google")} aria-label="Continue with Google" className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95">
                <img src={iconGoogle} alt="" className="w-full h-full" />
              </button>
              <button onClick={() => handleSocialLogin("Apple")} aria-label="Continue with Apple" className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95">
                <img src={iconApple} alt="" className="w-full h-full" />
              </button>
              <button onClick={() => handleSocialLogin("X")} aria-label="Continue with X" className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95">
                <img src={iconX} alt="" className="w-full h-full" />
              </button>
            </div>

            <p style={{ animationDelay: "0.7s" }} className="text-center text-muted-foreground leading-relaxed animate-fade-in px-4 text-sm font-normal">
              By continuing, you agree to Dot.Pe's{" "}
              <a href="#" className="text-link hover:underline">Terms & Conditions</a>{" "}
              and{" "}
              <a href="#" className="text-link hover:underline">Privacy Policy</a>
            </p>
          </>
        )}

        {/* OTP Input Screen */}
        {showOtpInput && !showMpinSetup && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-[26px] font-medium text-foreground">Enter your OTP</h2>
              <p className="text-muted-foreground text-[14px] font-normal">
                Code sent to <span className="text-link">+91 {phoneNumber}</span>
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 py-4">
              <InputOTP maxLength={6} value={otp} onChange={handleOtpChange} autoFocus>
                <InputOTPGroup className="gap-[8px]">
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`h-[48px] w-[48px] rounded-[7px] border-none text-2xl font-semibold text-white transition-all bg-cover bg-center ${otpError ? 'border border-red-500 ring-1 ring-red-500' : 'ring-1 ring-white/10'}`}
                      style={{ backgroundImage: `url(${otpInputField})`, backgroundColor: 'transparent' }}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {otpError && (
                <p className="text-red-500 text-[14px] font-normal self-start pl-2 w-full max-w-[360px] mx-auto text-left">
                  {otpError}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-sm px-1">
              <button
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp("");
                  setOtpError("");
                }}
                className="text-link hover:underline"
              >
                Wrong number? Fix it here.
              </button>
              <button
                onClick={() => {
                  if (resendTimer === 0) {
                    console.log("Resend OTP");
                    setResendTimer(20);
                  }
                }}
                disabled={resendTimer > 0}
                className={`${resendTimer > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-link hover:underline'}`}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>

            <Button
              variant="gradient"
              className="w-full h-[48px] text-[18px] font-medium rounded-full"
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length < 6}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </span>
              ) : "Continue"}
            </Button>

            <div className="flex items-center gap-4 py-2">
              <span className="text-muted-foreground text-sm w-full text-center">or</span>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => handleSocialLogin("Google")} aria-label="Continue with Google" className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95">
                <img src={iconGoogle} alt="" className="w-full h-full" />
              </button>
              <button onClick={() => handleSocialLogin("Apple")} aria-label="Continue with Apple" className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95">
                <img src={iconApple} alt="" className="w-full h-full" />
              </button>
              <button onClick={() => handleSocialLogin("X")} aria-label="Continue with X" className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95">
                <img src={iconX} alt="" className="w-full h-full" />
              </button>
            </div>

            <p className="text-center text-muted-foreground leading-relaxed px-4 pt-2 font-normal text-sm">
              By continuing, you agree to Dot.Pe's{" "}
              <a href="#" className="text-link hover:underline">Terms & Conditions</a>{" "}
              and{" "}
              <a href="#" className="text-link hover:underline">Privacy Policy</a>
            </p>
          </div>
        )}

        {/* MPIN Setup Screen */}
        {showMpinSetup && (
          <div className="space-y-6 animate-fade-in flex-1 flex flex-col">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <LockOpen className="w-6 h-6 text-foreground" />
                <h2 className="text-[26px] font-medium text-foreground">Secure your account</h2>
              </div>
              <p className="text-muted-foreground text-[14px] font-normal">
                Enable quick unlock for faster, secure access using Biometrics or a PIN?
              </p>
            </div>

            {/* Create MPIN */}
            <div className="space-y-3">
              <p className="text-foreground text-[14px] font-normal">Create a secure 4 digit MPIN</p>
              <InputOTP maxLength={4} value={mpin} onChange={handleMpinChange} autoFocus>
                <InputOTPGroup className="w-[364px] justify-between">
                  {[0, 1, 2, 3].map(index => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`h-[54px] w-[81px] rounded-[12px] border-none text-2xl font-semibold text-white transition-all bg-cover bg-center ${
                        isPredictableError ? 'border border-red-500 ring-1 ring-red-500' :
                        mpinSuccess ? 'ring-1 ring-green-500' : 'ring-1 ring-white/10'
                      }`}
                      style={{
                        backgroundImage: isPredictableError ? `url(${mpinInputError})` : 
                                         mpinSuccess ? `url(${mpinInputSuccess})` : undefined,
                        backgroundColor: (isPredictableError || mpinSuccess) ? 'transparent' : 'rgba(26, 26, 46, 0.5)'
                       }}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {isPredictableError && (
                <p className="text-red-500 text-[14px] font-normal">{mpinError}</p>
              )}
            </div>

            {/* Confirm MPIN */}
            <div className="space-y-3">
              <p className="text-foreground text-[14px] font-normal">Re-enter MPIN</p>
              <InputOTP maxLength={4} value={confirmMpin} onChange={handleConfirmMpinChange}>
                <InputOTPGroup className="w-[364px] justify-between">
                  {[0, 1, 2, 3].map(index => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`h-[54px] w-[81px] rounded-[12px] border-none text-2xl font-semibold text-white transition-all bg-cover bg-center ${
                        isMismatchError ? 'border border-red-500 ring-1 ring-red-500' :
                        mpinSuccess ? 'ring-1 ring-green-500' : 'ring-1 ring-white/10'
                      }`}
                      style={{
                        backgroundImage: isMismatchError ? `url(${mpinInputError})` :
                                         mpinSuccess ? `url(${mpinInputSuccess})` : undefined,
                        backgroundColor: (isMismatchError || mpinSuccess) ? 'transparent' : 'rgba(26, 26, 46, 0.5)'
                       }}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {isMismatchError && (
                <p className="text-red-500 text-[14px] font-normal">{mpinError}</p>
              )}
            </div>

            {/* Biometric Toggle */}
            <div
              className="flex items-center justify-between px-4 w-full h-[54px] rounded-2xl border-none bg-cover bg-center"
              style={{
                width: '364px', // Explicit width as requested
                backgroundImage: `url(${buttonBiometricBg})`
              }}
            >
              <div className="flex items-center gap-3">
                <img src={biometricIcon} alt="Biometric" className="w-6 h-6" />
                <span className="text-foreground text-[16px] font-medium">Biometric Unlock</span>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                className="transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <img
                  src={biometricEnabled ? toggleOn : toggleOff}
                  alt={biometricEnabled ? "Enabled" : "Disabled"}
                  className="w-12 h-6"
                />
              </button>
            </div>

            {/* Note */}
            <p className="text-muted-foreground text-[14px] font-normal leading-relaxed">
              Note: While creating an MPIN is necessary, Biometric unlock can be enabled for an extra step of security. You can setup Biometric unlock later from Account Settings &gt; Biometric Unlock.
            </p>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Setup Button */}
            <Button
              variant="gradient"
              className="w-full h-[48px] text-[18px] font-medium rounded-full"
              onClick={handleSetupMpin}
              disabled={isLoading || mpin.length < 4 || confirmMpin.length < 4 || !!mpinError || !mpinSuccess}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Setting up...
                </span>
              ) : "Setup"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
