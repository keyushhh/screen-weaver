import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import stepsBg from "@/assets/kyc-steps-bg.png";
import iconFlash from "@/assets/icon-flash.png";
import iconGallery from "@/assets/icon-gallery.png";
import iconPlaceholder from "@/assets/icon-gallery-placeholder.png";
import inputFieldBg from "@/assets/input-field-bg.png";
import pendingStatusIcon from "@/assets/pending-status.png";
import thumbnailsBg from "@/assets/thumbnails-bg.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { GlassCalendar } from "@/components/GlassCalendar";

const KYCUpload = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(false);

  // State for camera/images
  const [flashOn, setFlashOn] = useState(false);
  const [images, setImages] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });

  // Reference for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle Flash
  const toggleFlash = () => {
    setFlashOn(!flashOn);
    // In a real native implementation, this would call a capacitor plugin
    console.log("Flash toggled:", !flashOn);
  };

  // Handle Gallery Selection
  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simple logic: first upload fills 'front', second fills 'back'
        if (!images.front) {
          setImages(prev => ({ ...prev, front: reader.result as string }));
        } else if (!images.back) {
           setImages(prev => ({ ...prev, back: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again if needed
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleClearAll = () => {
    setImages({ front: null, back: null });
  };

  return (
    <div
      className="h-[100dvh] w-full flex flex-col safe-area-top safe-area-bottom overflow-hidden"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex-none flex items-center justify-between px-5 pt-4 pb-2 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">KYC</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32 no-scrollbar">
        {/* Steps Indicator */}
        <div
          className="w-full h-[88px] rounded-[20px] p-5 mb-6 relative overflow-hidden flex-none"
          style={{
            backgroundImage: `url(${stepsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-[14px] font-medium">Step 2/4</span>
            <span className="text-white text-[14px] font-medium">Upload & Verify</span>
          </div>
          <div className="w-full h-[6px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-[50%] bg-[#5260FE] rounded-full" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-4 flex-none">
          <h2 className="text-white text-[18px] font-semibold mb-1">Upload Document</h2>
          <p className="text-muted-foreground text-[14px]">
            Position your ID clearly within the frame.
          </p>
        </div>

        {/* Camera Area Container */}
        <div className="flex flex-col items-center mb-6">
            {/* Camera Box */}
            <div className="w-[362px] h-[184px] bg-black rounded-[24px] flex flex-col items-center justify-center relative overflow-hidden mb-4">
                {/* Simulated Camera View */}
            </div>

            {/* Label Pill */}
            <div className="w-[111px] h-[31px] bg-black rounded-full flex items-center justify-center mb-4">
                <p className="text-white text-[12px] font-medium">Upload front side</p>
            </div>

            {/* Controls - Moved outside and below */}
            <div className="flex items-center gap-4 z-20">
                <button
                    onClick={toggleFlash}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${flashOn ? 'bg-white/20' : ''}`}
                >
                <img src={iconFlash} alt="Flash" className="w-10 h-10" />
                </button>
                <button
                    onClick={handleGalleryClick}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95"
                >
                <img src={iconGallery} alt="Gallery" className="w-10 h-10" />
                </button>
            </div>
        </div>

        {/* Thumbnails Section */}
        <div
          className="mb-6 rounded-[16px] p-4"
          style={{
            backgroundImage: `url(${thumbnailsBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
            <div className="flex justify-between items-center">
                <div className="flex gap-4">
                    {/* Front Side */}
                    <div className="w-[100px] h-[80px] rounded-[12px] border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 overflow-hidden relative">
                        {images.front ? (
                            <img src={images.front} alt="Front" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <img src={iconPlaceholder} alt="" className="w-6 h-6 opacity-50" />
                                <span className="text-white/60 text-[10px]">Front side</span>
                            </>
                        )}
                    </div>
                     {/* Back Side */}
                    <div className="w-[100px] h-[80px] rounded-[12px] border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-2 overflow-hidden relative">
                        {images.back ? (
                            <img src={images.back} alt="Back" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <img src={iconPlaceholder} alt="" className="w-6 h-6 opacity-50" />
                                <span className="text-white/60 text-[10px]">Back side</span>
                            </>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleClearAll}
                    disabled={!images.front && !images.back}
                    className={`text-[12px] underline underline-offset-2 transition-colors ${(!images.front && !images.back) ? 'text-gray-500 cursor-not-allowed' : 'text-red-500 hover:text-red-400'}`}
                >
                    Clear All
                </button>
            </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-8">
            <Input
                placeholder="Document Number"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-[363px] h-[48px] rounded-[100px] border-none text-white placeholder:text-muted-foreground/60 px-6 mx-auto block"
                style={{
                    backgroundImage: `url(${inputFieldBg})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent'
                }}
            />
            <Input
                placeholder="Full Name as per Document"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-[363px] h-[48px] rounded-[100px] border-none text-white placeholder:text-muted-foreground/60 px-6 mx-auto block"
                style={{
                    backgroundImage: `url(${inputFieldBg})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: 'transparent'
                }}
            />
            {/* Date of Birth with Calendar */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-[363px] h-[48px] rounded-[100px] border-none text-left px-6 mx-auto flex items-center justify-between"
                style={{
                  backgroundImage: `url(${inputFieldBg})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundColor: 'transparent'
                }}
              >
                <span className={dob ? "text-white" : "text-muted-foreground/60"}>
                  {dob ? format(dob, "dd/MM/yyyy") : "Date of Birth"}
                </span>
                <CalendarIcon className="w-5 h-5 text-muted-foreground/60" />
              </button>
              
              {showCalendar && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50">
                  <GlassCalendar
                    selected={dob}
                    onSelect={(date) => {
                      setDob(date);
                      setShowCalendar(false);
                    }}
                    onClose={() => setShowCalendar(false)}
                  />
                </div>
              )}
            </div>
        </div>

        {/* OTP Section */}
        <div className="space-y-4">
            <p className="text-muted-foreground text-[14px]">
                An OTP has been sent to your registered mobile number.
            </p>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="w-full justify-between gap-2">
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-[52px] h-[68px] rounded-[7px] border border-white/10 bg-white/5 text-xl font-semibold text-white"
                    />
                  ))}
                </InputOTPGroup>
            </InputOTP>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={pendingStatusIcon} alt="Pending" className="w-5 h-5 object-contain" />
                    <span className="text-white/80 text-[12px]">Awaiting OTP verification</span>
                </div>
                <button className="text-muted-foreground text-[12px] hover:text-white">
                    Didn't receive OTP?
                </button>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-[#0a0a12] to-transparent z-20">
        <Button
          variant="gradient"
          className="w-full h-[48px] rounded-full text-[16px] font-medium"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default KYCUpload;
