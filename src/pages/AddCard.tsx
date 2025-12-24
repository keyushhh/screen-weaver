import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import cardPreviewBg from "@/assets/card-preview-bg.png";
import chipIcon from "@/assets/chip.png";
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

  // Check if we returned from scan
  useEffect(() => {
    if (location.state?.scanned) {
      // Simulate populated data after scan
      setCardNumber("4532123456789012");
      setExpiry("12/28");
      setCardHolder("JULES DOTPE");
      // Clean up state so refresh doesn't re-trigger if needed,
      // but typical React Router behavior handles history well enough for this demo.
    }
  }, [location.state]);

  // Card Number Logic (Formatting + Detection)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digits
    let val = e.target.value.replace(/\D/g, "");

    // Limit to 16 digits
    if (val.length > 16) val = val.slice(0, 16);

    // Detect Type
    if (val.startsWith("4")) setCardType("visa");
    else if (/^5[1-5]/.test(val) || /^2[2-7]/.test(val)) setCardType("mastercard");
    else if (/^60|^65|^81|^82|^508/.test(val)) setCardType("rupay");
    else setCardType(null);

    setCardNumber(val);
  };

  // Format display with spaces every 4 digits
  const formatCardNumber = (num: string) => {
    return num.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  // Determine CTA state
  const hasInput = cardNumber.length > 0 || expiry.length > 0 || cvv.length > 0 || cardHolder.length > 0;

  // Expiry Formatting (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);

    if (val.length >= 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setExpiry(val);
    }
  };

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
      <div className="px-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-foreground text-[20px] font-medium">Add New Card</h1>
        </div>
      </div>

      <div className="flex-1 px-5 mt-8 flex flex-col">
        {/* Scan Button Row */}
        <button
          onClick={() => navigate("/cards/scan")}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
             <img src={photoCameraIcon} alt="Scan" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-[#5260FE] text-[16px] font-medium">Scan a card</span>
        </button>

        {/* Interactive Card Preview */}
        <div className="relative w-full aspect-[1.58] max-w-[400px] mx-auto">
          {/* Background */}
          <img
            src={cardPreviewBg}
            alt="Card Background"
            className="w-full h-full object-contain drop-shadow-xl"
          />

          {/* Card Content Overlay */}
          <div className="absolute inset-0 p-[6%] flex flex-col justify-between">
            {/* Top Row: Chip + Logo */}
            <div className="flex justify-between items-start">
              <img src={chipIcon} alt="Chip" className="w-[12%] object-contain" />

              {/* Network Logo */}
              <div className="h-[24px] w-[40px] flex justify-end items-center">
                 {cardType === "visa" && <img src={visaLogo} alt="Visa" className="h-full object-contain" />}
                 {cardType === "mastercard" && <img src={mastercardLogo} alt="Mastercard" className="h-full object-contain" />}
                 {cardType === "rupay" && <img src={rupayLogo} alt="Rupay" className="h-full object-contain" />}
              </div>
            </div>

            {/* Middle: Card Number Input */}
            <div className="mt-2">
              <input
                type="text"
                inputMode="numeric"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                className="w-full bg-transparent text-white text-[22px] font-mono tracking-widest placeholder:text-white/30 focus:outline-none"
              />
            </div>

            {/* Bottom Row: Name, Expiry, CVV */}
            <div className="flex justify-between items-end mt-auto">
              {/* Card Holder Name */}
              <div className="flex flex-col w-[45%]">
                <label className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Card Holder</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="NAME ON CARD"
                  className="w-full bg-transparent text-white text-[14px] font-medium placeholder:text-white/30 focus:outline-none"
                />
              </div>

              {/* Expiry & CVV Group */}
              <div className="flex items-end gap-4">
                 {/* Expiry */}
                 <div className="flex flex-col w-[60px]">
                    <label className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Expires</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full bg-transparent text-white text-[14px] font-medium placeholder:text-white/30 focus:outline-none"
                    />
                 </div>

                 {/* CVV */}
                 <div className="flex flex-col w-[40px]">
                    <label className="text-white/50 text-[10px] uppercase tracking-wider mb-1">CVV</label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="123"
                      className="w-full bg-transparent text-white text-[14px] font-medium placeholder:text-white/30 focus:outline-none"
                    />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secure Payment Badge (Visual Only) */}
        <div className="mt-8 flex items-center justify-center gap-2 opacity-60">
           {/* Simple lock icon and text */}
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
           <span className="text-white text-[12px]">Secure payment with DotPe</span>
        </div>
      </div>

      {/* Footer Action */}
      <div className="px-5 mt-auto">
        <Button
          onClick={() => navigate("/cards")}
          disabled={!hasInput}
          className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white disabled:bg-white/10 disabled:text-white/40"
        >
          {hasInput ? "Save Card" : "Proceed"}
        </Button>
      </div>
    </div>
  );
};

export default AddCard;
