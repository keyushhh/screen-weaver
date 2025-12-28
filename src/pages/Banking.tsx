import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import savedCardsBg from "@/assets/saved-card-bg.png";
import addIcon from "@/assets/my-cards-add-icon.png";

const Banking = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-foreground text-[18px] font-semibold">Banking</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="px-5 mt-8 flex-1 overflow-y-auto scrollbar-hide">
        {/* Empty State */}
        <div
          className="w-full rounded-2xl p-4"
          style={{
            backgroundImage: `url(${savedCardsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "140px",
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-white text-[16px] font-medium">Bank Accounts</h2>
            <button
              onClick={() => navigate("/banking/add")}
              className="opacity-100 active:opacity-70 transition-opacity"
            >
              <img src={addIcon} alt="Add" className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[1px] bg-white/10 w-full mt-[15px] mb-[15px]" />
          <p className="text-white/60 text-[14px]">
            You don’t have any bank accounts added yet.
            <br />
            Please add a bank account to proceed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banking;
