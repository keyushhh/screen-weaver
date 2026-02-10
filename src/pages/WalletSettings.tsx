import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useUser, WalletTier } from "@/contexts/UserContext";

import starterDiamond from "@/assets/starter diamond.png";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import freeChip from "@/assets/free chip.png";
import proChip from "@/assets/pro chip.png";
import eliteChip from "@/assets/elite chip.png";
import supremeChip from "@/assets/supreme chip.png";
import tierCardActive from "@/assets/tier card.png";
import tierCardInactive from "@/assets/non selected card.png";

const WalletSettings = () => {
    const navigate = useNavigate();
    const { walletTier, setWalletTier } = useUser();

    // Browsing state for carousel
    const [activeTier, setActiveTier] = useState<WalletTier>(walletTier);

    /* -------------------- Tier Config -------------------- */

    const tiers: {
        name: WalletTier;
        badge: string;
        chip: string;
        walletLimit: string;
        withdrawLimit: string;
        verification: string;
        limitations: string;
    }[] = [
            {
                name: "Starter",
                badge: "Free",
                chip: freeChip,
                walletLimit: "₹ 5,000",
                withdrawLimit: "₹ 5,000",
                verification: "Mobile number, basic information",
                limitations: "Add money cooldown, withdraw cannot exceed ₹5,000 a day.",
            },
            {
                name: "Pro",
                badge: "₹25/month",
                chip: proChip,
                walletLimit: "₹ 15,000",
                withdrawLimit: "₹ 10,000",
                verification: "PAN, Address proof",
                limitations: "Add money cooldown, withdraw cannot exceed ₹10,000 a day.",
            },
            {
                name: "Elite",
                badge: "₹100/month",
                chip: eliteChip,
                walletLimit: "₹ 1,00,000",
                withdrawLimit: "₹ 50,000",
                verification: "Video KYC needed",
                limitations: "Higher limits, priority support.",
            },
            {
                name: "Supreme",
                badge: "Invite Only",
                chip: supremeChip,
                walletLimit: "No limit",
                withdrawLimit: "No limit",
                verification: "Physical verification",
                limitations: "Exclusive benefits, dedicated manager.",
            },
        ];

    const currentTier =
        tiers.find((tier) => tier.name === activeTier) || tiers[0];

    const handleUpgrade = () => {
        if (activeTier !== walletTier) {
            setWalletTier(activeTier);
        }
    };

    return (
        <div
            className="h-full w-full overflow-hidden flex flex-col safe-area-top safe-area-bottom font-sans"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="shrink-0 flex items-center w-full px-5 pt-6 pb-4 z-10 gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-95 transition-transform"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-white text-[20px] font-medium tracking-tight">
                    Wallet Settings
                </h1>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar pb-[40px]">
                {/* Current Tier Summary */}
                <div className="px-5 mb-8">
                    <div
                        className="relative w-full rounded-[28px] overflow-hidden"
                        style={{
                            background:
                                "radial-gradient(120% 120% at 100% 0%, #2b2f6f 0%, #0b0b14 45%, #05050a 100%)",
                        }}
                    >
                        <div className="relative z-10 p-6 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={starterDiamond}
                                    alt="Tier"
                                    className="w-[42px] h-[42px] object-contain"
                                />

                                <div className="flex flex-col">
                                    <span className="text-white text-[13px] font-semibold tracking-[0.18em]">
                                        {currentTier.name.toUpperCase()}
                                    </span>

                                    <div className="flex items-end gap-2 mt-1">
                                        <span className="text-white text-[34px] font-bold leading-none">
                                            {currentTier.walletLimit}
                                        </span>
                                        <span className="text-white/70 text-[16px] font-medium mb-[2px]">
                                            / wallet limit
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleUpgrade}
                                disabled={activeTier === walletTier}
                                className="w-full h-[56px] rounded-full text-white text-[18px] font-medium active:scale-95 transition-transform disabled:opacity-50"
                                style={{ background: "#6C72FF" }}
                            >
                                {activeTier === walletTier ? "Current Plan" : "Upgrade Now"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tiers Carousel */}
                <div className="mb-8">
                    <div className="flex overflow-x-auto no-scrollbar px-5 gap-4 pb-4 snap-x snap-mandatory">
                        {tiers.map((tier) => {
                            const isActive = activeTier === tier.name;

                            return (
                                <div
                                    key={tier.name}
                                    onClick={() => setActiveTier(tier.name)}
                                    className="snap-center shrink-0 relative cursor-pointer transition-transform active:scale-[0.98]"
                                    style={{ width: "290px", height: "420px" }}
                                >
                                    <div
                                        className="absolute inset-0 rounded-[24px] overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${isActive ? tierCardActive : tierCardInactive
                                                })`,
                                            backgroundSize: "100% 100%",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    />

                                    <div className="relative z-10 p-6 flex flex-col h-full text-white">
                                        <div className="flex justify-between items-start mb-6">
                                            <img
                                                src={tier.chip}
                                                alt={tier.name}
                                                className="w-[44px] h-[44px] object-contain"
                                            />
                                            <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[14px] font-medium">
                                                {tier.badge}
                                            </div>
                                        </div>

                                        <h3 className="text-[22px] font-bold mb-6">
                                            {tier.name.toUpperCase()} WALLET
                                        </h3>

                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <p className="text-white/50 text-[14px] mb-1">
                                                    Verification
                                                </p>
                                                <p className="text-[16px]">{tier.verification}</p>
                                            </div>

                                            <div>
                                                <p className="text-white/50 text-[14px] mb-1">
                                                    Wallet limit
                                                </p>
                                                <p className="text-[18px]">{tier.walletLimit}</p>
                                            </div>

                                            <div>
                                                <p className="text-white/50 text-[14px] mb-1">
                                                    Withdraw limit
                                                </p>
                                                <p className="text-[18px]">{tier.withdrawLimit}</p>
                                            </div>

                                            <div className="pt-4 mt-auto">
                                                <p className="text-white/50 text-[14px] mb-1">
                                                    Limitations
                                                </p>
                                                <p className="text-[14px] leading-snug">
                                                    {tier.limitations}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Ending Sections */}
                <div className="px-5 pb-10 flex flex-col gap-12">
                    <div>
                        <h3 className="text-white text-[28px] font-medium mb-6">
                            How to Upgrade?
                        </h3>
                        <ul className="flex flex-col gap-4 list-disc pl-6">
                            <li className="text-white text-[20px] leading-relaxed">
                                Complete full KYC verification
                            </li>
                            <li className="text-white text-[20px] leading-relaxed">
                                Submit PAN (mandatory)
                            </li>
                            <li className="text-white text-[20px] leading-relaxed">
                                Actively use your wallet for faster upgrades
                            </li>
                            <li className="text-white text-[20px] leading-relaxed">
                                Need higher business limits? Submit GST details
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-[28px] font-medium mb-6">
                            Why Limits?
                        </h3>
                        <p className="text-white text-[20px] leading-relaxed mb-4">
                            Wallets in India are governed by RBI-regulated limits to ensure fund
                            security and prevent misuse.
                        </p>
                        <p className="text-white text-[20px] leading-relaxed">
                            Your tier helps us serve you better, safely, and responsibly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletSettings;