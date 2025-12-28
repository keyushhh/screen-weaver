import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import autoFetchBg from "@/assets/auto-fetch.png";
import manualEntryBg from "@/assets/manual-entry.png";
import radioFilled from "@/assets/radio-filled.png";
import radioEmpty from "@/assets/radio-empty.png";
import recommendedBadge from "@/assets/recommended.png";
import inputFieldBg from "@/assets/input-field-bg.png";
import buttonPrimaryWide from "@/assets/button-primary-wide.png";

type Selection = "auto" | "manual";

const AddBank = () => {
  const navigate = useNavigate();
  const [selection, setSelection] = useState<Selection>("auto");
  const [mobile, setMobile] = useState("");

  return (
    <div
      className="min-h-[100dvh] flex flex-col relative safe-area-top safe-area-bottom overflow-hidden"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between shrink-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">Banking</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 mt-8 overflow-y-auto scrollbar-hide pb-32">
        <p className="text-white text-[16px] font-medium leading-relaxed mb-8">
          Whether you like shortcuts or full control —
          <br />
          we’ve got you.
        </p>

        {/* Options */}
        <div className="space-y-4">
          {/* Auto Fetch */}
          <div
            className={`relative rounded-2xl p-5 border transition-all duration-200 overflow-hidden ${
              selection === "auto"
                ? "border-white/20 bg-white/5"
                : "border-white/10 bg-black/20"
            }`}
            onClick={() => setSelection("auto")}
          >
            {/* Background Asset */}
            <div
              className="absolute inset-0 z-0 opacity-100"
              style={{
                backgroundImage: `url(${autoFetchBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex items-start gap-4">
              <img
                src={selection === "auto" ? radioFilled : radioEmpty}
                alt="radio"
                className="w-5 h-5 mt-0.5 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white text-[15px] font-medium">
                    Auto-fetch bank accounts
                  </span>
                  <img
                    src={recommendedBadge}
                    alt="Recommended"
                    className="h-[22px] w-auto"
                  />
                </div>
                <p className="text-white/60 text-[13px] leading-relaxed">
                  Let Anumati do the digging. We’ll fetch your linked
                  <br />
                  accounts in a snap.
                  <br />
                  Safe, fast, and totally RBI-approved.
                </p>
              </div>
            </div>
          </div>

          {/* Manual Entry */}
          <div
            className={`relative rounded-2xl p-5 border transition-all duration-200 overflow-hidden flex items-center ${
              selection === "manual"
                ? "border-white/20 bg-white/5"
                : "border-white/10 bg-black/20"
            }`}
            onClick={() => setSelection("manual")}
            style={{ height: "64px" }}
          >
            {/* Background Asset */}
            <div
              className="absolute inset-0 z-0 opacity-100"
              style={{
                backgroundImage: `url(${manualEntryBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* Content Layer */}
            <div className="relative z-10 flex items-center gap-4 w-full">
              <img
                src={selection === "manual" ? radioFilled : radioEmpty}
                alt="radio"
                className="w-5 h-5 shrink-0"
              />
              <span className="text-white text-[15px] font-medium">
                Add bank account manually
              </span>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mt-10">
          <label className="text-white text-[15px] font-medium font-sans mb-4 block">
            Bank-registered mobile number
          </label>
          <div className="relative w-full h-[48px]">
            {/* Input Background */}
            <img
              src={inputFieldBg}
              alt="Input Bg"
              className="absolute inset-0 w-full h-full object-fill rounded-full pointer-events-none"
            />

            {/* Input Content */}
            <div className="absolute inset-0 flex items-center px-6">
              <span className="text-white text-[14px] font-medium mr-4">
                + 91
              </span>
              <div className="w-[1px] h-4 bg-white/20 mr-4" />
              <input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, ""); // numeric only
                  if (val.length <= 10) setMobile(val);
                }}
                placeholder="Enter your mobile number"
                className="bg-transparent border-none outline-none text-white placeholder-white/40 text-[14px] font-medium w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-0 w-full px-5 flex justify-center z-20">
        <button
          className="relative w-[362px] h-[48px] flex items-center justify-center transition-transform active:scale-95"
          onClick={() => {}} // No-op
        >
          <img
            src={buttonPrimaryWide}
            alt="Request OTP"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
          <span className="relative z-10 text-white text-[15px] font-medium">
            Request OTP
          </span>
        </button>
      </div>
    </div>
  );
};

export default AddBank;
