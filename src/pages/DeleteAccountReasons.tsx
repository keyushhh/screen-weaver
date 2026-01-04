import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import buttonRemoveCard from "@/assets/button-remove-card.png";
import buttonCancel from "@/assets/button-cancel-wide.png";

const DeleteAccountReasons = () => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState<number>(0); // Default to first option
  const [otherReason, setOtherReason] = useState("");

  const reasons = [
    "No longer using the service/platform",
    "Privacy concerns",
    "Difficulty navigating the platform",
    "Account security concerns",
    "Other (aka “it’s not you, it’s me”)"
  ];

  const handleGoBack = () => {
    navigate("/delete-account");
  };

  const handleCancel = () => {
    navigate("/security-dashboard");
  };

  const handleDelete = () => {
    // No-op for now
    console.log("Delete clicked", {
        reason: reasons[selectedReason],
        details: selectedReason === 4 ? otherReason : undefined
    });
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center relative z-50 mb-8">
        <button
          onClick={handleGoBack}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md absolute left-5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white text-[22px] font-medium font-sans w-full text-center">Delete Account</h1>
      </div>

      <div className="px-5 flex-1 flex flex-col">
        {/* Warning Section */}
        <div className="mb-8">
            <h2 className="text-white text-[16px] font-bold font-sans mb-2 leading-tight">
                You’re about to vanish. This action is irreversible.
            </h2>
            <p className="text-[#C4C4C4] text-[13px] font-normal font-sans leading-relaxed">
                Make sure you have no active transactions and that your wallet balance is fully withdrawn.
                <br />
                (Deleting an account with a balance will result in total loss of funds. Poof.)
            </p>
        </div>

        {/* Reasons Section */}
        <div className="mb-2">
            <h3 className="text-[#919191] text-[11px] font-bold font-sans tracking-widest uppercase mb-1">
                REASON FOR DELETION
            </h3>
            <p className="text-[#919191] text-[12px] font-normal font-sans italic mb-4">
                (because “just vibes” isn’t a valid reason apparently)
            </p>

            {/* Options Container */}
            <div className="relative rounded-[20px] p-[1px] bg-gradient-to-b from-white/12 to-black/20">
                <div
                    className="w-full bg-[#191919]/30 backdrop-blur-[24px] rounded-[20px] flex flex-col overflow-hidden"
                    style={{ height: '185px' }}
                >
                    {reasons.map((reason, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedReason(index)}
                            className={`
                                flex-1 flex items-center px-4 cursor-pointer relative
                                ${index !== reasons.length - 1 ? 'border-b border-[#919191]/25' : ''}
                            `}
                        >
                            {/* Radio Button */}
                            <div className={`
                                w-[18px] h-[18px] rounded-full border border-[#5260FE] flex items-center justify-center mr-3 shrink-0
                                ${selectedReason === index ? 'bg-[#5260FE]/20' : 'border-white/30'}
                            `}
                            style={{ borderColor: selectedReason === index ? '#5260FE' : 'rgba(255,255,255,0.3)' }}
                            >
                                {selectedReason === index && (
                                    <div className="w-[8px] h-[8px] rounded-full bg-[#5260FE]" />
                                )}
                            </div>

                            {/* Text */}
                            <span className="text-white text-[13px] font-medium font-sans truncate">
                                {reason}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Other Input - Conditionally Rendered */}
        {selectedReason === 4 && (
            <div className="mt-4 relative">
                <textarea
                    value={otherReason}
                    onChange={(e) => {
                        if (e.target.value.length <= 200) {
                            setOtherReason(e.target.value);
                        }
                    }}
                    placeholder="Go ahead, break our heart. Tell us how we failed you..."
                    className="w-full h-[120px] bg-[#191919]/30 border border-white/10 rounded-[20px] p-4 text-white text-[13px] font-sans resize-none focus:outline-none focus:border-white/20 placeholder:text-white/20"
                />
                <div className="absolute bottom-4 right-4 text-white/20 text-[10px] font-sans">
                    (max {200 - otherReason.length} chars of heartbreak)
                </div>
            </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="px-5 pb-10 mt-auto flex flex-col gap-3">
        {/* Delete Anyway */}
        <button
            className="w-full h-[48px] relative flex items-center justify-center active:scale-95 transition-transform"
            onClick={handleDelete}
        >
            <img
                src={buttonRemoveCard}
                alt="Delete Anyway"
                className="absolute inset-0 w-full h-full object-fill pointer-events-none"
            />
            <span className="relative z-10 text-white text-[16px] font-semibold font-sans">Delete Anyway</span>
        </button>

        {/* Cancel */}
        <button
            className="w-full h-[48px] relative flex items-center justify-center active:scale-95 transition-transform"
            onClick={handleCancel}
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

export default DeleteAccountReasons;
