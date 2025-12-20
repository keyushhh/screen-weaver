import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import stepsBg from "@/assets/kyc-steps-bg.png";
import iconAadhar from "@/assets/icon-aadhar.png";
// Using aadhar icon as a placeholder for the document thumbnail
import avatar from "@/assets/avatar.png";
// Using avatar or similar for selfie placeholder if specific one not available,
// or I can use the 'icon-gallery-placeholder.png' or just a colored div.
// The screenshot shows a photo of a woman. I'll use a placeholder or the avatar if suitable.

const KYCReview = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  // Mock data to match screenshot
  const kycData = {
    documentType: "Aadhar Card",
    documentNumber: "1234 XXXX 3242",
    fullName: "Rohit Khandelwal",
    dob: "13 May 2025",
    // In a real app, these would be real URLs
  };

  const handleSubmit = () => {
    // Submit logic here
    console.log("Submitting KYC data...");
    // navigate to success or home
    navigate("/home");
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
        <div className="w-10" />
      </div>

      <div id="scroll-container" className="flex-1 px-5 pt-4 flex flex-col overflow-y-auto">
        {/* Steps Indicator */}
        <div
          className="w-full h-[88px] rounded-[20px] p-5 mb-6 relative overflow-hidden shrink-0"
          style={{
            backgroundImage: `url(${stepsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-white text-[14px] font-medium">Step 4/4</span>
            <span className="text-white text-[14px] font-medium">Review</span>
          </div>
          <div className="w-full h-[6px] bg-white/20 rounded-full overflow-hidden">
            <div className="h-full w-full bg-[#5260FE] rounded-full" />
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <h2 className="text-white text-[18px] font-semibold mb-2">Review & Submit</h2>
          <p className="text-white/60 text-[14px] leading-relaxed">
            Please review your uploaded details and documents before submitting.
            Ensure all information is correct and clearly visible.
          </p>
        </div>

        {/* Details Card */}
        <div className="w-full rounded-[24px] border border-white/10 bg-white/5 p-5">
          <h3 className="text-white text-[16px] font-semibold mb-1">Your KYC Details</h3>
          <p className="text-white/40 text-[12px] mb-6">Please check all the documents before submitting</p>

          <div className="space-y-6">
            {/* ID Document Row */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/40 text-[12px] mb-1">ID Document</p>
                <p className="text-white text-[14px] font-medium">{kycData.documentType} ending 3242</p>
              </div>
              <div className="flex gap-2">
                {/* Mock Thumbnails for Front & Back */}
                <div className="w-[42px] h-[32px] rounded-[4px] bg-white/10 overflow-hidden border border-white/20 flex items-center justify-center">
                    <img src={iconAadhar} alt="Front" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="w-[42px] h-[32px] rounded-[4px] bg-white/10 overflow-hidden border border-white/20 flex items-center justify-center">
                    <img src={iconAadhar} alt="Back" className="w-full h-full object-cover opacity-80" />
                </div>
              </div>
            </div>

            {/* ID Number */}
            <div>
              <p className="text-white/40 text-[12px] mb-1">ID Number</p>
              <p className="text-white text-[14px] font-medium">{kycData.documentNumber}</p>
            </div>

            {/* Full Name */}
            <div>
              <p className="text-white/40 text-[12px] mb-1">Full Name</p>
              <p className="text-white text-[14px] font-medium">{kycData.fullName}</p>
            </div>

            {/* Date of Birth */}
            <div>
              <p className="text-white/40 text-[12px] mb-1">Date of Birth</p>
              <p className="text-white text-[14px] font-medium">{kycData.dob}</p>
            </div>

            {/* Selfie Verification */}
            <div className="flex justify-between items-center border-t border-white/10 pt-4">
              <div>
                 <p className="text-white/40 text-[12px] mb-1">Selfie Verification</p>
                 <p className="text-white text-[14px] font-medium">Selfie Verified</p>
              </div>
              {/* Selfie Thumbnail */}
              <div className="w-[42px] h-[42px] rounded-[8px] bg-white/10 overflow-hidden border border-white/20">
                 {/* Using avatar as mock for selfie */}
                 <img src={avatar} alt="Selfie" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-64 shrink-0" />
      </div>

      {/* Footer Area */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12] to-transparent z-20">
        <div className="flex items-start gap-3 mb-6">
            <Checkbox
                id="terms"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="mt-1 border-white/40 data-[state=checked]:bg-[#5260FE] data-[state=checked]:border-[#5260FE]"
            />
            <label
                htmlFor="terms"
                className="text-white/60 text-[13px] leading-tight cursor-pointer"
            >
                I agree, all information provided are correct and accurate to best of my knowledge.
            </label>
        </div>

        <Button
          variant="default"
          className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!agreed}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default KYCReview;
