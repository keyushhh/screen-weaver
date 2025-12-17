import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/PhoneInput";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import logo from "@/assets/logo.svg";
import iconGoogle from "@/assets/icon-google.svg";
import iconApple from "@/assets/icon-apple.svg";
import iconX from "@/assets/icon-x.svg";

const OnboardingScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRequestOTP = async () => {
    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowOtpInput(true);

    toast({
      title: "OTP Sent!",
      description: `A verification code has been sent to +91 ${phoneNumber}`,
    });
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: "Success!",
      description: "Phone number verified successfully",
    });
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} Login`,
      description: `Continue with ${provider} - Coming soon!`,
    });
  };

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
              className="animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <PhoneInput
                value={phoneNumber}
                onChange={setPhoneNumber}
                countryCode="+91"
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Request OTP Button */}
            <div
              className="animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                variant="gradient"
                className="w-full"
                onClick={handleRequestOTP}
                disabled={isLoading}
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
                Enter Verification Code
              </h2>
              <p className="text-muted-foreground text-sm">
                We've sent a code to +91 {phoneNumber}
                <button
                  onClick={() => setShowOtpInput(false)}
                  className="ml-2 text-link hover:underline font-medium"
                >
                  Change
                </button>
              </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center py-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                autoFocus
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="h-12 w-12 rounded-lg border-white/20 bg-white/5 text-lg" />
                  <InputOTPSlot index={1} className="h-12 w-12 rounded-lg border-white/20 bg-white/5 text-lg" />
                  <InputOTPSlot index={2} className="h-12 w-12 rounded-lg border-white/20 bg-white/5 text-lg" />
                  <InputOTPSlot index={3} className="h-12 w-12 rounded-lg border-white/20 bg-white/5 text-lg" />
                  <InputOTPSlot index={4} className="h-12 w-12 rounded-lg border-white/20 bg-white/5 text-lg" />
                  <InputOTPSlot index={5} className="h-12 w-12 rounded-lg border-white/20 bg-white/5 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <Button
              variant="gradient"
              className="w-full"
              onClick={handleVerifyOTP}
              disabled={isLoading}
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
                "Verify OTP"
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  onClick={() => {
                    toast({
                      title: "OTP Resent",
                      description: `A new code has been sent to +91 ${phoneNumber}`,
                    });
                  }}
                  className="text-link hover:underline font-medium"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingScreen;
