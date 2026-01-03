import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Delete, X } from "lucide-react"; // Using Lucide for backspace and close
import bgDarkMode from "@/assets/bg-dark-mode.png";

// Reusing InputOTP components from shadcn/ui (as used in Onboarding)
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";
import { OTPInputContext } from "input-otp";
import mpinInputSuccess from "@/assets/mpin-input-success.png";
import mpinInputError from "@/assets/mpin-input-error.png";

// Custom Slot to handle masking
const MaskedInputOTPSlot = ({ index, className, style }: { index: number; className?: string; style?: React.CSSProperties }) => {
  const inputOTPContext = useContext(OTPInputContext);
  // Safe guard if context is missing (though it shouldn't be inside InputOTP)
  const slot = inputOTPContext?.slots[index];
  const char = slot?.char;

  return (
    <div
      className={className}
      style={style}
    >
      {char ? "*" : ""}
    </div>
  );
};

const EnterMpin = () => {
  const navigate = useNavigate();
  const { mpin: storedMpin } = useUser();
  const [enteredMpin, setEnteredMpin] = useState("");
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Verify MPIN when 4 digits are entered
  useEffect(() => {
    if (enteredMpin.length === 4) {
      if (enteredMpin === storedMpin) {
        setStatus('success');
        console.log("MPIN Correct!");
        // User said: "do nothing, just let it be" for now.
      } else {
        setStatus('error');
        console.log("MPIN Incorrect!");
        // Clear after a short delay or just show error
        setTimeout(() => {
            setEnteredMpin("");
            setStatus('idle');
        }, 500);
      }
    } else {
        setStatus('idle');
    }
  }, [enteredMpin, storedMpin]);

  const handleKeyPress = (key: string) => {
    if (enteredMpin.length < 4) {
      setEnteredMpin(prev => prev + key);
    }
  };

  const handleBackspace = () => {
    setEnteredMpin(prev => prev.slice(0, -1));
  };

  const KeypadButton = ({ label, onClick, icon }: { label?: string; onClick?: () => void; icon?: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="w-[113px] h-[65px] bg-[#000000] rounded-xl flex items-center justify-center active:bg-white/10 transition-colors"
    >
      {icon ? icon : <span className="text-white font-bold font-sans text-[32px]">{label}</span>}
    </button>
  );

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
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between relative z-50">
        <div className="w-[40px]" /> {/* Spacer for centering */}
        <h1 className="text-white text-[18px] font-medium font-sans">Enter MPIN</h1>
        <button
          onClick={() => navigate("/security-dashboard")}
          className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center pt-[100px] gap-8">
        <span className="text-white text-[16px] font-normal font-sans">Enter your MPIN</span>

        {/* Visual MPIN Display using InputOTP structure for consistency but controlled manually */}
        <InputOTP maxLength={4} value={enteredMpin} readOnly>
            <InputOTPGroup className="gap-4">
                {[0, 1, 2, 3].map(index => (
                    <MaskedInputOTPSlot
                        key={index}
                        index={index}
                        // Reusing styling from Onboarding: 81x54px
                        className={`flex items-center justify-center h-[54px] w-[81px] rounded-[12px] border-none text-[32px] font-bold text-white transition-all bg-cover bg-center ring-1 ${
                            status === 'error' ? 'ring-red-500' :
                            status === 'success' ? 'ring-green-500' : 'ring-white/10'
                        }`}
                        style={{
                            backgroundColor: 'rgba(26, 26, 46, 0.5)',
                            backgroundImage: status === 'error' ? `url(${mpinInputError})` :
                                           status === 'success' ? `url(${mpinInputSuccess})` : undefined
                        }}
                    />
                ))}
            </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Keypad Section */}
      <div className="bg-[#05050B] rounded-t-[30px] p-[20px] pb-[40px]">
        <div className="flex flex-col gap-[14px] items-center">
            {/* Row 1 */}
            <div className="flex gap-[10px]">
                <KeypadButton label="1" onClick={() => handleKeyPress("1")} />
                <KeypadButton label="2" onClick={() => handleKeyPress("2")} />
                <KeypadButton label="3" onClick={() => handleKeyPress("3")} />
            </div>
            {/* Row 2 */}
            <div className="flex gap-[10px]">
                <KeypadButton label="4" onClick={() => handleKeyPress("4")} />
                <KeypadButton label="5" onClick={() => handleKeyPress("5")} />
                <KeypadButton label="6" onClick={() => handleKeyPress("6")} />
            </div>
            {/* Row 3 */}
            <div className="flex gap-[10px]">
                <KeypadButton label="7" onClick={() => handleKeyPress("7")} />
                <KeypadButton label="8" onClick={() => handleKeyPress("8")} />
                <KeypadButton label="9" onClick={() => handleKeyPress("9")} />
            </div>
            {/* Row 4 */}
            <div className="flex gap-[10px]">
                <div className="w-[113px] h-[65px]" /> {/* Empty */}
                <KeypadButton label="0" onClick={() => handleKeyPress("0")} />
                <KeypadButton
                    onClick={handleBackspace}
                    icon={<Delete className="text-white w-8 h-8" />}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default EnterMpin;
