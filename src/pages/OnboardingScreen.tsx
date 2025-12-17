import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/PhoneInput";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import logo from "@/assets/logo.svg";
import iconGoogle from "@/assets/icon-google.svg";
import iconApple from "@/assets/icon-apple.svg";
import iconX from "@/assets/icon-x.svg";
import otpInputField from "@/assets/otp-input-field.png";

const OnboardingScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation State
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleRequestOTP = async () => {
    // Reset error
    setPhoneError("");

    // Simulate Validation
    if (phoneNumber.length < 10) {
      setPhoneError("Don't ghost us, drop your number.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowOtpInput(true);
  };

  const handleVerifyOTP = async () => {
    setOtpError("");

    // Simulate Verification
    // Success condition: e.g., '123456'
    if (otp !== "123456") {
        setOtpError("That code's off target. Double-check your SMS.");
        return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    // Proceed to next screen or show success (Just console for now since no toast)
    console.log("Verified!");
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
  }

  return (
    <div 
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: '#0a0a12',
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        <div 
          className="animate-fade-in flex flex-col items-center"
          style={{ animationDelay: "0.1s" }}
        >
          <img src={logo} alt="dot.pe" className="h-12 mb-3" />
          <p className="text-muted-foreground text-base text-center">
            Cash access, reimagined.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-6 pb-8 space-y-6">
        {!showOtpInput ? (
          <>
            {/* Heading */}
            <div
              className="text-center space-y-2 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-2xl font-bold text-foreground">
                Let's get started!
              </h2>
              <p className="text-muted-foreground text-sm">
                We'll send a one-time code for instant access.
              </p>
            </div>

            {/* Phone Input */}
            <div
              className="animate-fade-in space-y-2"
              style={{ animationDelay: "0.3s" }}
            >
              <PhoneInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                countryCode="+91"
                placeholder="Enter your mobile number"
                error={!!phoneError}
              />
              {phoneError && (
                <p className="text-red-500 text-sm">{phoneError}</p>
              )}
            </div>

            {/* Request OTP Button */}
            <div
              className="animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                variant="gradient"
                className="w-full rounded-full"
                onClick={handleRequestOTP}
                disabled={isLoading || phoneNumber.length === 0}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Request OTP"
                )}
              </Button>
            </div>

            {/* Divider */}
            <div
              className="flex items-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-muted-foreground text-sm">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Social Login Buttons */}
            <div
              className="flex justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <button
                onClick={() => handleSocialLogin("Google")}
                aria-label="Continue with Google"
                className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <img src={iconGoogle} alt="" className="w-full h-full" />
              </button>
              <button
                onClick={() => handleSocialLogin("Apple")}
                aria-label="Continue with Apple"
                className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <img src={iconApple} alt="" className="w-full h-full" />
              </button>
              <button
                onClick={() => handleSocialLogin("X")}
                aria-label="Continue with X"
                className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <img src={iconX} alt="" className="w-full h-full" />
              </button>
            </div>

            {/* Terms */}
            <p
              className="text-center text-xs text-muted-foreground leading-relaxed animate-fade-in px-4"
              style={{ animationDelay: "0.7s" }}
            >
              By continuing, you agree to Dot.Pe's{" "}
              <a href="#" className="text-link hover:underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-link hover:underline">
                Privacy Policy
              </a>
            </p>
          </>
        ) : (
          <div className="space-y-6 animate-fade-in">
             {/* Heading */}
             <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Enter your OTP
              </h2>
              <p className="text-muted-foreground text-sm">
                Code sent to <span className="text-link">+91 {phoneNumber}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex flex-col items-center gap-2 py-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOtpChange}
                autoFocus
              >
                <InputOTPGroup className="gap-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={`h-14 w-12 rounded-xl border-none text-2xl font-semibold text-white transition-all bg-cover bg-center ${
                          otpError ? 'border border-red-500 ring-1 ring-red-500' : 'ring-1 ring-white/10'
                      }`}
                      style={{
                        backgroundImage: `url(${otpInputField})`,
                        backgroundColor: 'transparent'
                      }}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {otpError && (
                 <p className="text-red-500 text-sm self-start pl-2 w-full max-w-[360px] mx-auto text-left">
                     {otpError}
                 </p>
              )}
            </div>

            {/* Links */}
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
                  // Resend logic mock
                  console.log("Resend OTP");
                }}
                className="text-link hover:underline"
              >
                Resend OTP in 20s
              </button>
            </div>

            {/* Verify Button */}
            <Button
              variant="gradient"
              className="w-full h-12 text-base rounded-full"
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.length < 6}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Continue"
              )}
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <span className="text-muted-foreground text-sm w-full text-center">or</span>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSocialLogin("Google")}
                aria-label="Continue with Google"
                className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <img src={iconGoogle} alt="" className="w-full h-full" />
              </button>
              <button
                onClick={() => handleSocialLogin("Apple")}
                aria-label="Continue with Apple"
                className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <img src={iconApple} alt="" className="w-full h-full" />
              </button>
              <button
                onClick={() => handleSocialLogin("X")}
                aria-label="Continue with X"
                className="w-[52px] h-[52px] transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <img src={iconX} alt="" className="w-full h-full" />
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground leading-relaxed px-4 pt-2">
              By continuing, you agree to Dot.Pe's{" "}
              <a href="#" className="text-link hover:underline">
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-link hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
