import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import cardPreviewBg from "@/assets/card-preview-bg.png";
import savedCardsBg from "@/assets/saved-card-bg.png";
import chipIcon from "@/assets/card-chip.png";
import photoCameraIcon from "@/assets/photo-camera.png";
import mastercardLogo from "@/assets/mastercard-logo.png";
import visaLogo from "@/assets/visa-logo.png";
import rupayLogo from "@/assets/rupay-logo.png";
import { Button } from "@/components/ui/button";

const AddCard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "rupay" | null>(null);
  const [showCardNumber, setShowCardNumber] = useState(false);

  // Check if we returned from scan
  useEffect(() => {
    if (location.state?.scanned) {
      setCardNumber("5244315678911203");
      setExpiry("08/29");
      setCvv("607");
      setCardHolder("KHUSHI KAPOOR");
      setCardType("mastercard");
    }
  }, [location.state]);

  // Card Number Logic (Formatting + Detection)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);

    // Simple Detection
    if (val.startsWith("4")) setCardType("visa");
    else if (/^5[1-5]/.test(val) || /^2[2-7]/.test(val)) setCardType("mastercard");
    else if (/^60|^65|^81|^82|^508/.test(val)) setCardType("rupay");
    else setCardType(null);

    setCardNumber(val);
  };

  const formatCardNumber = (num: string) => {
    return num.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);

    if (val.length >= 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setExpiry(val);
    }
  };

  const hasInput = cardNumber.length > 0 || expiry.length > 0 || cvv.length > 0 || cardHolder.length > 0;

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom pb-8"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-medium absolute left-1/2 -translate-x-1/2">Add Card</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 px-5 mt-8 flex flex-col">
        {/* Interactive Card Preview */}
        <div className="relative w-full aspect-[1.58] max-w-[400px] mx-auto mb-6">
          <img
            src={cardPreviewBg}
            alt="Card Background"
            className="w-full h-full object-contain drop-shadow-2xl"
          />

          {/* Card Content Overlay */}
          <div className="absolute inset-0 p-[7%] flex flex-col justify-between">
            {/* Top Row: Name + Chip */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col w-[60%]">
                 <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="KHUSHI KAPOOR"
                  className="w-full bg-transparent text-white text-[13px] font-medium placeholder:text-white/40 focus:outline-none uppercase tracking-wide mb-2"
                />
                <label className="text-white/40 text-[10px] font-normal">Card Number</label>
              </div>
              <img src={chipIcon} alt="Chip" className="w-[12%] object-contain" />
            </div>

            {/* Middle: Card Number + Eye */}
            <div className="flex items-center gap-3">
              <input
                type={showCardNumber ? "text" : "password"}
                inputMode="numeric"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
                placeholder="5244 3156 7891 1203"
                className="w-full bg-transparent text-white text-[20px] font-medium tracking-widest placeholder:text-white/40 focus:outline-none h-[28px]"
              />
               <button
                  type="button"
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  className="text-white/70 hover:text-white"
                >
                  {showCardNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            {/* Bottom Row: Expiry, CVV, Logo */}
            <div className="flex justify-between items-end mt-1">
               <div className="flex gap-8">
                   <div className="flex flex-col">
                      <label className="text-white/40 text-[10px] mb-1">Expiry Date</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="08/29"
                        className="w-[50px] bg-transparent text-white text-[12px] font-medium placeholder:text-white/40 focus:outline-none"
                      />
                   </div>
                   <div className="flex flex-col">
                      <label className="text-white/40 text-[10px] mb-1">CVV</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="607"
                        className="w-[40px] bg-transparent text-white text-[12px] font-medium placeholder:text-white/40 focus:outline-none"
                      />
                   </div>
               </div>

               {/* Network Logo */}
               <div className="h-[20px] flex items-center">
                 {cardType === "visa" && <img src={visaLogo} alt="Visa" className="h-full object-contain" />}
                 {cardType === "mastercard" && <img src={mastercardLogo} alt="Mastercard" className="h-full object-contain" />}
                 {cardType === "rupay" && <img src={rupayLogo} alt="Rupay" className="h-full object-contain" />}
               </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 px-1 space-y-4">
           <p className="text-white/60 text-[14px] leading-relaxed">
             Enter your details by tapping on the fields above.
             <br />
             Or scan your card below. Both works!
           </p>

           <p className="text-white/40 text-[14px] leading-relaxed">
             Your card info is encrypted and stored like it’s top-tier gossip — never shared.
           </p>
        </div>

        {/* Scan Button Container */}
        <div
          className="w-full h-[184px] rounded-2xl flex items-center justify-center"
          style={{
            backgroundImage: `url(${savedCardsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
            <button
              onClick={() => navigate("/cards/scan")}
              className="h-[32px] px-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center gap-2 transition-colors active:bg-white/10"
            >
               <img src={photoCameraIcon} alt="Camera" className="w-4 h-4 opacity-80" />
               <span className="text-white text-[12px] font-medium">Scan Card</span>
            </button>
        </div>

      </div>

      {/* Footer Action */}
      <div className="px-5 mt-auto">
        <Button
          onClick={() => hasInput ? navigate("/cards") : null}
          disabled={!hasInput}
          className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white disabled:opacity-50"
        >
          {hasInput ? "Save Card" : "Proceed"}
        </Button>
      </div>
    </div>
  );
};

export default AddCard;
