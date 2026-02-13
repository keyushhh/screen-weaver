import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import warningBg from "@/assets/warning-background.png";
import checkIcon from "@/assets/check-icon.svg";

const ReportRiderConfirm = () => {
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<"yes" | "no">("yes");

    const otpDigits = ["1", "3", "0", "5", "9", "6"];

    return (
        <div
            className="fixed inset-0 w-full h-full flex flex-col bg-[#0a0a12] safe-area-top safe-area-bottom overflow-y-auto"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${warningBg})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div
                className="px-5 flex items-center justify-between shrink-0"
                style={{ paddingTop: "24px" }}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20"
                >
                    <ChevronLeft className="text-white w-6 h-6" />
                </button>

                <h1 className="text-white text-[22px] font-medium font-satoshi flex-1 text-center pr-10">
                    Report Rider KYC
                </h1>
            </div>

            <div className="px-5 flex flex-col items-center">
                {/* Check Icon - 21px below header */}
                <div className="mt-[21px] flex items-center justify-center">
                    <img src={checkIcon} alt="Report Logged" style={{ width: '62px', height: '62px' }} />
                </div>

                {/* Thanks Message - 35px below icon */}
                <h2 className="mt-[35px] text-white text-[18px] font-bold font-satoshi text-center">
                    Thanks for reporting!
                </h2>

                {/* Summary Box - mt-8 */}
                <div
                    className="mt-8 p-4 rounded-[12px] border border-white/10"
                    style={{ backgroundColor: "rgba(25, 25, 25, 0.31)", backdropFilter: "blur(25px)" }}
                >
                    <p className="text-white/70 text-[14px] font-normal font-satoshi leading-[150%]">
                        Your report has been logged and the rider is now under the scanner. This helps keep Grid.Pe safe. If the documents don’t add up, action will be taken.
                    </p>
                </div>

                {/* Proceed Question - 9px below first container */}
                <div
                    className="w-full mt-[9px] rounded-[12px] border border-white/10 overflow-hidden"
                    style={{ backgroundColor: "rgba(25, 25, 25, 0.31)", backdropFilter: "blur(25px)" }}
                >
                    <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-[14px] font-medium font-satoshi">Do you want to proceed with the delivery?</p>
                    </div>

                    <div className="flex flex-col">
                        <label
                            className="flex items-center px-4 py-3 cursor-pointer border-b border-white/5 active:bg-white/5 transition-colors"
                            onClick={() => setSelectedOption("yes")}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === "yes" ? 'border-[#5260FE]' : 'border-white/30'}`}>
                                {selectedOption === "yes" && <div className="w-2.5 h-2.5 rounded-full bg-[#5260FE]" />}
                            </div>
                            <span className="ml-3 text-white text-[14px] font-normal font-satoshi">Yes, let’s do this!</span>
                        </label>
                        <label
                            className="flex items-center px-4 py-3 cursor-pointer active:bg-white/5 transition-colors"
                            onClick={() => setSelectedOption("no")}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === "no" ? 'border-[#5260FE]' : 'border-white/30'}`}>
                                {selectedOption === "no" && <div className="w-2.5 h-2.5 rounded-full bg-[#5260FE]" />}
                            </div>
                            <span className="ml-3 text-white text-[14px] font-normal font-satoshi">No, I’d rather not gamble at my doorstep.</span>
                        </label>
                    </div>
                </div>

                {/* Conditional Content Based on Selection */}
                {selectedOption === "yes" ? (
                    <>
                        {/* OTP Section - 35px below second container */}
                        <div className="w-full mt-[35px] pl-[16px]">
                            <p className="text-white text-[15px] font-bold font-satoshi mb-[12px]">
                                Please provide this OTP to confirm the delivery
                            </p>
                            <div className="w-full flex justify-start mb-6">
                                <div className="flex gap-2">
                                    {otpDigits.map((digit, index) => (
                                        <div
                                            key={index}
                                            className="w-[48px] h-[64px] rounded-[7px] flex items-center justify-center text-white text-[32px] font-bold font-satoshi relative overflow-hidden"
                                            style={{
                                                backgroundColor: "rgba(25, 25, 25, 0.31)",
                                                backdropFilter: "blur(23.51px)",
                                                WebkitBackdropFilter: "blur(23.51px)",
                                            }}
                                        >
                                            {/* Gradient Border Overlay - 0.59px */}
                                            <div
                                                className="absolute inset-0 pointer-events-none rounded-[7px]"
                                                style={{
                                                    padding: "0.59px",
                                                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.02))",
                                                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                                    WebkitMaskComposite: "xor",
                                                    maskComposite: "exclude",
                                                }}
                                            />
                                            {digit}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Status Dot */}
                            <div className="mt-4 flex items-center gap-2">
                                <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center">
                                    <div className="w-[12px] h-[12px] rounded-full bg-[#EAB308] shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                </div>
                                <span className="text-white text-[12px] font-normal font-satoshi">Awaiting delivery confirmation</span>
                            </div>
                        </div>

                        {/* Bottom Disclaimer & Button */}
                        <div className="mt-10 px-2 w-full">
                            <p className="text-white/50 text-[12px] font-normal font-satoshi leading-tight">
                                You’re about to proceed with this delivery despite a flagged KYC. Please confirm.
                            </p>
                            <button
                                onClick={() => navigate('/order-delivered')}
                                className="mt-3 w-full h-[48px] rounded-full bg-[#5260FE] text-white text-[16px] font-medium font-satoshi active:scale-95 transition-all"
                                style={{ boxShadow: "0px 4px 10px rgba(82, 96, 254, 0.3)" }}
                            >
                                Proceed with Delivery
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Cancellation Info - 35px below second container */}
                        <div className="w-full mt-[35px] pl-[16px] pr-[16px]">
                            <h3 className="text-white text-[15px] font-bold font-satoshi">
                                We’re so sorry for the inconvenience.
                            </h3>
                            <p className="mt-4 text-white/70 text-[14px] font-normal font-satoshi leading-[140%]">
                                The amount held in your wallet for this order will be refunded within 30 minutes if you proceed with the cancellation of the order. No additional charges.
                            </p>

                            {/* Status Dot */}
                            <div className="mt-[21px] flex items-center gap-2">
                                <div className="w-[20px] h-[20px] rounded-full flex items-center justify-center">
                                    <div className="w-[12px] h-[12px] rounded-full bg-[#EAB308] shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                </div>
                                <span className="text-white/50 text-[12px] font-normal font-satoshi">Awaiting delivery confirmation</span>
                            </div>
                        </div>

                        {/* Cancel Button - mt-10 */}
                        <div className="mt-[37px] px-2 w-full">
                            <button
                                onClick={() => navigate('/order-cancelled')}
                                className="w-full h-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white text-[16px] font-medium font-satoshi active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="h-10" />
        </div>
    );
};

export default ReportRiderConfirm;
