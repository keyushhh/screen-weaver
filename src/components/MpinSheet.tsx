import React, { useState, useEffect, useContext } from "react";
import { useUser } from "@/contexts/UserContext";
import { X } from "lucide-react";
import backspaceIcon from "@/assets/backspace.png";

// Reusing InputOTP components from shadcn/ui
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";
import { OTPInputContext } from "input-otp";
import mpinInputSuccess from "@/assets/mpin-input-success.png";
import mpinInputError from "@/assets/mpin-input-error.png";

// Custom Slot to handle masking
const MaskedInputOTPSlot = ({ index, className, style }: { index: number; className?: string; style?: React.CSSProperties }) => {
  const inputOTPContext = useContext(OTPInputContext);
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

interface MpinSheetProps {
  onClose: () => void;
}

const MpinSheet = ({ onClose }: MpinSheetProps) => {
  const { mpin: storedMpin } = useUser();
  const [enteredMpin, setEnteredMpin] = useState("");
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Verify MPIN when 4 digits are entered
  useEffect(() => {
    if (enteredMpin.length === 4) {
      if (enteredMpin === storedMpin) {
        setStatus('success');
        // Do nothing further for now as requested
      } else {
        setStatus('error');
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
    <div className="fixed inset-0 z-50 flex items-end">
        {/* Full screen backdrop */}
        <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        />

        {/* Sheet Container */}
        <div className="relative w-full bg-[#070511] rounded-t-[22px] overflow-hidden flex flex-col h-[92%] animate-in slide-in-from-bottom duration-300">

            {/* Header */}
            <div className="px-5 pt-4 flex items-center justify-between relative z-50">
                <div className="w-[40px]" /> {/* Spacer */}
                <h1 className="text-white text-[18px] font-medium font-sans">Enter MPIN</h1>
                <button
                onClick={onClose}
                className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-white/10 active:bg-white/20 transition-colors"
                >
                <X className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center pt-[80px] gap-8">
                <span className="text-white text-[16px] font-normal font-sans">Enter your MPIN</span>

                <InputOTP maxLength={4} value={enteredMpin} readOnly>
                    <InputOTPGroup className="gap-4">
                        {[0, 1, 2, 3].map(index => (
                            <MaskedInputOTPSlot
                                key={index}
                                index={index}
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
                <div className="flex flex-col gap-[10px] items-center">
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
                            icon={<img src={backspaceIcon} alt="Backspace" className="w-8 h-8 object-contain" />}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default MpinSheet;
