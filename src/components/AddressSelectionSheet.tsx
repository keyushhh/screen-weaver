import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search } from "lucide-react";
import { forwardGeocode } from "@/utils/geoUtils";
import { Geolocation } from '@capacitor/geolocation';
import { reverseGeocode } from "@/utils/geoUtils";

// Assets
import locationIcon from "@/assets/location-pin.svg"; // Fallback, will try to use specific assets
import addPlusIcon from "@/assets/add plus.svg";
import navIcon from "@/assets/navigation icon.svg";
import chatIcon from "@/assets/chat.svg";
import chevronRight from "@/assets/chevron right.svg";
import homeIcon from "@/assets/HomeTag.svg";
import workIcon from "@/assets/Work.svg";
import friendsIcon from "@/assets/Friends Family.svg";
import otherIcon from "@/assets/Other.svg";
import editIcon from "@/assets/edit.svg";
import shareIcon from "@/assets/share.svg";
import deleteIcon from "@/assets/delete.svg";
import selectedPill from "@/assets/selected-pill.png"; // Or similar pill asset

interface SavedAddress {
  tag: string;
  house: string;
  area: string;
  landmark?: string;
  name: string;
  phone: string;
  displayAddress: string;
  city: string;
  state: string;
  postcode: string;
  plusCode?: string;
  // We can add IDs later, for now we match by content
}

interface AddressSelectionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (address: SavedAddress) => void;
}

