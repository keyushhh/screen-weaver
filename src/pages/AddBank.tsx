import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import autoFetchBg from "@/assets/auto-fetch.png";
import manualEntryBg from "@/assets/manual-entry.png";
import radioFilled from "@/assets/radio-filled.png";
import radioEmpty from "@/assets/radio-empty.png";
import recommendedBadge from "@/assets/recommended.png";
import { Button } from "@/components/ui/button";
import { PhoneInput } from "@/components/PhoneInput";

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
            className={`relative rounded-2xl p-[12px] border transition-all duration-200 overflow-hidden ${
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
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <img
                    src={selection === "auto" ? radioFilled : radioEmpty}
                    alt="radio"
                    className="w-5 h-5 shrink-0"
                  />
                  <span className="text-white text-[15px] font-medium">
                    Auto-fetch bank accounts
                  </span>
                </div>
                {/* Recommended Badge */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '109px',
                    height: '25px',
                    backgroundImage: `url(${recommendedBadge})`,
                    backgroundSize: 'cover'
                  }}
                >
                  <span className="text-white text-[12px] font-medium mb-[1px]">Recommended</span>
                </div>
              </div>

              {/* Description */}
              <div className="pl-9">
                <p className="text-white/60 text-[13px] leading-relaxed">
                  Let Anumati do the digging. We’ll fetch your linked<br />
                  accounts in a snap.<br />
                  Safe, fast, and totally RBI-approved.
                </p>
              </div>
            </div>
          </div>

          {/* Manual Entry */}
          <div
            className={`relative rounded-2xl p-[12px] border transition-all duration-200 overflow-hidden flex items-center ${
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
          <PhoneInput
            value={mobile}
            onChange={setMobile}
            countryCode="+91"
            placeholder="Enter your mobile number"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 left-0 w-full px-5 flex justify-center z-20">
        <Button
          variant="gradient"
          className="w-full h-[48px] rounded-full text-[18px] font-medium"
          onClick={() => {}} // No-op
        >
          Request OTP
        </Button>
      </div>
    </div>
  );
};

export default AddBank;
