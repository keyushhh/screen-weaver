import { useNavigate } from "react-router-dom";
import navPlusButton from "@/assets/nav-plus-button.png";
import navbarBg from "@/assets/navbar-bg.png";
import navHome from "@/assets/nav-home.svg";
import navHomeInactive from "@/assets/nav-home-inactive.png";
import navCards from "@/assets/nav-cards.svg";
import navCardsActive from "@/assets/nav-cards-active.png";
import navRewards from "@/assets/nav-rewards.svg";
import navMore from "@/assets/nav-more.svg";

type Tab = "home" | "cards" | "rewards" | "more";

interface BottomNavigationProps {
  activeTab: Tab;
}

const BottomNavigation = ({ activeTab }: BottomNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Background */}
      <div
        className="absolute inset-0 h-full"
        style={{
          backgroundImage: `url(${navbarBg})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Floating + Button (FAB) */}
      <button
        className="absolute left-1/2 -translate-x-1/2 z-10
                   w-[76px] h-[76px] rounded-full
                   flex items-center justify-center"
        style={{
          bottom: "-2px",
        }}
      >
        <img
          src={navPlusButton}
          alt="Add"
          className="w-full h-full rounded-full"
        />
      </button>

      {/* Nav Items */}
      <div className="relative px-5 py-3">
        <div className="flex items-end justify-between py-[10px]">
          <button
            onClick={() => navigate("/home")}
            className="flex-col gap-1 flex-1 flex items-center justify-center"
          >
            <img
              src={activeTab === "cards" ? navHomeInactive : navHome}
              alt="Home"
              className="w-6 h-6"
            />
            <span
              className={`text-[10px] ${
                activeTab === "home" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              HOME
            </span>
          </button>

          <button
            onClick={() => navigate("/cards")}
            className="flex-col gap-1 flex-1 flex items-center justify-center"
          >
            <img
              src={activeTab === "cards" ? navCardsActive : navCards}
              alt="Cards"
              className="w-6 h-6"
            />
            <span
              className={`text-[10px] ${
                activeTab === "cards" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              CARDS
            </span>
          </button>

          {/* Spacer for FAB */}
          <div className="flex-1" />

          <button className="flex-col gap-1 flex-1 flex items-center justify-center">
            <img src={navRewards} alt="Rewards" className="w-6 h-6" />
            <span
              className={`text-[10px] ${
                activeTab === "rewards"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              REWARDS
            </span>
          </button>

          <button className="flex-col gap-1 flex-1 flex items-center justify-center">
            <img src={navMore} alt="More" className="w-6 h-6" />
            <span
              className={`text-[10px] ${
                activeTab === "more" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              MORE
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
