import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import cameraFrame from "@/assets/camera-frame.png";
import shutterIcon from "@/assets/shutter.png";
import flashIcon from "@/assets/flash.png";

const CardScan = () => {
  const navigate = useNavigate();
  // Simulate camera active state - in a real app this would toggle video stream
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate capture delay
    setTimeout(() => {
      // Navigate back to Add Card with success state or just return
      // We pass state to let the previous screen know a scan happened (optional usage)
      navigate("/cards/add", { state: { scanned: true } });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 absolute top-0 left-0 right-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        {/* Blue dot/camera indicator simulation */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>

        {/* Empty div for balance if needed, or close button */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center"
        >
           {/* Placeholder for symmetry or secondary action */}
        </button>
      </div>

      {/* Camera Viewport Simulation */}
      <div className="flex-1 relative bg-black flex flex-col items-center justify-center">
          {/* Live Preview Placeholder (Gray/Black background) */}
          <div className="absolute inset-0 bg-[#1a1a1a] z-0">
             {/* In a real app, <video> would be here */}
          </div>

          {/* Overlay Frame */}
          <div className="relative z-10 w-full px-4 flex flex-col items-center justify-center">
            {/* The Camera Frame Asset */}
            <div className="relative w-full max-w-[340px] aspect-[1.58] mb-8">
               <img src={cameraFrame} alt="Align Card" className="w-full h-full object-contain" />
            </div>

            {/* Text Instructions */}
            <p className="text-white text-[16px] font-medium font-sans text-center">
              Position your card within the frame
            </p>
          </div>
      </div>

      {/* Camera Controls */}
      <div className="h-[120px] pb-8 flex items-center justify-center relative bg-black px-8 z-20">
          {/* Shutter Button */}
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform ${isCapturing ? 'scale-90 opacity-80' : 'active:scale-95'}`}
          >
              <img src={shutterIcon} alt="Capture" className="w-full h-full object-contain" />
          </button>

          {/* Flash Button */}
          <div className="absolute inset-0 flex items-center justify-end px-12 pointer-events-none">
              <button className="w-8 h-8 flex items-center justify-center pointer-events-auto">
                  <img src={flashIcon} alt="Flash" className="w-full h-full object-contain opacity-50 hover:opacity-100" />
              </button>
          </div>
      </div>
    </div>
  );
};

export default CardScan;
