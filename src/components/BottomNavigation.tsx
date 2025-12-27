import { useNavigate } from "react-router-dom";
import { Home, CreditCard, ScanLine, User } from "lucide-react";
import navPlusButton from "@/assets/nav-plus-button.png";

interface BottomNavigationProps {
  activeTab: "home" | "cards" | "scan" | "profile";
}

const BottomNavigation = ({ activeTab }: BottomNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[80px] z-50 flex items-center justify-between px-6 backdrop-blur-md bg-black/80 border-t border-white/5">
      <button
        onClick={() => navigate("/home")}
        className="flex flex-col items-center gap-1 min-w-[60px]"
      >
        <Home
          className={`w-6 h-6 ${
            activeTab === "home" ? "text-[#5260FE]" : "text-white/40"
          }`}
        />
        <span
          className={`text-[11px] font-medium ${
            activeTab === "home" ? "text-[#5260FE]" : "text-white/40"
          }`}
        >
          Home
        </span>
      </button>

      <button
        onClick={() => navigate("/cards")}
        className="flex flex-col items-center gap-1 min-w-[60px]"
      >
        <CreditCard
          className={`w-6 h-6 ${
            activeTab === "cards" ? "text-[#5260FE]" : "text-white/40"
          }`}
        />
        <span
          className={`text-[11px] font-medium ${
            activeTab === "cards" ? "text-[#5260FE]" : "text-white/40"
          }`}
        >
          My Cards
        </span>
      </button>

      {/* Center FAB Space */}
      <div className="w-[60px] relative -top-6">
          <button
            onClick={() => navigate("/camera-page")}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[64px] h-[64px] rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-lg"
            style={{
                backgroundImage: `url(${navPlusButton})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
          >
             {/* FAB Icon or visual is in the bg image */}
          </button>
      </div>

      <button
        onClick={() => navigate("/camera-page")}
        className="flex flex-col items-center gap-1 min-w-[60px]"
      >
        <ScanLine
          className={`w-6 h-6 ${
            activeTab === "scan" ? "text-[#5260FE]" : "text-white/40"
          }`}
        />
        <span
          className={`text-[11px] font-medium ${
            activeTab === "scan" ? "text-[#5260FE]" : "text-white/40"
          }`}
        >
          Scan
        </span>
      </button>

      <button
        onClick={() => navigate("/settings")}
        className="flex flex-col items-center gap-1 min-w-[60px]"
      >
        <User
          className={`w-6 h-6 ${
            activeTab === "profile" ? "text-[#5260FE]" : "text-white/40"
          }`}
        />
        <span
          className={`text-[11px] font-medium ${
            activeTab === "profile" ? "text-[#5260FE]" : "text-white/40"
          }`}
        >
          Profile
        </span>
      </button>
    </div>
  );
};

export default BottomNavigation;
