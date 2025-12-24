import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import cardPreviewBg from "@/assets/card-preview-bg.png";
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

  // Visibility States
  // isPermanentlyVisible: Controlled by Eye toggle. If true, stays true.
  // isTempVisible: Controlled by typing/interaction. Resets after 5s.
  const [isPermanentlyVisible, setIsPermanentlyVisible] = useState(false);
  const [isTempVisible, setIsTempVisible] = useState(false);

  // Derived state for rendering
  const isVisible = isPermanentlyVisible || isTempVisible;

  // Auto-mask Timer Ref
  const maskTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Handle Activity (Typing or Focus)
  const handleActivity = () => {
    // If permanently visible, do nothing (timer irrelevant)
    if (isPermanentlyVisible) return;

    // Set temp visible
    setIsTempVisible(true);

    // Reset timer
    if (maskTimerRef.current) clearTimeout(maskTimerRef.current);
    maskTimerRef.current = setTimeout(() => {
      setIsTempVisible(false);
    }, 5000); // 5 seconds inactivity -> mask
  };

  // Toggle Eye
  const toggleEye = () => {
    const newState = !isPermanentlyVisible;
    setIsPermanentlyVisible(newState);

    if (newState) {
       // Turning ON: Clear any auto-mask timer
       if (maskTimerRef.current) clearTimeout(maskTimerRef.current);
       setIsTempVisible(false); // Clean up temp state, we are perma-visible
    } else {
       // Turning OFF: Immediately mask?
       // "When toggled OFF -> show masked values"
       setIsTempVisible(false);
       if (maskTimerRef.current) clearTimeout(maskTimerRef.current);
    }
  };

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (maskTimerRef.current) clearTimeout(maskTimerRef.current);
    };
  }, []);

  // Card Number Logic (Formatting + Detection)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleActivity(); // Trigger visibility
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);

    // Simple Detection
    if (val.startsWith("4")) setCardType("visa");
    else if (/^5[1-5]/.test(val) || /^2[2-7]/.test(val)) setCardType("mastercard");
    else if (/^60|^65|^81|^82|^508/.test(val)) setCardType("rupay");
    else setCardType(null);

    setCardNumber(val);
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleActivity();
      setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
  };

  const formatCardNumber = (num: string) => {
    if (!num) return "";
    const chunks = num.match(/.{1,4}/g) || [];
    return chunks.join(" ");
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Expiry change technically is activity too, but usually it's always visible?
    // Requirement implies "no input" globally masks "both fields".
    // So yes, typing anywhere should probably keep things alive?
    // "After 5-10 seconds of no input: Automatically mask both fields"
    // I'll add activity trigger here too for good UX.
    handleActivity();
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);

    if (val.length >= 2) {
      setExpiry(`${val.slice(0, 2)}/${val.slice(2)}`);
    } else {
      setExpiry(val);
    }
  };

  const hasInput = cardNumber.length > 0 || expiry.length > 0 || cvv.length > 0 || cardHolder.length > 0;

  // Masking Helper
  const getMaskedCardNumber = () => {
    if (!cardNumber) return "";
    const chunks = cardNumber.match(/.{1,4}/g) || [];
    return chunks.join(" ").replace(/\d/g, "*");
  };

  const getMaskedCVV = () => {
      if (!cvv) return "";
      return cvv.replace(/./g, "*");
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
        {/* Size: 360 x 192 px, Padding L/R: 26px */}
        <div
            className="relative w-full max-w-[360px] h-[192px] mx-auto mb-[20px] rounded-[16px] overflow-hidden shrink-0"
            style={{
                backgroundImage: `url(${cardPreviewBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="relative w-full h-full px-[26px]">
                {/* Top Row: Chip */}
                <div className="absolute top-[21px] right-[26px] w-[40px] h-[30px] flex justify-end">
                    <img src={chipIcon} alt="Chip" className="h-[28px] object-contain" />
                </div>

                {/* Cardholder Name */}
                <div className="absolute top-[26px] left-[26px] right-[70px]">
                    <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => {
                            handleActivity();
                            setCardHolder(e.target.value.toUpperCase());
                        }}
                        placeholder="CARDHOLDER NAME"
                        className="w-full bg-transparent text-white text-[16px] font-medium placeholder:text-white focus:outline-none uppercase p-0 border-none font-satoshi"
                    />
                </div>

                {/* Card Number Label */}
                <div className="absolute top-[70px] left-[26px]">
                    <p className="text-[#C4C4C4] text-[13px] font-normal font-satoshi">Card Number</p>
                </div>

                {/* Card Number Value */}
                {/*
                   Layout: Use Flex to span width.
                */}
                <div className="absolute top-[93px] left-[26px] right-[26px] flex items-center justify-between">
                    <div className="relative flex-1 mr-4">
                        {/* The Actual Input (Hidden when masked, Visible when shown/typing) */}
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatCardNumber(cardNumber)}
                            onChange={handleCardNumberChange}
                            placeholder="XXXX XXXX XXXX XXXX"
                            // If isVisible, show input normally. If !isVisible, hide input (opacity 0) but keep interaction for focus?
                            // Actually, if !isVisible, we want user to TAP to start typing (which triggers handleActivity -> shows input).
                            // So input must be clickable.
                            className={`w-full bg-transparent text-white text-[20px] font-bold placeholder:text-white focus:outline-none p-0 border-none font-satoshi tracking-widest h-[24px] ${!isVisible ? 'opacity-0 absolute inset-0 z-10' : 'relative z-10'}`}
                        />

                        {/* The Masked Overlay (Visible when masked) */}
                        {!isVisible && (
                           <div className="pointer-events-none text-white text-[20px] font-bold font-satoshi tracking-widest h-[24px] whitespace-nowrap overflow-hidden">
                              {cardNumber.length > 0 ? getMaskedCardNumber() : <span className="text-[18px] text-white">XXXX XXXX XXXX XXXX</span>}
                           </div>
                        )}
                    </div>

                    {/* Eye Icon */}
                    <button
                        type="button"
                        onClick={toggleEye}
                        className="text-white shrink-0 z-20"
                    >
                        {isPermanentlyVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                </div>

                {/* Expiry & CVV Row */}
                <div className="absolute top-[129px] left-[26px] flex gap-8">
                    {/* Expiry Group */}
                    <div className="flex flex-col gap-[5px]">
                        <label className="text-[#C4C4C4] text-[14px] font-normal font-satoshi leading-none">Expiry Date</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-[60px] bg-transparent text-white text-[13px] font-bold placeholder:text-white focus:outline-none p-0 border-none font-satoshi leading-none"
                        />
                    </div>

                    {/* CVV Group */}
                    <div className="flex flex-col gap-[5px]">
                        <label className="text-[#C4C4C4] text-[14px] font-normal font-satoshi leading-none">CVV</label>

                         {/* CVV Input with Visibility Logic */}
                         <div className="relative w-[40px] h-[14px]">
                             <input
                                type="text"
                                inputMode="numeric"
                                maxLength={3}
                                value={cvv}
                                onChange={handleCVVChange}
                                placeholder="XXX"
                                className={`w-full h-full bg-transparent text-white text-[14px] font-bold placeholder:text-white focus:outline-none p-0 border-none font-satoshi leading-none ${!isVisible ? 'opacity-0 absolute inset-0 z-10' : 'relative z-10'}`}
                            />
                             {!isVisible && (
                                <div className="pointer-events-none text-white text-[14px] font-bold font-satoshi leading-none absolute top-0 left-0">
                                    {cvv.length > 0 ? getMaskedCVV() : <span className="text-white">***</span>}
                                </div>
                             )}
                             {!isVisible && cvv.length === 0 && (
                                 <div className="pointer-events-none text-white text-[14px] font-bold font-satoshi leading-none absolute top-0 left-0">
                                     ***
                                 </div>
                             )}
                         </div>
                    </div>
                </div>

                {/* Network Logo */}
                <div className="absolute bottom-[26px] right-[26px] h-[24px]">
                     {cardType === "visa" && <img src={visaLogo} alt="Visa" className="h-full object-contain" />}
                     {cardType === "mastercard" && <img src={mastercardLogo} alt="Mastercard" className="h-full object-contain" />}
                     {cardType === "rupay" && <img src={rupayLogo} alt="Rupay" className="h-full object-contain" />}
                </div>
            </div>
        </div>

        {/* Helper Texts */}
        <div className="flex flex-col gap-[14px] mb-[28px] px-1">
           <div className="flex flex-col">
               <p className="text-white/60 text-[14px] leading-relaxed">
                 Enter your details by tapping on the fields above.
               </p>
               <p className="text-white/60 text-[14px] leading-relaxed">
                 Or scan your card below. Both works!
               </p>
           </div>

           <p className="text-white/60 text-[14px] leading-relaxed">
             Your card info is encrypted and stored like it’s top-tier gossip — never shared.
           </p>
        </div>

        {/* Scan Card Section */}
        <div
          className="w-full h-[184px] bg-black rounded-2xl flex items-center justify-center border border-white/5"
        >
            <button
              onClick={() => navigate("/cards/scan")}
              className="px-4 h-[32px] flex items-center justify-center rounded-full text-[14px] text-foreground gap-2 border border-white/10"
              style={{
                backgroundImage: 'url("/lovable-uploads/881be237-04b4-4be4-b639-b56090b04ed5.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
               <img src={photoCameraIcon} alt="Camera" className="w-4 h-4 opacity-80" />
               <span className="text-white text-[12px] font-medium">Scan Card</span>
            </button>
        </div>

        {/* CTA Button */}
        <div className="mt-[86px]">
            <Button
              onClick={() => hasInput ? navigate("/cards") : null}
              disabled={!hasInput}
              className="w-full h-[48px] rounded-full text-[16px] font-medium bg-[#5260FE] hover:bg-[#5260FE]/90 text-white disabled:opacity-50"
            >
              {hasInput ? "Save Card" : "Proceed"}
            </Button>
        </div>

      </div>
    </div>
  );
};

export default AddCard;
