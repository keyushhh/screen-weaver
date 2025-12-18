import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/PhoneInput";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LockOpen } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import logo from "@/assets/logo.svg";
import iconGoogle from "@/assets/icon-google.svg";
import iconApple from "@/assets/icon-apple.svg";
import iconX from "@/assets/icon-x.svg";
import otpInputField from "@/assets/otp-input-field.png";
import toggleOn from "@/assets/toggle-on.svg";
import toggleOff from "@/assets/toggle-off.svg";

const OnboardingScreen = () => {
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
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  // Predictable PINs to reject
  const predictablePins = ["1234", "0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "4321", "1212", "2121"];

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
    setShowOtpInput(false);
    setShowMpinSetup(true);
  };

  const handleMpinChange = (val: string) => {
    setMpin(val);
    setMpinError("");
  };

  const handleConfirmMpinChange = (val: string) => {
    setConfirmMpin(val);
    setMpinError("");
  };

  const handleSetupMpin = async () => {
    setMpinError("");

    // Check for predictable PIN
    if (predictablePins.includes(mpin)) {
      setMpinError("Let's stop you right there, try something less predictable?");
      return;
    }

    // Check if PINs match
    if (mpin !== confirmMpin) {
      setMpinError("Bro... seriously? That's not even close.");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    console.log("MPIN Setup Complete!", { biometricEnabled });
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
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
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
                <InputOTPGroup className="gap-[8px]">
                  {[0, 1, 2, 3].map(index => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`h-[56px] w-[72px] rounded-[12px] border text-2xl font-semibold text-white transition-all bg-[#1a1a2e]/50 ${
                        isPredictableError ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                      }`}
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
                <InputOTPGroup className="gap-[8px]">
                  {[0, 1, 2, 3].map(index => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`h-[56px] w-[72px] rounded-[12px] border text-2xl font-semibold text-white transition-all bg-[#1a1a2e]/50 ${
                        isMismatchError ? 'border-red-500 ring-1 ring-red-500' : 'border-white/10'
                      }`}
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
              className="flex items-center justify-between p-4 rounded-2xl border border-white/10"
              style={{
                background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(15, 15, 30, 0.9) 100%)'
              }}
            >
              <div className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.81 4.47C17.73 4.47 17.65 4.45 17.58 4.41C15.66 3.42 14 3 12 3C10.03 3 8.15 3.47 6.44 4.41C6.2 4.54 5.9 4.45 5.76 4.21C5.63 3.97 5.72 3.66 5.96 3.53C7.82 2.5 9.86 2 12 2C14.14 2 16 2.47 18.04 3.5C18.29 3.65 18.38 3.95 18.25 4.19C18.16 4.37 17.99 4.47 17.81 4.47ZM3.5 9.72C3.4 9.72 3.3 9.7 3.21 9.64C2.98 9.49 2.91 9.19 3.06 8.96C3.62 8.08 4.32 7.31 5.14 6.68C7.2 5.09 9.64 4.27 12.09 4.27C14.55 4.27 16.96 5.08 19.01 6.66C19.81 7.28 20.5 8.03 21.05 8.89C21.2 9.12 21.13 9.42 20.9 9.57C20.67 9.72 20.37 9.65 20.22 9.42C19.73 8.65 19.11 7.98 18.39 7.43C16.53 5.99 14.33 5.26 12.08 5.26C9.85 5.26 7.62 6 5.77 7.45C5.03 8.01 4.39 8.7 3.91 9.49C3.81 9.64 3.66 9.72 3.5 9.72ZM9.75 21.79C9.62 21.79 9.49 21.74 9.4 21.64C8.53 20.77 8.06 20.21 7.39 19C6.7 17.77 6.34 16.27 6.34 14.66C6.34 11.69 8.88 9.27 12 9.27C15.12 9.27 17.66 11.69 17.66 14.66C17.66 14.94 17.44 15.16 17.16 15.16C16.88 15.16 16.66 14.94 16.66 14.66C16.66 12.24 14.57 10.27 12 10.27C9.43 10.27 7.34 12.24 7.34 14.66C7.34 16.1 7.66 17.43 8.27 18.51C8.91 19.66 9.35 20.15 10.12 20.93C10.31 21.13 10.31 21.44 10.12 21.64C10 21.74 9.88 21.79 9.75 21.79ZM16.92 19.94C15.73 19.94 14.68 19.64 13.82 19.05C12.33 18.04 11.44 16.4 11.44 14.66C11.44 14.38 11.66 14.16 11.94 14.16C12.22 14.16 12.44 14.38 12.44 14.66C12.44 16.07 13.16 17.4 14.38 18.22C15.09 18.7 15.94 18.93 16.92 18.93C17.11 18.93 17.37 18.92 17.63 18.88C17.91 18.84 18.16 19.03 18.2 19.31C18.24 19.59 18.05 19.84 17.77 19.88C17.42 19.93 17.12 19.94 16.92 19.94ZM14.91 22C14.87 22 14.82 22 14.78 21.99C13.76 21.76 12.91 21.37 12.17 20.8C10.76 19.71 9.94 18.19 9.94 14.66C9.94 13.63 10.81 12.79 11.88 12.79C12.95 12.79 13.81 13.63 13.81 14.66C13.81 15.78 14.52 16.37 15.25 16.37C15.97 16.37 16.69 15.78 16.69 14.66C16.69 12.16 14.59 10.14 12 10.14C9.25 10.14 7.06 12.33 7.06 15.09C7.06 15.37 6.84 15.59 6.56 15.59C6.28 15.59 6.06 15.37 6.06 15.09C6.06 11.79 8.73 9.14 12 9.14C15.12 9.14 17.69 11.61 17.69 14.66C17.69 16.32 16.39 17.37 15.25 17.37C14.1 17.37 12.81 16.32 12.81 14.66C12.81 14.18 12.4 13.79 11.88 13.79C11.36 13.79 10.94 14.18 10.94 14.66C10.94 17.86 11.61 19.05 12.82 19.97C13.44 20.45 14.18 20.77 15.04 20.97C15.32 21.03 15.5 21.3 15.44 21.58C15.39 21.83 15.16 22 14.91 22Z" fill="white"/>
                </svg>
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
              disabled={isLoading || mpin.length < 4 || confirmMpin.length < 4}
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
