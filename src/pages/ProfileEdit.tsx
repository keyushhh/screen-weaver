import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useState, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import avatarImg from "@/assets/avatar.png";
import verifiedIcon from "@/assets/verified-icon.png";
import inputFieldBg from "@/assets/input-field-bg.png";
import buttonCancel from "@/assets/button-cancel.png";
import dotPeLogo from "@/assets/dot-pe-logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { phoneNumber, name: contextName, profileImage: contextImage, setName: setContextName, setProfileImage: setContextProfileImage } = useUser();
  const [name, setName] = useState(contextName || "");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(contextImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setContextName(name);
    setContextProfileImage(profileImage);
    toast.success("Profile updated successfully");
    navigate(-1);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="min-h-[100dvh] h-full flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between shrink-0">
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
      <div className="px-5 mt-8">
        {/* Profile Photo Section */}
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4 border border-white/10 h-[101px]">
            <img
              src={profileImage || avatarImg}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
              style={{
                border: '4px solid rgba(255, 255, 255, 0.17)'
              }}
            />
            <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button
                  onClick={triggerFileInput}
                  className="px-4 h-[32px] flex items-center justify-center rounded-full text-[14px] text-foreground mb-2"
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
        <div className="mt-8">
            <p className="mb-[10px] text-muted-foreground text-[14px] font-bold tracking-wider">
                PERSONAL INFORMATION
            </p>

            {/* Name Input */}
            <Input
                placeholder="What should we call you?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[48px] rounded-full text-white placeholder:text-muted-foreground/60 px-6 border-none text-[14px]"
                style={{
                    backgroundImage: `url(${inputFieldBg})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent'
                }}
            />

            {/* Phone Number (Read Only) */}
            <div className="space-y-2 mt-[21px]">
                <div
                    className="w-full h-[48px] rounded-full flex items-center px-6 justify-between border-none"
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
                className="w-full h-[48px] rounded-full text-white placeholder:text-muted-foreground/60 px-6 border-none text-[14px] mt-[32px]"
                 style={{
                    backgroundImage: `url(${inputFieldBg})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent'
                }}
            />

            {/* CTA Buttons - Pushed up by 50px (115 - 50 = 65px) */}
            <Button
                onClick={handleSave}
                className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white border-none mt-[65px]"
            >
                Save My Identity
            </Button>
            <button
                onClick={() => navigate(-1)}
                className="w-full h-[48px] rounded-full text-[16px] font-medium text-white flex items-center justify-center transition-transform active:scale-95 mt-[14px]"
                style={{
                    backgroundImage: `url(${buttonCancel})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                Cancel
            </button>

            {/* Footer Info - Pushed up by 20px (34 - 20 = 14px) */}
            <div className="mt-[14px] pb-10 opacity-40 flex flex-col items-start">
                <img src={dotPeLogo} className="h-8 mb-1" />
                <p className="font-grotesk font-medium text-[14px] text-left">
                    App Version v1.0.0 — 100% drama compatible.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
