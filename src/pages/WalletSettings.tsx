import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useUser, WalletTier } from "@/contexts/UserContext";

import starterDiamond from "@/assets/starter diamond.png";
import proDiamond from "@/assets/pro.png";
import eliteDiamond from "@/assets/elite.png";
import supremeDiamond from "@/assets/supreme.png";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import freeChip from "@/assets/free chip.png";
import proChip from "@/assets/pro chip.png";
import eliteChip from "@/assets/elite chip.png";
import supremeChip from "@/assets/supreme chip.png";
import tierCardActive from "@/assets/selected wallet.png";
import tierCardInactive from "@/assets/non selected card.png";
import tierCardBg from "@/assets/tier-card-bg.png";

const WalletSettings = () => {
    const navigate = useNavigate();
    const { walletTier, setWalletTier } = useUser();

    /* ---------------- Tier Config ---------------- */

    const tiers: {
        name: WalletTier;
        badge: string;
        chip: string;
        diamond: string;
        walletLimit: string;
        withdrawLimit: string;
        verification: string;
        limitations: string;
    }[] = [
            {
                name: "Starter",
                badge: "Free",
                chip: freeChip,
                diamond: starterDiamond,
                walletLimit: "₹ 5,000",
                withdrawLimit: "₹ 5,000",
                verification: "Mobile number, basic information",
                limitations: "Add money cooldown, withdraw cannot exceed ₹5,000 a day.",
            },
            {
                name: "Pro",
                badge: "₹25/month",
                chip: proChip,
                diamond: proDiamond,
                walletLimit: "₹ 15,000",
                withdrawLimit: "₹ 10,000",
                verification: "PAN, Address proof",
                limitations: "Add money cooldown, withdraw cannot exceed ₹10,000 a day.",
            },
            {
                name: "Elite",
                badge: "₹100/month",
                chip: eliteChip,
                diamond: eliteDiamond,
                walletLimit: "₹ 1,00,000",
                withdrawLimit: "₹ 50,000",
                verification: "Video KYC needed",
                limitations: "Higher limits, priority support.",
            },
            {
                name: "Supreme",
                badge: "Invite Only",
                chip: supremeChip,
                diamond: supremeDiamond,
                walletLimit: "No limit",
                withdrawLimit: "No limit",
                verification: "Physical verification",
                limitations: "Exclusive benefits, dedicated manager.",
            },
        ];

    const currentTier =
        tiers.find((tier) => tier.name === walletTier) || tiers[0];

    /* ---------------- Tier → Icon mapping (TOP CARD ONLY) ---------------- */

    const tierIconMap: Record<WalletTier, string> = {
        Starter: starterDiamond,
        Pro: proChip,
        Elite: eliteChip,
        Supreme: supremeChip,
    };

    const handleUpgrade = () => {
        // Upgrade logic here
    };

    return (
        <div
            className="h-full w-full overflow-hidden flex flex-col safe-area-top safe-area-bottom"
            style={{
                fontFamily: "'Satoshi', sans-serif",
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

                {/* -------- TOP TIER SUMMARY CARD -------- */}
                <div className="px-5 mb-8">
                    <div
                        className="relative w-full rounded-[28px] overflow-hidden"
                        style={{
                            backgroundImage: `url(${tierCardBg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <div className="relative z-10 pt-[17px] pl-[15px] pr-6 pb-6 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={tierIconMap[currentTier.name]}
                                    alt={currentTier.name}
                                    className="w-[47px] h-[40px] object-contain"
                                />

                                <div className="flex flex-col">
                                    <span className="text-white text-[15px] font-medium tracking-normal">
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
                                className="mx-auto h-[48px] rounded-full text-white text-[18px] font-medium active:scale-95 transition-transform"
                                style={{ background: "#6C72FF", width: "326px", maxWidth: "100%" }}
                            >
                                Upgrade Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* -------- TIERS CAROUSEL -------- */}
                <div className="mb-8">
                    <div className="flex overflow-x-auto no-scrollbar px-5 gap-4 pb-4 snap-x snap-mandatory">
                        {tiers.map((tier) => {
                            const isActive = walletTier === tier.name;

                            return (
                                <div
                                    key={tier.name}
                                    className="snap-center shrink-0 relative transition-transform"
                                    style={{ width: "290px", height: "420px" }}
                                >
                                    {/* Selected / Non-selected background ONLY */}
                                    <div
                                        className="absolute inset-0 rounded-[24px] overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${isActive ? tierCardActive : tierCardInactive
                                                })`,
                                            backgroundSize: "100% 100%",
                                            backgroundRepeat: "no-repeat",
                                        }}
                                    />

                                    {/* Content */}
                                    <div className="relative z-10 p-6 flex flex-col h-full text-white">
                                        <div className="flex justify-between items-start mb-6">
                                            {/* Diamond icon (left) */}
                                            <img
                                                src={tier.diamond}
                                                alt={tier.name}
                                                className="w-[34px] h-[28px] object-contain relative z-20"
                                            />

                                            {/* Chip badge with text (right) */}
                                            <div
                                                className="flex items-center justify-center rounded-full text-[10px] font-medium text-white"
                                                style={{
                                                    width: "88px",
                                                    height: "24px",
                                                    backgroundImage: `url(${tier.chip})`,
                                                    backgroundSize: "100% 100%",
                                                    backgroundRepeat: "no-repeat",
                                                }}
                                            >
                                                {tier.badge}
                                            </div>
                                        </div>

                                        <h3 className="text-[22px] font-bold mb-6">
                                            {tier.name.toUpperCase()} WALLET
                                        </h3>

                                        <div className="flex flex-col gap-[6px]">
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

                {/* -------- INFO SECTIONS -------- */}
                <div className="px-5 pb-10 flex flex-col gap-12">
                    <div>
                        <h3 className="text-white text-[16px] font-medium mb-6">
                            How to Upgrade?
                        </h3>
                        <ul className="flex flex-col gap-[2px] list-disc pl-6">
                            <li className="text-white text-[16px] font-light leading-relaxed">
                                Complete full KYC verification
                            </li>
                            <li className="text-white text-[16px] font-light leading-relaxed">
                                Submit PAN (mandatory)
                            </li>
                            <li className="text-white text-[16px] font-light leading-relaxed">
                                Actively use your wallet for faster upgrades
                            </li>
                            <li className="text-white text-[16px] font-light leading-relaxed">
                                Need higher business limits? Submit GST details
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white text-[16px] font-medium mb-6">
                            Why Limits?
                        </h3>
                        <p className="text-white text-[16px] font-light leading-relaxed mb-4">
                            Wallets in India are governed by RBI-regulated limits to ensure fund
                            security and prevent misuse.
                            Your tier helps us serve you better, safely, and responsibly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletSettings;