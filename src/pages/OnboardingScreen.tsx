import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/PhoneInput";
import { SocialButton } from "@/components/SocialButton";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { AppleIcon } from "@/components/icons/AppleIcon";
import { XIcon } from "@/components/icons/XIcon";
import { useToast } from "@/hooks/use-toast";

const OnboardingScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    toast({
      title: "OTP Sent!",
      description: `A verification code has been sent to +91 ${phoneNumber}`,
    });
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} Login`,
      description: `Continue with ${provider} - Coming soon!`,
    });
  };

  return (
    <div className="min-h-[100dvh] gradient-bg flex flex-col safe-area-top safe-area-bottom">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        <div 
          className="animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            dot.pe
          </h1>
          <p className="text-muted-foreground text-base mt-2 text-center">
            Cash access, reimagined.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-6 pb-8 space-y-6">
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
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-sm">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social Login Buttons */}
        <div 
          className="flex justify-center gap-4 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <SocialButton
            icon={<GoogleIcon className="w-6 h-6" />}
            onClick={() => handleSocialLogin("Google")}
            label="Continue with Google"
          />
          <SocialButton
            icon={<AppleIcon className="w-6 h-6 text-foreground" />}
            onClick={() => handleSocialLogin("Apple")}
            label="Continue with Apple"
          />
          <SocialButton
            icon={<XIcon className="w-5 h-5 text-foreground" />}
            onClick={() => handleSocialLogin("X")}
            label="Continue with X"
          />
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
      </div>
    </div>
  );
};

export default OnboardingScreen;