const AddressSelectionSheet: React.FC<AddressSelectionSheetProps> = ({ isOpen, onClose, onAddressSelect }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [currentLocationName, setCurrentLocationName] = useState<string>("Kormangala"); // Placeholder default

  // Load addresses
  useEffect(() => {
    if (isOpen) {
        // Load Saved Addresses
        const savedStr = localStorage.getItem("dotpe_saved_addresses");
        if (savedStr) {
            try {
                setSavedAddresses(JSON.parse(savedStr));
            } catch (e) {
                console.error("Failed to parse saved addresses", e);
            }
        } else {
            // Backward compatibility: check dotpe_user_address if list is empty
            const single = localStorage.getItem("dotpe_user_address");
            if (single) {
                try {
                    const parsed = JSON.parse(single);
                    setSavedAddresses([parsed]);
                    // Also migrate it to list?
                    localStorage.setItem("dotpe_saved_addresses", JSON.stringify([parsed]));
                } catch(e) {}
            }
        }

        // Load Selected Address
        const current = localStorage.getItem("dotpe_user_address");
        if (current) {
            try {
                setSelectedAddress(JSON.parse(current));
            } catch (e) {}
        }
    }
  }, [isOpen]);

  // Search Logic
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
        // Simple search (no debounce for this quick implementation, or reuse util)
        try {
            const results = await forwardGeocode(query, 12.9716, 77.5946); // Default bias
            setSearchResults(results);
        } catch (e) {
            console.error(e);
        }
    } else {
        setSearchResults([]);
    }
  };

  const handleSearchResultClick = (result: any) => {
      // Navigate to Map with coordinates
      navigate('/add-address', {
          state: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon)
          }
      });
      // AddAddress needs to handle this state to center map
  };

  const handleUseCurrentLocation = async () => {
      try {
        const permission = await Geolocation.checkPermissions();
        if (permission.location !== 'granted') {
             await Geolocation.requestPermissions();
        }
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;

        // Reverse Geocode to get area name
        const result = await reverseGeocode(latitude, longitude);
        if (result) {
            const area = result.address?.suburb || result.address?.neighbourhood || result.address?.city || "Current Location";
            setCurrentLocationName(area);

            // We set a "Temporary" address as selected?
            // The prompt says: "use current location... (to showcase only the area name)"
            // And logic: "should grab GPS... reverse geocode... set as active address immediately"

            const tempAddr: SavedAddress = {
                tag: "Current Location",
                house: "",
                area: area,
                name: "You",
                phone: "",
                displayAddress: result.display_name,
                city: result.address?.city || "",
                state: result.address?.state || "",
                postcode: result.address?.postcode || ""
            };

            localStorage.setItem("dotpe_user_address", JSON.stringify(tempAddr));
            onAddressSelect(tempAddr);
            onClose();
        }
      } catch (e) {
          console.error("Location error", e);
      }
  };

  const handleSelectAddress = (addr: SavedAddress) => {
      setSelectedAddress(addr);
      localStorage.setItem("dotpe_user_address", JSON.stringify(addr));
      // Notify parent immediately (optional, or wait for close)
      // "user taps ... automatically become selected"
      onAddressSelect(addr);
  };

  const handleDelete = (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      const newList = [...savedAddresses];
      const removed = newList.splice(index, 1)[0];
      setSavedAddresses(newList);
      localStorage.setItem("dotpe_saved_addresses", JSON.stringify(newList));

      // If deleted was selected, clear selection or select first?
      // For now, if selected was deleted, maybe clear it?
      if (selectedAddress && JSON.stringify(selectedAddress) === JSON.stringify(removed)) {
          localStorage.removeItem("dotpe_user_address");
          // Update parent to null?
          // For now let's leave it, or clear.
      }
  };

  const handleEdit = (e: React.MouseEvent, addr: SavedAddress) => {
      e.stopPropagation();
      navigate('/add-address-details', { state: {
          addressTitle: addr.tag, // Not perfect mapping but okay
          addressLine: addr.displayAddress,
          plusCode: addr.plusCode || "",
          city: addr.city,
          state: addr.state,
          postcode: addr.postcode,
          houseNumber: addr.house,
          road: addr.area,
          // We might need to pass phone/name too if details page supports editing them from state?
          // Details page uses: `house || initialState.houseNumber` etc.
          // It doesn't seem to hydrate Name/Phone from state.
          // I might need to update AddAddressDetails to read these extra fields if passed.
          // For now, we follow the standard "Add Address" flow which is Map -> Details.
          // But "Edit" usually implies going straight to Details.
          // I will assume AddAddressDetails needs a small tweak to read name/phone or I just pass what I can.
      }});
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "Home": return homeIcon;
      case "Work": return workIcon;
      case "Friends & Family": return friendsIcon;
      case "Other": return otherIcon;
      default: return homeIcon;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center safe-area-bottom">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
        />

        {/* Sheet */}
        <div
            className="relative w-full bg-black rounded-t-[36px] pt-4 pb-10 px-5 max-h-[90vh] overflow-y-auto"
            style={{
                boxShadow: "0px -4px 20px rgba(0, 0, 0, 0.5)"
            }}
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-[18px]">
                <h2 className="text-white text-[18px] font-bold font-satoshi">
                    Select Delivery Location
                </h2>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-[18px]">
                <div className="h-[48px] bg-[#191919] rounded-full flex items-center px-4 border border-[#313131]">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search for area, street name..."
                        className="bg-transparent border-none outline-none text-white text-[14px] font-satoshi flex-1 placeholder:text-[#585858]"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="absolute top-[52px] w-full bg-[#1A1A1A] rounded-xl z-20 overflow-hidden max-h-[200px] overflow-y-auto border border-white/10">
                        {searchResults.map((res, i) => (
                            <div
                                key={i}
                                className="px-4 py-3 border-b border-white/5 hover:bg-white/5 cursor-pointer text-white text-[14px]"
                                onClick={() => handleSearchResultClick(res)}
                            >
                                {res.display_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Static Actions Container */}
            <div className="bg-[#0D0D0D] rounded-[13px] py-[12px] mb-[32px]">
                {/* 1. Use Current Location */}
                <div
                    className="flex items-center justify-between px-4 py-2 cursor-pointer active:bg-white/5"
                    onClick={handleUseCurrentLocation}
                >
                    <div className="flex items-center gap-3">
                        <img src={navIcon} alt="" className="w-5 h-5 opacity-80" />
                        <div>
                            <p className="text-white text-[14px] font-medium font-satoshi">Use current location</p>
                            <p className="text-white/50 text-[14px] font-regular font-satoshi mt-1">
                                {currentLocationName}
                            </p>
                        </div>
                    </div>
                    <img src={chevronRight} alt="" className="w-4 h-4 opacity-50" />
                </div>
                <div className="h-[1px] bg-[#2A2A2A] mx-4 my-2" />

                {/* 2. Add New Address */}
                <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-white/5"
                    onClick={() => navigate('/add-address')}
                >
                    <div className="flex items-center gap-3">
                        <img src={addPlusIcon} alt="" className="w-5 h-5 opacity-80" />
                        <p className="text-white text-[14px] font-medium font-satoshi">Add new address</p>
                    </div>
                    <img src={chevronRight} alt="" className="w-4 h-4 opacity-50" />
                </div>
                <div className="h-[1px] bg-[#2A2A2A] mx-4 my-2" />

                {/* 3. Request Address */}
                <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer active:bg-white/5"
                    onClick={() => {}} // No-op as requested
                >
                    <div className="flex items-center gap-3">
                        <img src={chatIcon} alt="" className="w-5 h-5 opacity-80" />
                        <p className="text-white text-[14px] font-medium font-satoshi">Request address from someone else</p>
                    </div>
                    <img src={chevronRight} alt="" className="w-4 h-4 opacity-50" />
                </div>
            </div>

            {/* Saved Addresses Section */}
            <h3 className="text-white text-[18px] font-bold font-satoshi mb-[12px]">
                Your saved addresses
            </h3>

            <div className="space-y-3 pb-10">
                {savedAddresses.map((addr, idx) => {
                    const isSelected = selectedAddress &&
                        (addr.displayAddress === selectedAddress.displayAddress && addr.tag === selectedAddress.tag);

                    return (
                        <div
                            key={idx}
                            onClick={() => handleSelectAddress(addr)}
                            className={`bg-[#0D0D0D] rounded-[12px] p-[11px] relative border ${isSelected ? 'border-white/20' : 'border-transparent'}`}
                            style={{ minHeight: "131px" }}
                        >
                            {/* Header Row */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <img src={getTagIcon(addr.tag)} alt={addr.tag} className="w-4 h-4" />
                                    <span className="text-white text-[16px] font-bold font-satoshi capitalize">
                                        {addr.tag}
                                    </span>
                                    {isSelected && (
                                        <div className="relative h-[26px] w-[79px] ml-2 flex items-center justify-center">
                                            <img src={selectedPill} alt="Selected" className="absolute inset-0 w-full h-full object-contain" />
                                            <span className="relative z-10 text-white text-[12px] font-medium font-satoshi">Selected</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-[13px]">
                                    <button onClick={(e) => handleEdit(e, addr)}>
                                        <img src={editIcon} alt="Edit" className="w-[22px] h-[22px] opacity-70 hover:opacity-100" />
                                    </button>
                                    <button onClick={(e) => e.stopPropagation()}>
                                        <img src={shareIcon} alt="Share" className="w-[22px] h-[22px] opacity-70 hover:opacity-100" />
                                    </button>
                                    <button onClick={(e) => handleDelete(e, idx)}>
                                        <img src={deleteIcon} alt="Delete" className="w-[22px] h-[22px] opacity-70 hover:opacity-100" />
                                    </button>
                                </div>
                            </div>

                            <div className="h-[1px] bg-[#747474] w-full opacity-20 mb-[11px]" />

                            {/* Address Details */}
                            <p className="text-[#AFAFAF] text-[12px] font-regular font-satoshi leading-relaxed line-clamp-2 mb-[15px]">
                                {addr.displayAddress}
                            </p>
                            <p className="text-[#AFAFAF] text-[12px] font-regular font-satoshi">
                                Phone number: {addr.phone}
                            </p>
                        </div>
                    );
                })}
            </div>

        </div>
    </div>
  );
};

export default AddressSelectionSheet;
