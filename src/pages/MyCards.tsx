import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Eye, EyeOff } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import savedCardsBg from "@/assets/saved-card-bg.png";
import addIcon from "@/assets/my-cards-add-icon.png";
import BottomNavigation from "@/components/BottomNavigation";
import popupBg from "@/assets/popup-bg.png";
import buttonCloseBg from "@/assets/button-close.png";
import popupCardIcon from "@/assets/popup-card-icon.png";
import fabPlus from "@/assets/fab-plus.png";
import chipIcon from "@/assets/card-chip.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import visaLogo from "@/assets/visa-logo.png";
import rupayLogo from "@/assets/rupay-logo.png";
import { getCards, Card } from "@/utils/cardUtils";

// Import all saved card backgrounds
import savedCard1 from "@/assets/saved-card-1.png";
import savedCard2 from "@/assets/saved-card-2.png";
import savedCard3 from "@/assets/saved-card-3.png";
import savedCard4 from "@/assets/saved-card-4.png";
import savedCard5 from "@/assets/saved-card-5.png";
import savedCard6 from "@/assets/saved-card-6.png";

const cardBackgrounds = [savedCard1, savedCard2, savedCard3, savedCard4, savedCard5, savedCard6];

const MyCards = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [isFabExpanded, setIsFabExpanded] = useState(false);

  // Track visibility per card
  const [visibleCardIds, setVisibleCardIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load cards on mount
    setCards(getCards());

    if (location.state?.cardAdded) {
      // Reload cards to get the new one
      setCards(getCards());
      setShowSuccessModal(true);
      // Clean up state so refresh doesn't trigger it again
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleFabClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFabExpanded) {
      navigate("/cards/add");
    } else {
      setIsFabExpanded(true);
    }
  };

  // Click outside to collapse FAB
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest("#fab-container") && isFabExpanded) {
            setIsFabExpanded(false);
        }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isFabExpanded]);

  const toggleCardVisibility = (id: string) => {
    setVisibleCardIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatCardNumber = (num: string) => {
    if (!num) return "";
    const chunks = num.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  const getMaskedCardNumber = (num: string) => {
    if (!num) return "";
    const last4 = num.slice(-4);
    return `**** **** **** ${last4}`;
  };

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
        {/* Header - Back Button Removed */}
        <div className="px-5 pt-4 flex items-center justify-between">
            <h1 className="text-foreground text-[20px] font-medium">My Cards</h1>
            <button>
                <Menu className="w-6 h-6 text-foreground" />
            </button>
        </div>

        {/* Content */}
        <div className="px-5 mt-8 flex-1 overflow-y-auto pb-24"> {/* Added pb-24 for FAB space */}

            {cards.length === 0 ? (
                /* Empty State */
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
            ) : (
                /* List View */
                <div className="flex flex-col gap-4">
                    {cards.map((card) => {
                        const bgSrc = cardBackgrounds[(card.backgroundIndex - 1) % 6];
                        const isDefault = card.isDefault;
                        const isVisible = visibleCardIds[card.id] || false;

                        // Layout Shifts for Default Card
                        // Chip moves down 10px relative to the Default tag (24px height) -> 24 + 10 = 34px
                        const chipTop = isDefault ? 34 : 21;
                        const nameTop = isDefault ? 42 : 26; // 26 + 16
                        const labelTop = isDefault ? 86 : 70; // 70 + 16
                        const numberTop = isDefault ? 109 : 93; // 93 + 16
                        const expiryTop = isDefault ? 145 : 129; // 129 + 16

                        // Default cards are taller (212px) to accommodate the banner, so standard bottom padding (26px) applies
                        const logoBottom = 26;
                        const cardHeight = isDefault ? "212px" : "192px";

                        return (
                            <div
                                key={card.id}
                                className="relative w-full rounded-[16px] overflow-hidden shrink-0"
                                style={{
                                    height: cardHeight,
                                    backgroundImage: `url(${bgSrc})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {/* Default Tag - Full Width Banner */}
                                {isDefault && (
                                    <div
                                        className="absolute top-0 left-0 w-full h-[24px] flex items-center justify-center z-10"
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.64)',
                                        }}
                                    >
                                        <span className="text-white text-[10px] font-medium uppercase tracking-wider">DEFAULT</span>
                                    </div>
                                )}

                                <div className="relative w-full h-full px-[26px]">
                                    {/* Top Row: Chip */}
                                    <div
                                        className="absolute right-[26px] w-[40px] h-[30px] flex justify-end transition-all"
                                        style={{ top: `${chipTop}px` }}
                                    >
                                        <img src={chipIcon} alt="Chip" className="h-[28px] object-contain" />
                                    </div>

                                    {/* Cardholder Name */}
                                    <div
                                        className="absolute left-[26px] right-[70px] transition-all"
                                        style={{ top: `${nameTop}px` }}
                                    >
                                        <p className="text-white text-[16px] font-medium uppercase font-satoshi truncate">
                                            {card.holder || "NO NAME"}
                                        </p>
                                    </div>

                                    {/* Card Number Label */}
                                    <div
                                        className="absolute left-[26px] transition-all"
                                        style={{ top: `${labelTop}px` }}
                                    >
                                        <p className="text-[#C4C4C4] text-[13px] font-normal font-satoshi">Card Number</p>
                                    </div>

                                    {/* Card Number Value + Eye Icon */}
                                    <div
                                        className="absolute left-[26px] right-[26px] flex items-center justify-between transition-all"
                                        style={{ top: `${numberTop}px` }}
                                    >
                                         <div className="relative flex-1 mr-4">
                                            {isVisible ? (
                                                 <p className="text-white text-[20px] font-bold font-satoshi tracking-widest h-[24px]">
                                                     {formatCardNumber(card.number)}
                                                 </p>
                                            ) : (
                                                 <p className="text-white text-[20px] font-bold font-satoshi tracking-widest h-[24px]">
                                                     {getMaskedCardNumber(card.number)}
                                                 </p>
                                            )}
                                         </div>

                                         {/* Eye Icon */}
                                        <button
                                            type="button"
                                            onClick={() => toggleCardVisibility(card.id)}
                                            className="text-white shrink-0 z-20"
                                        >
                                            {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </button>
                                    </div>

                                    {/* Expiry & CVV Row */}
                                    <div
                                        className="absolute left-[26px] flex gap-8 transition-all"
                                        style={{ top: `${expiryTop}px` }}
                                    >
                                        {/* Expiry Group */}
                                        <div className="flex flex-col gap-[5px]">
                                            <label className="text-[#C4C4C4] text-[14px] font-normal font-satoshi leading-none">Expiry Date</label>
                                            <p className="text-white text-[13px] font-bold font-satoshi leading-none">
                                                **/**
                                            </p>
                                        </div>

                                        {/* CVV Group */}
                                        <div className="flex flex-col gap-[5px]">
                                            <label className="text-[#C4C4C4] text-[14px] font-normal font-satoshi leading-none">CVV</label>
                                            <p className="text-white text-[14px] font-bold font-satoshi leading-none">
                                                {isVisible ? (card.cvv || "123") : "***"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Network Logo */}
                                    <div
                                        className="absolute right-[26px] h-[24px] transition-all"
                                        style={{ bottom: `${logoBottom}px` }}
                                    >
                                        {card.type === "visa" && <img src={visaLogo} alt="Visa" className="h-full object-contain" />}
                                        {card.type === "mastercard" && <img src={mastercardLogo} alt="Mastercard" className="h-full object-contain" />}
                                        {card.type === "rupay" && <img src={rupayLogo} alt="Rupay" className="h-full object-contain" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Cards Count */}
                    <div className="w-full flex items-center justify-center mt-2">
                         <p className="text-white/60 text-[14px] font-satoshi">
                             Cards added: {cards.length}
                         </p>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <div
        id="fab-container"
        className={`fixed z-50 transition-all duration-300 ease-in-out flex items-center justify-end overflow-hidden ${showSuccessModal ? 'blur-sm brightness-50 pointer-events-none' : ''}`}
        style={{
            bottom: "100px", // Above bottom nav
            right: "20px",
            height: "56px",
            // Width expands based on state
            width: isFabExpanded ? "180px" : "56px",
        }}
      >
          <button
             onClick={handleFabClick}
             className="w-full h-full relative rounded-full flex items-center justify-center overflow-hidden"
             style={{
                 background: "#5260FE",
             }}
          >
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    border: "1px solid transparent",
                    background: "linear-gradient(to top right, rgba(255,255,255,0.12), rgba(0,0,0,0.20)) border-box",
                    WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
              />

              <div className="flex items-center justify-center w-full h-full px-4">
                  {isFabExpanded ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                          <img src={fabPlus} alt="+" className="w-6 h-6 object-contain" />
                          <span className="text-white text-[14px] font-medium whitespace-nowrap">
                              Add New Card
                          </span>
                      </div>
                  ) : (
                      <img src={fabPlus} alt="+" className="w-6 h-6 object-contain" />
                  )}
              </div>
          </button>
      </div>

      {/* Bottom Navigation */}
      <div className={showSuccessModal ? 'blur-sm brightness-50' : ''}>
         <BottomNavigation activeTab="cards" />
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6">
          <div
            className="relative rounded-2xl p-6 max-w-[320px] w-full z-10 flex flex-col items-center text-center border border-white/10"
            style={{
              backgroundImage: `url(${popupBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
             <img src={popupCardIcon} alt="Card Success" className="w-8 h-8 mb-4 object-contain" />

             <h2 className="text-white text-[18px] font-semibold mb-4">
               Card Added Successfully
             </h2>

             <div className="bg-black rounded-xl w-full px-[12px] py-[11px]">
                <p className="text-white text-[14px] leading-relaxed text-left">
                  Your card has been saved successfully. You can now use this card for withdrawals and payments.
                </p>
             </div>
          </div>

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
