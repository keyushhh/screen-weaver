import { useState, useEffect } from "react";
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
  const [showCardNumber, setShowCardNumber] = useState(false); // false = masked

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
    // 1. If empty -> "XXXX XXXX XXXX XXXX" (handled by placeholder)
    if (!num) return "";

    // 2. Format chunks of 4
    const chunks = num.match(/.{1,4}/g) || [];
    const formatted = chunks.join(" ");

    // 3. If NOT showing -> Replace digits with *
    if (!showCardNumber) {
        return formatted.replace(/\d/g, "*");
    }

    return formatted;
  };

  // Because the input value is masked (***), typing into it directly is tricky if we don't manage raw value.
  // The 'value' prop of the input is what the user sees.
  // We need to intercept key presses or handle change carefully if we want to support typing while masked.
  // However, standard UX often unmasks while typing or requires unmasking to edit.
  // The requirements say "Eye toggle behavior... Masked vs Visible".
  // For simplicity and robustness, when masked, we display the masked string.
  // If the user types, 'onChange' receives the new string (with asterisks). This breaks state.
  // Solution: We separate the DISPLAY value from the logic.
  // But wait, standard input onChange gives the full new value.
  // If `value` is `****`, user types `1` -> `****1`.
  // We can't recover the original numbers easily.
  // A cleaner approach for this specific "Masking" requirement on an input field:
  // When masked, show `text` type with asterisks? Or `password` type?
  // Password type uses dots (bullet points). Requirement says: "Replace rounded dots with asterisks (*)".
  // So `password` type is OUT.
  // We MUST use `text` type and manually mask the display value.
  // AND we must support typing.
  // This is complex for a simple React input without a dedicated masking library.
  // Simplification: We will only render the MASKED VIEW when not editing or focused?
  // No, requirement says "Eye toggle works only for card number, not CVV" was an issue.
  // Requirement: "Eye icon logic... ON -> show actual, OFF -> mask".

  // Strategy:
  // We will maintain `cardNumber` (raw).
  // The input `value` will be `showCardNumber ? format(cardNumber) : mask(cardNumber)`.
  // `onChange`: We need to calculate the diff.
  // actually, if we mask the value passed to input, user edits are destructive to the raw value unless we carefully track cursor.
  // ALTERNATIVE: Use a transparent input for typing over a visible masked span?
  // OR: Just force "Show" mode when typing? (Common pattern).
  // BUT requirement says "Eye toggle behavior... Masked/Visible".
  // Given "Beginner with zero coding knowledge" persona constraints, I should likely implement the most robust simple way.
  // Use a `div` that overlays the input when masked?
  // Let's try: Input is always there. If masked, we show a separate `div` with the masked text ON TOP, and pass clicks to the input (which then focuses and maybe unmasks?).
  // OR: Just assume user toggles Eye to Edit.
  // Let's stick to the prompt: "Eye toggle... OFF -> mask values".
  // I will make the input `readOnly` when masked? No, that prevents editing.
  // I will just use the `password` type hack? No, "Replace rounded dots with asterisks".
  // Okay, I will use a simple logical approach:
  // If `!showCardNumber` (Masked), render a `div` looking like the input. If user clicks it, it focuses the real input (opacity 0) or just toggles?
  // Let's go with: Input handles the raw value. If !showCardNumber, we style the font to be a 'security' font? No, specific asterisk font match required.
  // Best approach for this task:
  // Render a real `<input>` that is opaque when `showCardNumber` is TRUE.
  // When `showCardNumber` is FALSE, render the `<input>` as opacity 0 (still focusable/typeable) and overlaid exactly on top of a `div` that renders the Asterisks.
  // This allows typing (blindly) while maintaining the mask style.

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

  // Masking Helper
  const getMaskedCardNumber = () => {
    if (!cardNumber) return "";
    const chunks = cardNumber.match(/.{1,4}/g) || [];
    return chunks.join(" ").replace(/\d/g, "*");
  };

  const getMaskedCVV = () => {
      if (!cvv) return "";
      return cvv.replace(/./g, "*"); // Replace all chars with *
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
                        onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
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
                   Fix cropping: "Push the eye icon slightly more to the right"
                   Layout: Use Flex to span width.
                   The container is `absolute left-[26px] right-[26px]`.
                   This gives full width minus padding.
                */}
                <div className="absolute top-[93px] left-[26px] right-[26px] flex items-center justify-between">
                    <div className="relative flex-1 mr-4">
                        {/* The Actual Input (Hidden when masked, Visible when shown) */}
                        <input
                            type="text"
                            inputMode="numeric"
                            value={formatCardNumber(cardNumber)}
                            onChange={handleCardNumberChange}
                            placeholder="XXXX XXXX XXXX XXXX"
                            className={`w-full bg-transparent text-white text-[20px] font-bold placeholder:text-white focus:outline-none p-0 border-none font-satoshi tracking-widest h-[24px] ${!showCardNumber ? 'opacity-0 absolute inset-0 z-10' : 'relative z-10'}`}
                        />

                        {/* The Masked Overlay (Visible when masked) */}
                        {!showCardNumber && (
                           <div className="pointer-events-none text-white text-[20px] font-bold font-satoshi tracking-widest h-[24px]">
                              {cardNumber.length > 0 ? getMaskedCardNumber() : <span className="text-white">XXXX XXXX XXXX XXXX</span>}
                           </div>
                        )}
                    </div>

                    {/* Eye Icon */}
                    {/* Toggle: Open = Visible (showCardNumber=true), Closed = Masked */}
                    <button
                        type="button"
                        onClick={() => setShowCardNumber(!showCardNumber)}
                        className="text-white shrink-0 z-20"
                    >
                        {showCardNumber ? <Eye size={20} /> : <EyeOff size={20} />}
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

                         {/* CVV Input with Manual Masking Logic linked to same toggle */}
                         <div className="relative w-[40px] h-[14px]">
                             <input
                                type="text"
                                inputMode="numeric"
                                maxLength={3}
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                placeholder="XXX" // Placeholder is handled by div below if empty?
                                // Actually, input placeholder works if opacity is 0? Yes.
                                className={`w-full h-full bg-transparent text-white text-[14px] font-bold placeholder:text-white focus:outline-none p-0 border-none font-satoshi leading-none ${!showCardNumber ? 'opacity-0 absolute inset-0 z-10' : 'relative z-10'}`}
                            />
                             {!showCardNumber && (
                                <div className="pointer-events-none text-white text-[14px] font-bold font-satoshi leading-none absolute top-0 left-0">
                                    {cvv.length > 0 ? getMaskedCVV() : <span className="text-white">***</span>}
                                </div>
                             )}
                             {/* Show placeholder if empty and showing? handled by input default */}
                             {/* Wait, if !showCardNumber and empty, we want to show '***'? Or 'XXX'?
                                 Requirement says: "When no input: CVV -> ***".
                                 So default placeholder for masked state is ***.
                                 For unmasked? "XXX".
                             */}
                             {/* Adjust placeholder logic based on toggle?
                                 If showCardNumber is TRUE, input placeholder="XXX" is visible.
                                 If FALSE, input is hidden. Div shows.
                                 Div should show '***' if cvv empty.
                             */}
                             {!showCardNumber && cvv.length === 0 && (
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
