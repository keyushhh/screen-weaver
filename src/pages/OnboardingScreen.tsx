import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/PhoneInput";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { LockOpen } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import logo from "@/assets/grid.pe.svg";
import iconGoogle from "@/assets/icon-google.svg";
import iconApple from "@/assets/icon-apple.svg";
import iconX from "@/assets/frame-2095585539.svg";
import otpInputField from "@/assets/otp-input-field.png";
import toggleOn from "@/assets/toggle-on.svg";
import toggleOff from "@/assets/toggle-off.svg";
import mpinInputSuccess from "@/assets/mpin-input-success.png";
import mpinInputError from "@/assets/mpin-input-error.png";
import buttonBiometricBg from "@/assets/button-biometric-bg.png";
import biometricIcon from "@/assets/biometric-icon.png";
import { isWeakMpin } from "@/utils/validationUtils";
import { supabase } from "@/lib/supabase";
import { Capacitor } from "@capacitor/core";
import { Provider, User } from "@supabase/supabase-js";

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const {
    setPhoneNumber: savePhoneNumber,
    setMpin: saveMpin,
    setBiometricEnabled: saveBiometricEnabled,
    setProfile,
  } = useUser();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showMpinSetup, setShowMpinSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const [mpin, setMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [mpinError, setMpinError] = useState("");
  const [mpinSuccess, setMpinSuccess] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const i = setInterval(() => setResendTimer(t => t - 1), 1000);
      return () => clearInterval(i);
    }
  }, [resendTimer]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) handleSession(data.session.user);
    });

    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s?.user) handleSession(s.user);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMpinSuccess(false);

    if (mpin.length === 4 && isWeakMpin(mpin).weak) {
      setMpinError("Let's stop you right there, try something less predictable?");
      return;
    }

    if (confirmMpin.length === 4 && mpin.length === 4) {
      if (mpin !== confirmMpin) {
        setMpinError("Bro... seriously? That's not even close.");
      } else {
        setMpinError("");
        setMpinSuccess(true);
      }
    }
  }, [mpin, confirmMpin]);

  const handleRequestOTP = async () => {
    if (isLoading) return;
    setPhoneError("");

    if (phoneNumber.length < 10) {
      setPhoneError("Don't ghost us, drop your number.");
      return;
    }

    setIsLoading(true);

    try {
      const digits = phoneNumber.replace(/\D/g, "").slice(-10);
      const phone = `+91${digits}`;

      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) throw error;

      setShowOtpInput(true);
      setResendTimer(20);
    } catch (e: any) {
      setPhoneError(e.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSession = async (user: User) => {
    let profile;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.preferred_username ||
      user.email;

    if (error?.code === "PGRST116") {
      const { data: created } = await supabase
        .from("profiles")
        .insert({ id: user.id, phone: user.phone, name, mpin_set: false })
        .select()
        .single();
      profile = created;
    } else {
      profile = data;
    }

    setProfile(profile);
    if (user.phone) savePhoneNumber(user.phone);

    if (profile?.mpin_set) {
      navigate("/home");
    } else {
      setShowOtpInput(false);
      setShowMpinSetup(true);
    }
  };

  const handleVerifyOTP = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const digits = phoneNumber.replace(/\D/g, "").slice(-10);
      const phone = `+91${digits}`;

      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: otp.trim(),
        type: "sms",
      });

      if (error || !data.user) throw error;
      await handleSession(data.user);
    } catch (e: any) {
      setOtpError(e.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupMpin = async () => {
    if (!mpinSuccess) return;

    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { data: updated } = await supabase
        .from("profiles")
        .update({ mpin_set: true })
        .eq("id", data.user.id)
        .select()
        .single();
      setProfile(updated);
    }

    saveMpin(mpin);
    saveBiometricEnabled(biometricEnabled);
    navigate("/home");
  };

  const handleSocialLogin = async (name: string) => {
    let provider: Provider | undefined;
    if (name === "Google") provider = "google";
    if (name === "X") provider = "x";

    if (!provider) return;

    const isNative = Capacitor.isNativePlatform();
    let redirectTo: string;

    // ✅ FINAL RULE
    if (provider === "x") {
      redirectTo = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/callback`;
    } else {
      redirectTo = isNative
        ? "gridpe://auth-callback"
        : `${window.location.origin}/#/auth/v1/callback`;
    }

    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* UI unchanged */}
    </div>
  );
};

export default OnboardingScreen;
