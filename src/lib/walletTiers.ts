import { WalletTier } from "@/contexts/UserContext";

import starterDiamond from "@/assets/starter diamond.png";
import proDiamond from "@/assets/pro.png";
import eliteDiamond from "@/assets/elite.png";
import supremeDiamond from "@/assets/supreme.png";
import freeChip from "@/assets/free chip.png";
import proChip from "@/assets/pro chip.png";
import eliteChip from "@/assets/elite chip.png";
import supremeChip from "@/assets/supreme chip.png";

// New assets
import starterExpand from "@/assets/starter-expand.png";
import proExpand from "@/assets/pro-expand.png";
import eliteExpand from "@/assets/elite-expand.png";
import supremeExpand from "@/assets/supreme-expand.png";
import infoBg from "@/assets/info bg.png";

export type { WalletTier };

export interface TierConfig {
    name: WalletTier;
    badge: string;
    chip: string;
    diamond: string;

    // Detailed page fields
    headerTitle: string;
    headerSubtitle: string;
    headerImage: string;
    infoBg: string;

    // Info sections
    verification: string;
    walletLimit: string;
    dailyTopUpLimit: string;
    withdrawals: string;
    withdrawLimit: string; // Existing, keep for compatibility
    limitations: string;

    // Additional sections
    downgradeOptions?: string;
    note: string;

    // Button
    buttonText: string;
    buttonAction: string;
}

const placeholderContent = {
    dailyTopUpLimit: "₹5,000",
    withdrawals: "Not allowed",
    verification: "Mobile number, basic information",
    limitations: "Add money cooldown, withdraw cannot exceed ₹5,000 a day.",
    note: "Upgrade to Pro to unlock higher limits and withdrawals.",
    buttonText: "Compare Plans",
    buttonAction: "/wallet-settings"
};

export const tiers: TierConfig[] = [
    {
        name: "Starter",
        badge: "Free",
        chip: freeChip,
        diamond: starterDiamond,
        walletLimit: "₹5,000",
        withdrawLimit: "Not allowed",

        headerTitle: "STARTER",
        headerSubtitle: "₹5,000 / wallet limit",
        headerImage: starterExpand,
        infoBg: infoBg,

        ...placeholderContent
    },
    {
        name: "Pro",
        badge: "₹25/month",
        chip: proChip,
        diamond: proDiamond,
        walletLimit: "₹15,000",
        withdrawLimit: "₹10,000",

        headerTitle: "PRO",
        headerSubtitle: "₹15,000 / wallet limit",
        headerImage: proExpand,
        infoBg: infoBg,

        ...placeholderContent
    },
    {
        name: "Elite",
        badge: "₹50/month",
        chip: eliteChip,
        diamond: eliteDiamond,
        walletLimit: "₹1,00,000",
        withdrawLimit: "₹50,000",

        headerTitle: "ELITE",
        headerSubtitle: "₹1,00,000 / wallet limit",
        headerImage: eliteExpand,
        infoBg: infoBg,

        ...placeholderContent
    },
    {
        name: "Supreme",
        badge: "₹100/month",
        chip: supremeChip,
        diamond: supremeDiamond,
        walletLimit: "No limit",
        withdrawLimit: "No limit",

        headerTitle: "SUPREME",
        headerSubtitle: "No limit / wallet limit",
        headerImage: supremeExpand,
        infoBg: infoBg,

        ...placeholderContent
    },
];

export const tierIconMap: Record<WalletTier, string> = {
    Starter: starterDiamond,
    Pro: proChip,
    Elite: eliteChip,
    Supreme: supremeChip,
};
