import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import pillContainerBg from "@/assets/pill-container-bg.png";
import infoContainerBg from "@/assets/order-cash-info-bg.png";
import backspaceIcon from "@/assets/backspace.png";
import { Button } from "@/components/ui/button";

const OrderCash = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("0.00");

  const handleKeyPress = (key: string) => {
    setAmount((prev) => {
      // If currently "0.00", replace with the new key (unless it's a dot)
      if (prev === "0.00") {
        return key === "." ? "0." : key;
      }

      // Prevent multiple dots
      if (key === "." && prev.includes(".")) {
        return prev;
      }

      // Limit to 2 decimal places
      if (prev.includes(".")) {
        const [whole, decimal] = prev.split(".");
        if (decimal && decimal.length >= 2) {
            return prev;
        }
      }

      return prev + key;
    });
  };

  const handleBackspace = () => {
    setAmount((prev) => {
      if (prev.length <= 1) return "0.00";
      if (prev === "0.00") return "0.00";
      return prev.slice(0, -1);
    });
  };

  const handlePillClick = (val: string) => {
    setAmount(val);
  };

  const KeypadButton = ({ label, onClick, icon }: { label?: string; onClick?: () => void; icon?: React.ReactNode }) => (
    <button
      onClick={onClick}
      className="w-[113px] h-[65px] bg-[#000000] rounded-xl flex items-center justify-center active:bg-[#5260FE] active:text-white transition-colors group"
    >
      {icon ? (
        // Pass a prop or handle style change for icon on active if needed,
        // but for now just the button background changes.
        // We can force the icon brightness if needed, but the requirements just said "key highlighted purple".
        <div className="group-active:brightness-200">
           {icon}
        </div>
      ) : (
        <span className="text-white group-active:text-white font-bold font-sans text-[32px]">{label}</span>
      )}
    </button>
  );

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="flex-1 text-center text-white text-[18px] font-medium font-sans pr-14">
          Order Cash
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-[60px]">
        {/* Amount Display */}
        <div className="flex items-center justify-center mb-2">
            <span className="text-white text-[48px] font-medium font-sans mr-2">₹</span>
            <span className="text-white text-[48px] font-medium font-sans">{amount}</span>
        </div>

        {/* Balance Text */}
        <p className="text-white/60 text-[12px] font-sans font-normal mb-[17px]">
            Total Available Balance ₹ 13,00,058.00
        </p>

        {/* Pills */}
        <div className="flex gap-4 mb-8">
            {["500", "1000", "1500"].map((val) => (
                <button
                    key={val}
                    onClick={() => handlePillClick(val)}
                    className="relative h-[30px] flex items-center justify-center px-3 py-[6px] transition-transform active:scale-95"
                >
                    <div
                        className="absolute inset-0 w-full h-full"
                        style={{
                            backgroundImage: `url(${pillContainerBg})`,
                            backgroundSize: "100% 100%",
                            backgroundRepeat: "no-repeat",
                        }}
                    />
                    <span className="relative z-10 text-white text-[12px] font-medium font-sans">
                        +₹{val}
                    </span>
                </button>
            ))}
        </div>

        {/* Spacer to push everything else down to bottom */}
        <div className="flex-1" />

        {/* Info Container */}
        <div className="w-full px-5 pb-[16px]">
            <div
                className="w-full h-[61px] relative flex flex-col justify-center px-[18px] py-[10px]"
                style={{
                    backgroundImage: `url(${infoContainerBg})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <p className="text-white text-[14px] font-medium font-sans mb-[9px] leading-none">
                    Amount will be held from wallet
                </p>
                <p className="text-white text-[12px] font-light font-sans leading-none">
                    You won’t be charged unless the delivery is completed.
                </p>
            </div>
        </div>

        {/* Keypad Container */}
        <div className="w-full bg-[#05050B] rounded-t-[30px] p-[20px] pb-[40px]">
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
                    <KeypadButton label="." onClick={() => handleKeyPress(".")} />
                    <KeypadButton label="0" onClick={() => handleKeyPress("0")} />
                    <KeypadButton
                        onClick={handleBackspace}
                        icon={<img src={backspaceIcon} alt="Backspace" className="w-[18px] h-[18px] object-contain" />}
                    />
                </div>

                {/* CTA */}
                <div className="w-full mt-[32px]">
                    <Button
                        className="w-full h-[48px] bg-[#5260FE] hover:bg-[#5260FE]/90 text-white rounded-full text-[16px] font-medium font-sans"
                    >
                        Place Order
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCash;
