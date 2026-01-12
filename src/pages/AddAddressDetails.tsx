import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SaveAddressSheet from "@/components/SaveAddressSheet";

// Assets
import topAddressContainerBg from "@/assets/top-address-container.png";
import selectedTagBg from "@/assets/selected.png";
import homeIcon from "@/assets/HomeTag.svg";
import workIcon from "@/assets/Work.svg";
import friendsIcon from "@/assets/Friends Family.svg";
import otherIcon from "@/assets/Other.svg";
import copyIcon from "@/assets/copy.svg";
import phoneIcon from "@/assets/phone.svg";
import bgDarkMode from "@/assets/bg-dark-mode.png";

interface AddressState {
  addressTitle: string; // "City, Country" or "Building Name"
  addressLine: string; // Full address
  plusCode: string;
  city: string;
  state: string;
  postcode: string;
  // Breakdown for editing
  houseNumber?: string;
  road?: string;
  area?: string;
}

const AddAddressDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = location.state as AddressState | null;

  // Form State
  const [house, setHouse] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [plusCode, setPlusCode] = useState(initialState?.plusCode || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("Home");
  const [customLabel, setCustomLabel] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // UI State
  const [headerOpacity, setHeaderOpacity] = useState(1);

  // Derived Address Display
  const [displayAddress, setDisplayAddress] = useState(initialState?.addressLine || "");

  const isFormValid = house.trim() !== "" && area.trim() !== "" && name.trim() !== "" && phone.trim().length === 10;

  useEffect(() => {
     if (!initialState) return;

     // Construct base parts
     const cityStatePin = `${initialState.city}, ${initialState.state} – ${initialState.postcode}`;

     const currentHouse = house || initialState.houseNumber || "";
     const currentArea = area || initialState.road || initialState.area || "";

     let constructed = "";
     if (currentHouse) constructed += `${currentHouse}, `;
     if (currentArea) constructed += `${currentArea}, `;
     if (landmark) constructed += `${landmark}, `;

     // Remove trailing comma/space
     if (constructed.endsWith(", ")) constructed = constructed.slice(0, -2);

     if (constructed && cityStatePin) {
         setDisplayAddress(`${constructed}, ${cityStatePin}`);
     } else if (cityStatePin) {
         setDisplayAddress(cityStatePin);
     } else {
         setDisplayAddress(initialState.addressLine);
     }

  }, [house, area, landmark, initialState]);

  const handleCopyPlusCode = () => {
    navigator.clipboard.writeText(plusCode);
    toast.success("Plus Code copied!");
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newOpacity = Math.max(0, Math.min(1, 1 - scrollTop / 100));
    setHeaderOpacity(newOpacity);
  };

  const handleSaveAddress = (overrideTag?: string) => {
    // If saving via Sheet, we trust the caller (overrideTag)
    // But we still need to validate the main form
    if (!isFormValid) {
        toast.error("Please fill all required details first.");
        return;
    }

    // New Flow: Check if selectedTag is "Other" but sheet hasn't triggered yet (no overrideTag)
    if (selectedTag === "Other" && !overrideTag) {
        setIsSheetOpen(true);
        return;
    }

    const tagToSave = overrideTag || (selectedTag === "Other" && customLabel ? customLabel : selectedTag);

    const addressData = {
        tag: tagToSave,
        house,
        area,
        landmark,
        name,
        phone,
        displayAddress,
        plusCode,
        city: initialState?.city || "",
        state: initialState?.state || "",
        postcode: initialState?.postcode || ""
    };

    localStorage.setItem("dotpe_user_address", JSON.stringify(addressData));
    toast.success("Address saved successfully!");
    navigate("/home", { replace: true });
  };

  const handleTagClick = (tagLabel: string) => {
      setSelectedTag(tagLabel);
      if (tagLabel !== "Other") {
          setCustomLabel(""); // Clear custom label if switching back to standard
      }
      // Note: We no longer open sheet immediately for "Other"
  };

  const handleSheetSave = (label: string) => {
      setCustomLabel(label);
      setIsSheetOpen(false);
      // Automatically attempt to save when sheet validates
      handleSaveAddress(label);
  };

  const tags = [
    { label: "Home", icon: homeIcon },
    { label: "Work", icon: workIcon },
    { label: "Friends & Family", icon: friendsIcon },
    { label: "Other", icon: otherIcon },
  ];

  // Helper to get input font class
  const getInputClass = (val: string) =>
    `w-full h-full bg-transparent border-none outline-none text-white transition-all ${
      val ? "font-bold" : "font-light"
    } text-[14px] font-satoshi z-10 relative`;

  // Custom Input with Placeholder Overlay
  const renderInput = (
    value: string,
    setValue: (val: string) => void,
    placeholder: string,
    mandatory: boolean = false
  ) => {
    return (
      <div className="h-[48px] rounded-full bg-[#191919] border border-[#313131] px-6 flex items-center relative">
        {!value && (
          <div className="absolute inset-0 px-6 flex items-center pointer-events-none">
            <span className="text-white font-light text-[14px] font-satoshi opacity-50">
              {placeholder}
              {mandatory && <span className="text-[#FF3B30] ml-1">*</span>}
            </span>
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={getInputClass(value)}
        />
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black text-white relative">
        {/* Background - Applied to a container to avoid scroll issues if needed, but fixed attachment works on scrollable too */}
        <div
            className="absolute inset-0 z-0"
            style={{
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
            }}
        />

        {/* Scrollable Content */}
        <div
            className="flex-1 overflow-y-auto pb-10 relative z-10 font-sans"
            onScroll={handleScroll}
        >
            <div className="safe-area-top pt-4 px-5">
                {/* Header */}
                <div
                className="flex items-center mb-[44px] sticky top-0 z-50"
                style={{ opacity: headerOpacity, pointerEvents: headerOpacity === 0 ? 'none' : 'auto' }}
                >
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center mr-2 rounded-full border border-white/20 active:bg-white/10"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="flex-1 text-center text-lg font-medium pr-10">Add New Address</h1>
                </div>

                {/* Address Container */}
                <div
                    className="relative w-full rounded-[12px] p-[11px] mb-[12px]"
                    style={{ height: "88px" }}
                >
                    {/* Background Image */}
                    <img
                        src={topAddressContainerBg}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover rounded-[12px] z-0 pointer-events-none"
                    />

                    <div className="relative z-10 flex flex-col justify-between h-full">
                        {/* Top Row: City/Country + Change Button */}
                        <div className="flex justify-between items-start">
                            <span className="font-bold text-[16px] truncate pr-2">
                                {initialState ? `${initialState.city}, India` : "Location Details"}
                            </span>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                                style={{
                                    width: "67px",
                                    height: "22px",
                                    borderRadius: "9999px",
                                }}
                            >
                                <span className="text-[12px] font-medium">Change</span>
                            </button>
                        </div>

                        {/* Bottom Row: Full Address */}
                        <p className="text-[12px] font-regular text-gray-300 line-clamp-2 mt-auto">
                            {displayAddress}
                        </p>
                    </div>
                </div>

                {/* Helper Text */}
                <p className="text-[12px] font-regular text-gray-400 mb-[12px]">
                    A detailed address will help our delivery partner reach your doorstep with ease
                </p>

                {/* Tags Section */}
                <h2 className="text-[14px] font-medium mb-[8px]">Save address as<span className="text-[#FF3B30] ml-0.5">*</span></h2>
                <div className="flex flex-wrap gap-2 mb-[32px]">
                    {tags.map((tag) => {
                        const isSelected = selectedTag === tag.label;
                        return (
                            <button
                                key={tag.label}
                                onClick={() => handleTagClick(tag.label)}
                                className="relative flex items-center justify-center px-4 h-[32px] rounded-full transition-all border border-white/20"
                                style={{
                                backgroundColor: isSelected ? "transparent" : "rgba(255,255,255,0.05)",
                                }}
                            >
                                {isSelected && (
                                    <img
                                        src={selectedTagBg}
                                        alt=""
                                        className="absolute inset-0 w-full h-full object-cover rounded-full z-0"
                                    />
                                )}
                                <div className="relative z-10 flex items-center gap-2">
                                    <img src={tag.icon} alt={tag.label} className="w-4 h-4" />
                                    <span className="text-[12px] font-medium">{tag.label}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Input Fields Container */}
                <div className="space-y-[10px] mb-[28px]">
                    {/* House / Flat */}
                    {renderInput(house, setHouse, "House / Flat / Floor", true)}

                    {/* Apartment / Road */}
                    {renderInput(area, setArea, "Apartment / Road / Area", true)}

                    {/* Landmark */}
                    {renderInput(landmark, setLandmark, "Landmark (Optional)", false)}

                    {/* Plus Code */}
                    <div className="h-[48px] rounded-full bg-[#191919] border border-[#313131] px-6 flex items-center justify-between">
                        <input
                            type="text"
                            value={plusCode}
                            onChange={(e) => setPlusCode(e.target.value)}
                            className={`${getInputClass(plusCode)} flex-1 mr-2`}
                        />
                        <button onClick={handleCopyPlusCode}>
                            <img src={copyIcon} alt="Copy" className="w-5 h-5 opacity-70 hover:opacity-100" />
                        </button>
                    </div>
                </div>

                {/* Contact Information */}
                <h2 className="text-[14px] font-medium mb-[12px]">Enter contact information<span className="text-[#FF3B30] ml-0.5">*</span></h2>
                <div className="space-y-[12px] mb-[26px]">
                    {/* Name */}
                    {renderInput(name, setName, "Your Name", true)}

                    {/* Phone Number */}
                    <div className="h-[48px] rounded-full bg-[#191919] border border-[#313131] flex items-center relative overflow-hidden">
                        <span className="text-[14px] font-medium text-white pl-[30px] pr-[22px]">
                            +91
                        </span>
                        {/* Divider */}
                        <div className="h-[32px] w-[1px] bg-[#313131]"></div>

                        {/* Input */}
                        <div className="flex-1 ml-[22px] mr-[20px] relative h-full flex items-center">
                            <input
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} // Numeric only
                                className={getInputClass(phone)}
                                style={{ paddingRight: "30px" }}
                            />
                        </div>

                        {/* Phone Icon */}
                        <img
                            src={phoneIcon}
                            alt="Phone"
                            className="absolute right-[20px] w-5 h-5 pointer-events-none"
                        />
                    </div>
                </div>

                {/* Save Address CTA */}
                <Button
                    onClick={() => handleSaveAddress()}
                    className="w-full rounded-full"
                    variant="gradient"
                    disabled={!isFormValid}
                >
                    Save Address
                </Button>
            </div>
        </div>

        {/* "Other" Tag Sheet */}
        <SaveAddressSheet
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            onSave={handleSheetSave}
            icon={otherIcon}
        />
    </div>
  );
};

export default AddAddressDetails;
