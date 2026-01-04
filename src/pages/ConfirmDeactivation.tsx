import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import buttonRemoveCard from "@/assets/button-remove-card.png";
import buttonCancel from "@/assets/button-cancel-wide.png";
import mpinInputSuccess from "@/assets/mpin-input-success.png";
import mpinInputError from "@/assets/mpin-input-error.png";

// Custom Slot to handle masking and styling - matching MpinSheet
const MaskedSlot = ({ char, hasFakeCaret, isActive, isError, isValid }: { char: string | null; hasFakeCaret: boolean; isActive: boolean; isError: boolean, isValid: boolean }) => {
  return (
    <div
      className={`relative flex items-center justify-center h-[54px] w-[81px] rounded-[12px] border-none text-[32px] font-bold text-white transition-all bg-cover bg-center ring-1 ${
        isError ? 'ring-red-500' :
        isValid ? 'ring-green-500' :
        isActive ? 'ring-[#5260FE]' : 'ring-white/10'
      }`}
      style={{
          backgroundColor: 'rgba(26, 26, 46, 0.5)',
          backgroundImage: isError ? `url(${mpinInputError})` :
                           isValid ? `url(${mpinInputSuccess})` : undefined
      }}
    >
      {char ? "*" : ""}
      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-8 bg-white animate-caret-blink" />
        </div>
      )}
    </div>
  );
};

const ConfirmDeactivation = () => {
  const navigate = useNavigate();
  const { mpin: storedMpin, setMpin } = useUser();
  const [mpin, setMpinState] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Reset states on change
    setIsValid(false);
    setIsError(false);

    if (mpin.length === 4) {
      if (mpin === storedMpin) {
        setIsValid(true);
      } else {
        setIsError(true);
      }
    }
  }, [mpin, storedMpin]);

  const handleDeactivate = () => {
    if (!isValid) return;

    navigate("/account-deactivated");
  };

  const handleBack = () => {
    navigate("/delete-account");
  };

  return (
    <div
      className="h-full w-full overflow-y-auto flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center relative z-50 mb-0">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md absolute left-5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-[18px] font-medium font-sans w-full text-center">Deactivate</h1>
      </div>

      {/* Content */}
      <div className="px-5 flex-1 flex flex-col mt-[46px]">
        {/* Texts */}
        <h2 className="text-white text-[18px] font-bold font-sans">Confirm Deactivation</h2>
        <div className="h-[6px]" />
        <p className="text-[#C4C4C4] text-[14px] font-normal font-sans">
          Just to be sure — enter your MPIN to confirm.
        </p>

        {/* Input Label */}
        <div className="mt-[36px] mb-[12px]">
            <span className="text-white text-[14px] font-medium font-sans">Enter MPIN</span>
        </div>

        {/* MPIN Input */}
        <div className="w-full">
            <InputOTP
                maxLength={4}
                value={mpin}
                onChange={(value) => setMpinState(value)}
                inputMode="numeric"
                render={({ slots }) => (
                    <div className="flex gap-4">
                        {slots.map((slot, idx) => (
                            <MaskedSlot
                                key={idx}
                                char={slot.char}
                                hasFakeCaret={slot.hasFakeCaret}
                                isActive={slot.isActive}
                                isError={isError}
                                isValid={isValid}
                            />
                        ))}
                    </div>
                )}
            />
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="px-5 pb-10 mt-auto flex flex-col gap-3">
        {/* Deactivate Button */}
        <button
            className={`w-full h-[48px] relative flex items-center justify-center transition-all ${
                isValid ? "active:scale-95" : "opacity-50 grayscale cursor-not-allowed"
            }`}
            onClick={handleDeactivate}
            disabled={!isValid}
        >
            <img
                src={buttonRemoveCard}
                alt="Deactivate Account"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
            <span className="relative z-10 text-white text-[16px] font-semibold font-sans">Deactivate Account</span>
        </button>

        {/* Cancel Button */}
        <button
            className="w-full h-[48px] relative flex items-center justify-center active:scale-95 transition-transform"
            onClick={handleBack}
        >
            <img
                src={buttonCancel}
                alt="Cancel"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
             <span className="relative z-10 text-white text-[16px] font-semibold font-sans">Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeactivation;
