import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import stepsBg from "@/assets/kyc-steps-bg.png";
import flashIcon from "@/assets/flash.png";
import shutterIcon from "@/assets/shutter.png";
import thumbnailBg from "@/assets/thumbnail-bg.png";
import { Button } from "@/components/ui/button";

const KYCSelfie = () => {
  const navigate = useNavigate();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // Ref for the video element (even if we simulate, good to have structure)
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    // In a real app, we would request camera access here
  };

  const handleCapture = () => {
    // Simulate capture
    // In a real app, we would draw video frame to canvas
    // For now, we'll just use a placeholder color/data URI
    const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTI2MEZFIi8+PC9zdmc+";
    setCapturedImage(placeholderImage);
    setIsCameraOpen(false);
  };

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">KYC</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 px-5 pt-4 flex flex-col">
        {/* Steps Indicator */}
        <div
          className="w-full h-[88px] rounded-[20px] p-5 mb-8 relative overflow-hidden shrink-0"
          style={{
            backgroundImage: `url(${stepsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-[14px] font-medium">Step 3/4</span>
            <span className="text-white text-[14px] font-medium">Verify Your Identity</span>
          </div>
          <div className="w-full h-[6px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-[75%] bg-[#5260FE] rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-white text-[18px] font-semibold mb-4">Verify your identity</h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-white/60 mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              <p className="text-white/60 text-[14px]">Take a clear selfie</p>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-white/60 mt-1.5 w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              <p className="text-white/60 text-[14px]">Match against uploaded document</p>
            </li>
          </ul>
        </div>

        {/* Action Area */}
        <div className="mt-4">
          {!capturedImage ? (
            <Button
              variant="default"
              className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white"
              onClick={handleOpenCamera}
            >
              Open Camera
            </Button>
          ) : (
            <div
              className="w-full h-[96px] rounded-[16px] p-4 flex items-center gap-4 border border-white/5"
              style={{
                backgroundImage: `url(${thumbnailBg})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            >
               <div className="w-[82px] h-[69px] rounded-[12px] overflow-hidden bg-black flex-shrink-0">
                  <img src={capturedImage} alt="Selfie" className="w-full h-full object-cover" />
               </div>
               <p className="text-white text-[12px] font-normal leading-tight">
                 You didn’t have to snap this hard, but we appreciate it.
               </p>
            </div>
          )}
        </div>
      </div>

       {/* Footer - Continue Button (only when captured) */}
       {capturedImage && (
        <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-[#0a0a12] to-transparent">
          <Button
            variant="default"
            className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white"
            onClick={() => {
                // Navigate to next step or complete
                console.log("Continue to Step 4");
            }}
          >
            Continue
          </Button>
        </div>
      )}

      {/* Camera Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          {/* Camera Header */}
          <div className="flex items-center px-5 pt-4 pb-2 absolute top-0 left-0 right-0 z-10 safe-area-top">
            <button
              onClick={() => setIsCameraOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            {/* Blue dot/camera indicator simulation */}
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
          </div>

          {/* Camera Viewport Simulation */}
          <div className="flex-1 relative bg-black flex flex-col items-center justify-center">
              {/* Frame Corners SVG */}
              <div className="relative w-[85%] aspect-square max-w-[360px]">
                <svg className="w-full h-full absolute inset-0 text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    {/* Top Left */}
                    <path d="M25 2H10C5.58172 2 2 5.58172 2 10V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    {/* Top Right */}
                    <path d="M75 2H90C94.4183 2 98 5.58172 98 10V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    {/* Bottom Left */}
                    <path d="M25 98H10C5.58172 98 2 94.4183 2 90V75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    {/* Bottom Right */}
                    <path d="M75 98H90C94.4183 98 98 94.4183 98 90V75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Text Instructions */}
              <div className="mt-12 flex flex-col items-center gap-4">
                  <p className="text-white text-[20px] font-normal font-sans">Align your face within the frame</p>

                  <div className="w-[256px] h-[34px] bg-[#090909] rounded-full flex items-center justify-center border border-white/5">
                      <span className="text-white/80 text-[12px] font-normal">Avoid sunglasses, hats, or masks.</span>
                  </div>
              </div>
          </div>

          {/* Camera Controls */}
          <div className="h-[120px] pb-8 flex items-center justify-center relative bg-black px-8">
              {/* Shutter Button */}
              <button
                onClick={handleCapture}
                className="w-20 h-20 rounded-full flex items-center justify-center transition-transform active:scale-95"
              >
                  <img src={shutterIcon} alt="Capture" className="w-full h-full object-contain" />
              </button>

              {/* Flash Button */}
              <button className="absolute right-12 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center">
                  <img src={flashIcon} alt="Flash" className="w-full h-full object-contain" />
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCSelfie;
