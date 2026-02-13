import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";

const ReportRiderKyc = () => {
    const navigate = useNavigate();
    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(false);

    const reasons = [
        "Photo does not match the delivery partner",
        "Wrong name or gender",
        "Fake-looking ID / tampered document",
        "Not the person shown on the app",
        "Other"
    ];

    const isOtherSelected = selectedReason === "Other";

    const handleSubmit = () => {
        // Validation logic
        if (!selectedReason) return;
        if (isOtherSelected && !comment.trim()) return;

        // Redirect to confirmation on success
        navigate("/report-rider-confirm");
    };

    return (
        <div
            className="fixed inset-0 w-full h-full flex flex-col bg-[#0a0a12] safe-area-top safe-area-bottom overflow-y-auto"
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

            <div className="px-5 mt-8 pb-10 space-y-4">
                {/* Pick a Reason Section */}
                <div
                    className="w-full rounded-[12px] border border-white/10 overflow-hidden"
                    style={{ backgroundColor: "rgba(25, 25, 25, 0.31)", backdropFilter: "blur(25px)" }}
                >
                    <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-[14px] font-medium font-satoshi">Pick a reason*</p>
                    </div>

                    <div className="flex flex-col">
                        {reasons.map((reason, index) => (
                            <label
                                key={reason}
                                className={`flex items-center px-4 py-3 cursor-pointer active:bg-white/5 transition-colors ${index !== reasons.length - 1 ? 'border-b border-white/5' : ''}`}
                                onClick={() => setSelectedReason(reason)}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedReason === reason ? 'border-[#5260FE]' : 'border-white/30'}`}>
                                    {selectedReason === reason && <div className="w-2.5 h-2.5 rounded-full bg-[#5260FE]" />}
                                </div>
                                <span className="ml-3 text-white text-[14px] font-normal font-satoshi">{reason}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Comment Section */}
                <div
                    className="w-full rounded-[12px] border border-white/10 overflow-hidden"
                    style={{ backgroundColor: "rgba(25, 25, 25, 0.31)", backdropFilter: "blur(25px)" }}
                >
                    <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-[14px] font-medium font-satoshi">
                            Tell us what you noticed {isOtherSelected ? '(Mandatory)*' : '(Optional)'}
                        </p>
                    </div>
                    <div className="p-4">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="e.g. “Driver’s face didn’t match the photo”, or “Different person showed up.”"
                            className="w-full h-24 bg-transparent text-white text-[14px] font-normal font-satoshi placeholder:text-white/30 resize-none outline-none"
                        />
                    </div>
                </div>

                {/* Attach Proofs Section */}
                <div
                    className="w-full rounded-[12px] border border-white/10 overflow-hidden"
                    style={{ backgroundColor: "rgba(25, 25, 25, 0.31)", backdropFilter: "blur(25px)" }}
                >
                    <button
                        onClick={() => setIsAttachmentsOpen(!isAttachmentsOpen)}
                        className="w-full px-4 py-3 flex items-center justify-between border-white/5"
                    >
                        <p className="text-white text-[14px] font-medium font-satoshi">Attach Proofs (Optional)</p>
                        {isAttachmentsOpen ? <ChevronUp className="text-white/50 w-5 h-5" /> : <ChevronDown className="text-white/50 w-5 h-5" />}
                    </button>

                    {isAttachmentsOpen && (
                        <div className="px-4 pb-6 flex flex-col items-center justify-center border-t border-white/5 pt-6 animate-in fade-in slide-in-from-top-2">
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-3">
                                <ImageIcon className="text-white w-6 h-6" />
                            </div>
                            <p className="text-white/40 text-[12px] font-normal font-satoshi text-center">
                                Upload a photo or video that shows the issue
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedReason || (isOtherSelected && !comment.trim())}
                        className={`w-full h-12 rounded-full flex items-center justify-center text-white text-[16px] font-medium font-satoshi transition-all active:scale-95 ${(!selectedReason || (isOtherSelected && !comment.trim())) ? 'bg-[#5260FE]/50 opacity-50' : 'bg-[#5260FE]'}`}
                        style={{ boxShadow: selectedReason ? "0px 4px 10px rgba(82, 96, 254, 0.3)" : "none" }}
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full h-12 rounded-full flex items-center justify-center text-white text-[16px] font-medium font-satoshi bg-white/5 border border-white/10 active:scale-95 transition-all"
                    >
                        Cancel
                    </button>
                </div>

                <p className="text-[12px] font-normal text-white/50 text-left pt-2 leading-tight">
                    <span className="font-bold text-white">*All reports are confidential</span> and helps us keep Grid.Pe secure for everyone.
                </p>
            </div>
        </div>
    );
};

export default ReportRiderKyc;
