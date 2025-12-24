import { useNavigate } from "react-router-dom";
import { ChevronLeft, Menu } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import savedCardsBg from "@/assets/saved-cards-bg.png";
import addIcon from "@/assets/add-icon.png";
import BottomNavigation from "@/components/BottomNavigation";

const MyCards = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-[100dvh] flex flex-col safe-area-top safe-area-bottom pb-[96px]"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className=""
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-foreground text-[20px] font-medium">My Cards</h1>
        </div>
        <button>
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="px-5 mt-8">
        <div
          className="w-full rounded-2xl p-4"
          style={{
            backgroundImage: `url(${savedCardsBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "140px",
          }}
        >
          {/* Top Row: Title + Add Icon */}
          <div className="flex items-center justify-between">
            <h2 className="text-white text-[16px] font-medium">Saved Cards</h2>
            {/* Disabled logic for now as per requirements */}
            <button className="opacity-100">
              <img src={addIcon} alt="Add" className="w-5 h-5" />
            </button>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-white/10 w-full mt-[15px] mb-[15px]" />

          {/* Subtitle */}
          <p className="text-white/60 text-[14px]">
            You haven’t added any cards yet.
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="cards" />
    </div>
  );
};

export default MyCards;
