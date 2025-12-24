import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, Menu, X } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import savedCardsBg from "@/assets/saved-card-bg.png";
import addIcon from "@/assets/my-cards-add-icon.png";
import BottomNavigation from "@/components/BottomNavigation";
import popupBg from "@/assets/popup-bg.png";
import buttonCloseBg from "@/assets/button-close.png";
import popupCardIcon from "@/assets/popup-card-icon.png";

const MyCards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (location.state?.cardAdded) {
      setShowSuccessModal(true);
      // Clean up state so refresh doesn't trigger it again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom pb-[96px] relative"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Main Content with conditional blur */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${showSuccessModal ? 'blur-sm brightness-50' : ''}`}>
        {/* Header */}
        <div className="px-5 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <button
                onClick={() => navigate(-1)}
                className=""
            >
                <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-foreground text-[20px] font-medium">My Cards</h1>
            </div>
            <button>
            <Menu className="w-6 h-6 text-foreground" />
            </button>
        </div>

        {/* Content */}
        <div className="px-5 mt-8">
            <div
            className="w-full rounded-2xl p-4"
            style={{
                backgroundImage: `url(${savedCardsBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "140px",
            }}
            >
            {/* Top Row: Title + Add Icon */}
            <div className="flex items-center justify-between">
                <h2 className="text-white text-[16px] font-medium">Saved Cards</h2>
                <button
                onClick={() => navigate("/cards/add")}
                className="opacity-100 active:opacity-70 transition-opacity"
                >
                <img src={addIcon} alt="Add" className="w-5 h-5" />
                </button>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-white/10 w-full mt-[15px] mb-[15px]" />

            {/* Subtitle */}
            <p className="text-white/60 text-[14px]">
                You haven’t added any cards yet.
            </p>
            </div>
        </div>
      </div>

      {/* Bottom Navigation (Outside blur container? Usually nav stays sharp or blurs too. Let's blur it too) */}
      <div className={showSuccessModal ? 'blur-sm brightness-50' : ''}>
         <BottomNavigation activeTab="cards" />
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6">
          {/* Backdrop (invisible clickable area to close, though prompt implies close button) */}
          {/* We rely on the blur on the main content to visually separate. */}

          {/* Popup Box with glass background */}
          <div
            className="relative rounded-2xl p-6 max-w-[320px] w-full z-10 flex flex-col items-center text-center border border-white/10"
            style={{
              backgroundImage: `url(${popupBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
             {/* Icon */}
             <img src={popupCardIcon} alt="Card Success" className="w-8 h-8 mb-4 object-contain" />

             {/* Header */}
             <h2 className="text-white text-[18px] font-semibold mb-4">
               Card Added Successfully
             </h2>

             {/* Body Text Container (Black) */}
             <div className="bg-black rounded-xl w-full px-[12px] py-[11px]">
                <p className="text-white text-[14px] leading-relaxed text-left">
                  Your card has been saved successfully. You can now use this card for withdrawals and payments.
                </p>
             </div>
          </div>

          {/* Close Button - Outside the popup */}
          <button
            onClick={() => setShowSuccessModal(false)}
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

export default MyCards;
