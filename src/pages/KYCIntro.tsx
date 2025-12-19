import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import iconKyc from "@/assets/icon-kyc.svg";
import popupBg from "@/assets/popup-bg.png";
import buttonCloseBg from "@/assets/button-close.png";

const KYCIntro = () => {
  const navigate = useNavigate();
  const [showWhyModal, setShowWhyModal] = useState(false);

  const benefits = [
    {
      title: "Higher Wallet Limits",
      description: "Boost your wallet size and daily top-up cap with verified KYC."
    },
    {
      title: "Cash Deposit & Withdrawal",
      description: "Enable secure cash pickups and quick bank withdrawals."
    },
    {
      title: "Secure, Verified Transactions",
      description: "Enjoy safer transactions and faster refunds with verified identity."
    },
    {
      title: "Faster Upgrades & Processing",
      description: "Get quicker top-ups, seamless upgrades, and wallet priority access."
    }
  ];

  return (
    <div 
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: '#0a0a12',
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button 
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">KYC</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-6">
        <p className="text-foreground text-[16px] leading-relaxed mb-6">
          Complete your eKYC to start using Dot.pe with all it's features:
        </p>

        <div className="space-y-5">
          {benefits.map((benefit, index) => (
            <div key={index}>
              <div className="flex items-start gap-2">
                <span className="text-foreground mt-1">•</span>
                <h3 className="text-foreground text-[15px] font-medium">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-[13px] ml-4 mt-1">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-5 pb-8 space-y-4">
        <button 
          onClick={() => navigate('/kyc-form')}
          className="w-full py-4 rounded-full text-foreground font-semibold text-[16px] btn-gradient"
        >
          Start KYC
        </button>
        <button 
          onClick={() => setShowWhyModal(true)}
          className="w-full text-center text-foreground text-[14px] underline underline-offset-2"
        >
          Why is this needed?
        </button>
      </div>

      {/* Why KYC Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-black/40"
            onClick={() => setShowWhyModal(false)}
          />
          
          {/* Popup Box with glass background */}
          <div 
            className="relative rounded-2xl p-6 max-w-[320px] w-full z-10"
            style={{
              backgroundImage: `url(${popupBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="flex flex-col items-center">
              <img src={iconKyc} alt="KYC" className="w-8 h-8 mb-4" />
              <h2 className="text-foreground text-[18px] font-semibold mb-4">
                Know Your Customer
              </h2>
              <div className="bg-[#0a0a12]/80 rounded-xl p-4">
                <p className="text-foreground text-[14px] leading-relaxed">
                  In accordance with the Reserve Bank of India (RBI) regulations, completion of eKYC is mandatory to enable wallet functionalities such as fund transfers, cash withdrawals, and account upgrades. This ensures compliance, enhances security, and enables uninterrupted access to regulated financial services.
                </p>
              </div>
            </div>
          </div>
          
          {/* Close Button - Outside the popup */}
          <button 
            onClick={() => setShowWhyModal(false)}
            className="relative z-10 mt-6 px-8 py-3 rounded-full flex items-center justify-center gap-2"
            style={{
              backgroundImage: `url(${buttonCloseBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <X className="w-4 h-4 text-foreground" />
            <span className="text-foreground text-[14px]">Close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default KYCIntro;
