import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import avatarImg from "@/assets/avatar.png";
import verifiedIcon from "@/assets/verified-icon.png";
import inputFieldBg from "@/assets/input-field-bg.png";
import buttonCancel from "@/assets/button-cancel.png";
import dotPeLogo from "@/assets/dot-pe-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { phoneNumber } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
      <div className="px-5 pt-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">Profile</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 mt-8 overflow-y-auto no-scrollbar">
        {/* Profile Photo Section */}
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10">
            <img
              src={avatarImg}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
              style={{
                border: '4px solid rgba(255, 255, 255, 0.17)'
              }}
            />
            <div className="flex-1">
                <button
                  className="px-4 py-2 rounded-full text-[14px] text-foreground mb-2"
                  style={{
                    backgroundImage: 'url("/lovable-uploads/881be237-04b4-4be4-b639-b56090b04ed5.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                    Upload Photo
                </button>
                <p className="text-muted-foreground text-[12px] leading-tight">
                    Tap to add your beautiful mugshot. Or cat. We’re not picky.
                </p>
            </div>
        </div>

        {/* Personal Information */}
        <div className="mt-8 space-y-6">
            <p className="mb-3.5 text-muted-foreground text-[14px] font-bold tracking-wider">
                PERSONAL INFORMATION
            </p>

            {/* Name Input */}
            <Input
                placeholder="What should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[54px] rounded-full text-white placeholder:text-muted-foreground/60 px-6 border-none text-[14px]"
                style={{
                    backgroundImage: `url(${inputFieldBg})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent'
                }}
            />

            {/* Phone Number (Read Only) */}
            <div className="space-y-2">
                <div
                    className="w-full h-[54px] rounded-full flex items-center px-6 justify-between border-none"
                    style={{
                        backgroundImage: `url(${inputFieldBg})`,
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: 'transparent'
                    }}
                >
                    <div className="flex items-center gap-4 flex-1">
                        <span className="text-muted-foreground text-[14px]">+91</span>
                        <div className="h-4 w-px bg-white/10"></div>
                        <span className="text-muted-foreground text-[14px] tracking-wide">
                            {phoneNumber?.replace('+91', '').replace(/\s/g, '') || '9898989898'}
                        </span>
                    </div>
                    <img src={verifiedIcon} alt="Verified" className="w-5 h-5 object-contain" />
                </div>
                <p className="text-[#5B5B5B] text-[14px] font-normal px-4">
                    This is how we know it's you. Or your evil twin.
                </p>
            </div>

            {/* Email Input */}
            <Input
                placeholder="Drop your email, the real one."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[54px] rounded-full text-white placeholder:text-muted-foreground/60 px-6 border-none text-[14px]"
                 style={{
                    backgroundImage: `url(${inputFieldBg})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent'
                }}
            />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="px-5 pb-8 pt-4 mt-auto space-y-3 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12] to-transparent">
        <Button
            className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white border-none"
        >
            Save My Identity
        </Button>
        <button
            onClick={() => navigate(-1)}
            className="w-full h-[48px] rounded-full text-[16px] font-medium text-white flex items-center justify-center transition-transform active:scale-95"
            style={{
                backgroundImage: `url(${buttonCancel})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat'
            }}
        >
            Cancel
        </button>

        {/* Footer Info */}
        <div className="px-5 mt-14 pb-10 opacity-40 flex flex-col items-center">
            <img src={dotPeLogo} className="h-8 mb-1" />
            <p className="font-grotesk font-medium text-[14px] text-center">
                App Version v1.0.0 — 100% drama compatible.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
