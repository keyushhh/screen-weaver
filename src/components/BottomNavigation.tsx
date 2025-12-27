import { useNavigate } from "react-router-dom";
import navPlusButton from "@/assets/nav-plus-button.png";
import navHome from "@/assets/nav-home.svg";
import navHomeInactive from "@/assets/nav-home-inactive.png";
import navCards from "@/assets/nav-cards.svg";
import navCardsActive from "@/assets/nav-cards-active.png";
import navRewards from "@/assets/nav-rewards.svg";
import navMore from "@/assets/nav-more.svg";

interface BottomNavigationProps {
  activeTab: "home" | "cards" | "rewards" | "more";
}

const BottomNavigation = ({ activeTab }: BottomNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[80px] z-50 flex items-center justify-between px-6 backdrop-blur-md bg-black/80 border-t border-white/5">
      {/* Home */}
      <button
        onClick={() => navigate("/home")}
        className="flex flex-col items-center gap-1 min-w-[60px]"
      >
        <img
            src={activeTab === "home" ? navHome : navHomeInactive}
            alt="Home"
            className="w-6 h-6 object-contain"
        />
        <span
          className={`text-[11px] font-medium ${
            activeTab === "home" ? "text-[#5260FE]" : "text-white/40"
          }`}
        >
          Home
        </span>
      </button>

      {/* Cards */}
      <button
        onClick={() => navigate("/cards")}
        className="flex flex-col items-center gap-1 min-w-[60px]"
      >
        <img
            src={activeTab === "cards" ? navCardsActive : navCards}
            alt="Cards"
            className="w-6 h-6 object-contain"
        />
        <span
          className={`text-[11px] font-medium ${
            activeTab === "cards" ? "text-[#5260FE]" : "text-white/40"
          }`}
        >
          Cards
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
          </button>
      </div>

      {/* Rewards */}
      <button
        // Assuming rewards route exists or does nothing for now
        className="flex flex-col items-center gap-1 min-w-[60px]"
      >
        <img
            src={navRewards}
            alt="Rewards"
            className={`w-6 h-6 object-contain ${activeTab === "rewards" ? "" : "opacity-40 grayscale"}`}
        />
        <span
          className={`text-[11px] font-medium ${
            activeTab === "rewards" ? "text-[#5260FE]" : "text-white/40"
          }`}
        >
          Rewards
        </span>
      </button>

      {/* More */}
      <button
        // Assuming more route exists or does nothing for now
        className="flex flex-col items-center gap-1 min-w-[60px]"
      >
        <img
            src={navMore}
            alt="More"
            className={`w-6 h-6 object-contain ${activeTab === "more" ? "" : "opacity-40 grayscale"}`}
        />
        <span
          className={`text-[11px] font-medium ${
            activeTab === "more" ? "text-[#5260FE]" : "text-white/40"
          }`}
        >
          More
        </span>
      </button>
    </div>
  );
};

export default BottomNavigation;
