import { WalletTier } from "@/contexts/UserContext";

import starterDiamond from "@/assets/starter diamond.png";
import proDiamond from "@/assets/pro.png";
import eliteDiamond from "@/assets/elite.png";
import supremeDiamond from "@/assets/supreme.png";
import freeChip from "@/assets/free chip.png";
import proChip from "@/assets/pro chip.png";
import eliteChip from "@/assets/elite chip.png";
import supremeChip from "@/assets/supreme chip.png";

export type { WalletTier };

export interface TierConfig {
    name: WalletTier;
    badge: string;
    chip: string;
    diamond: string;
    walletLimit: string;
    withdrawLimit: string;
    verification: string;
    limitations: string;
}

export const tiers: TierConfig[] = [
    {
        name: "Starter",
        badge: "Free",
        chip: freeChip,
        diamond: starterDiamond,
        walletLimit: "₹5,000",
        withdrawLimit: "₹5,000",
        verification: "Mobile number, basic information",
        limitations: "Add money cooldown, withdraw cannot exceed ₹5,000 a day.",
    },
    {
        name: "Pro",
        badge: "₹25/month",
        chip: proChip,
        diamond: proDiamond,
        walletLimit: "₹15,000",
        withdrawLimit: "₹10,000",
        verification: "PAN, Address proof",
        limitations: "Add money cooldown, withdraw cannot exceed ₹10,000 a day.",
    },
    {
        name: "Elite",
        badge: "₹50/month",
        chip: eliteChip,
        diamond: eliteDiamond,
        walletLimit: "₹1,00,000",
        withdrawLimit: "₹50,000",
        verification: "Video KYC needed",
        limitations: "No limitations, withdraw cannot exceed ₹25,000 a day.",
    },
    {
        name: "Supreme",
        badge: "₹100/month",
        chip: supremeChip,
        diamond: supremeDiamond,
        walletLimit: "No limit",
        withdrawLimit: "No limit",
        verification: "Physical verification",
        limitations: "No limitations",
    },
];

export const tierIconMap: Record<WalletTier, string> = {
    Starter: starterDiamond,
    Pro: proChip,
    Elite: eliteChip,
    Supreme: supremeChip,
};
