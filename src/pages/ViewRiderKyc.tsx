import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import verifiedIcon from "@/assets/verified.svg";

const ViewRiderKyc = () => {
    const navigate = useNavigate();

    return (
        <div
            className="fixed inset-0 w-full flex flex-col bg-[#0a0a12] safe-area-bottom overflow-y-auto no-scrollbar scroll-smooth"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div
                className="safe-area-top px-5 flex items-center justify-between pb-6"
                style={{ paddingTop: "24px" }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20"
                >
                    <ChevronLeft className="text-white w-6 h-6" />
                </button>

                <h1 className="text-white text-[18px] font-medium font-satoshi flex-1 text-center pr-10">
                    Partner KYC
                </h1>
            </div>

            <div className="px-5 mt-4">
                {/* Content will be added here step-by-step */}
            </div>
        </div>
    );
};

export default ViewRiderKyc;
