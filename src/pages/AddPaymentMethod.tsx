import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import chevronIcon from "@/assets/chevron.svg";
import addIcon from "@/assets/add.svg";
import codeIcon from "@/assets/code.svg";
import upiIcon from "@/assets/upi.png";
import credIcon from "@/assets/cred.png";
import gpayIcon from "@/assets/gpay.png";
import phonepeIcon from "@/assets/phonepe.png";
import amazonIcon from "@/assets/amazon.png";

const AddPaymentMethod = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { amount } = location.state || { amount: "0.00" };

    const glassContainerStyle: React.CSSProperties = {
        backgroundColor: "rgba(25, 25, 25, 0.31)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "relative",
        borderRadius: "22px",
    };

    const StrokeOverlay = () => (
        <div
            className="absolute inset-0 pointer-events-none rounded-[22px]"
            style={{
                padding: "0.63px",
                background:
                    "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.20))",
                WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
            }}
        />
    );

    const Divider = () => (
        <div className="w-[338px] h-[1px] bg-[#202020] mx-auto" />
    );

    return (
        <div
            className="h-full w-full overflow-y-auto overscroll-y-none flex flex-col safe-area-top safe-area-bottom pb-8"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="px-5 pt-4 flex items-center justify-between relative z-10 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>

                <h1 className="text-white text-[18px] font-medium font-sans absolute left-1/2 -translate-x-1/2">
                    Add Payment
                </h1>

                <div className="w-10" />
            </div>

            <div className="flex-1 flex flex-col items-center pt-[34px] px-5">
                {/* UPI Header */}
                <div className="w-full flex items-center mb-[12px]">
                    <img src={upiIcon} alt="UPI" className="w-[32px] h-[32px] object-contain" />
                    <span className="ml-[14px] text-white text-[16px] font-bold font-sans">
                        Pay using any UPI App
                    </span>
                </div>

                {/* UPI Container */}
                <div
                    className="w-[363px] rounded-[22px] flex flex-col px-[10px] overflow-hidden"
                    style={{
                        ...glassContainerStyle,
                        height: "auto",
                        minHeight: "202px",
                        paddingTop: "9px",
                        paddingBottom: "15px",
                    }}
                >
                    <StrokeOverlay />

                    {/* CRED */}
                    <div className="flex items-center h-[32px] mb-[9px]">
                        <img src={credIcon} alt="CRED" className="w-[32px] h-[32px] object-contain" />
                        <span className="ml-[8px] text-white text-[16px] font-bold font-sans w-[80px]">
                            CRED UPI
                        </span>
                        <div className="ml-auto flex items-center gap-1 cursor-pointer">
                            <span className="text-white text-[12px] font-medium font-sans">
                                Link Account
                            </span>
                            <img src={chevronIcon} alt=">" className="w-4 h-4 opacity-70" />
                        </div>
                    </div>

                    <Divider />

                    {/* Google Pay */}
                    <div className="flex items-center h-[32px] mt-[10px] mb-[9px]">
                        <img src={gpayIcon} alt="GPay" className="w-[32px] h-[32px] object-contain" />
                        <span className="ml-[8px] text-white text-[16px] font-bold font-sans w-[120px]">
                            Google Pay UPI
                        </span>
                        <div className="ml-auto flex items-center gap-1 cursor-pointer">
                            <span className="text-white text-[12px] font-medium font-sans">
                                Link Account
                            </span>
                            <img src={chevronIcon} alt=">" className="w-4 h-4 opacity-70" />
                        </div>
                    </div>

                    <Divider />

                    {/* PhonePe */}
                    <div className="flex items-center h-[32px] mt-[10px] mb-[9px]">
                        <img src={phonepeIcon} alt="PhonePe" className="w-[32px] h-[32px] object-contain" />
                        <span className="ml-[8px] text-white text-[16px] font-bold font-sans w-[120px]">
                            PhonePe UPI
                        </span>
                        <div className="ml-auto flex items-center gap-1 cursor-pointer">
                            <span className="text-white text-[12px] font-medium font-sans">
                                Link Account
                            </span>
                            <img src={chevronIcon} alt=">" className="w-4 h-4 opacity-70" />
                        </div>
                    </div>

                    <Divider />

                    {/* UPI ID */}
                    <div className="flex items-center h-[32px] mt-[10px]">
                        <div className="w-[32px]" />
                        <span className="text-white text-[16px] font-bold font-sans -ml-[32px]">
                            UPI ID
                        </span>
                        <input
                            type="text"
                            placeholder="Required"
                            className="ml-[37px] bg-transparent border-none outline-none text-white text-[14px] font-medium font-sans placeholder:text-[#FAFAFA]/30 flex-1"
                        />
                    </div>
                </div>

                {/* Cards Section */}
                <div className="w-full mt-[36px] flex flex-col">
                    <span className="text-white text-[16px] font-bold font-sans mb-[12px]">
                        Cards
                    </span>

                    <div
                        className="w-[363px] h-[66px] rounded-[22px] relative flex flex-col justify-center pl-[20px] pr-[13px] overflow-hidden"
                        style={glassContainerStyle}
                    >
                        <StrokeOverlay />

                        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
                            <img src={addIcon} alt="Add" className="w-[20px] h-[20px]" />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-white text-[16px] font-bold font-sans leading-none mb-[6px]">
                                Add a credit or debit card
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-white text-[12px] font-light font-sans leading-none">
                                    Incl.
                                </span>
                                <span className="text-white text-[12px] font-bold font-sans leading-none">
                                    ₹9 Processing Fee
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* More Payment Options */}
                <div className="w-full mt-[24px] flex flex-col">
                    <span className="text-white text-[16px] font-bold font-sans mb-[12px]">
                        More Payment Options
                    </span>

                    <div
                        className="w-[363px] h-[110px] rounded-[22px] flex flex-col px-[10px] overflow-hidden"
                        style={{ ...glassContainerStyle, paddingTop: "9px" }}
                    >
                        <StrokeOverlay />

                        {/* Amazon Pay */}
                        <div className="flex items-center h-[32px] mb-[9px]">
                            <img src={amazonIcon} alt="Amazon" className="w-[32px] h-[32px] object-contain" />
                            <span className="ml-[8px] text-white text-[16px] font-bold font-sans whitespace-nowrap">
                                Amazon Pay Wallet
                            </span>
                            <div className="ml-auto flex items-center gap-1 cursor-pointer">
                                <span className="text-white text-[12px] font-medium font-sans">
                                    Link Account
                                </span>
                                <img src={chevronIcon} alt=">" className="w-4 h-4 opacity-70" />
                            </div>
                        </div>

                        <Divider />

                        {/* Netbanking */}
                        <div
                            className="flex items-center mt-[9px] relative h-[40px] cursor-pointer"
                            onClick={() => navigate('/order-summary', { state: { amount } })}
                        >
                            <div className="flex flex-col justify-center">
                                <span className="text-white text-[16px] font-bold font-sans leading-none mb-[6px]">
                                    Netbanking
                                </span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-white text-[12px] font-light font-sans leading-none">
                                        Incl.
                                    </span>
                                    <span className="text-white text-[12px] font-bold font-sans leading-none">
                                        ₹5 Processing Fee
                                    </span>
                                </div>
                            </div>

                            <div className="absolute right-0 top-1 flex items-center gap-2">
                                <span className="text-white text-[12px] font-medium font-sans">
                                    Select Bank
                                </span>
                                <img src={codeIcon} alt="Code" className="w-[18px] h-[18px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPaymentMethod;