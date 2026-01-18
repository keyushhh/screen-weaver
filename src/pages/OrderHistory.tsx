import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import searchIcon from "@/assets/search.svg";
import refreshIcon from "@/assets/refresh.svg";
import processingIcon from "@/assets/processing.svg";
import successIcon from "@/assets/success.svg";
import failedIcon from "@/assets/failed.svg";
import checkIcon from "@/assets/check.svg";
import crossIcon from "@/assets/cross.svg";
import { supabase } from "@/lib/supabase";
import { fetchActiveOrders, fetchRecentOrders, Order } from "@/lib/orders";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecentOrders, setFilteredRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          // Fetch Active Orders
          const active = await fetchActiveOrders(session.user.id);
          setActiveOrders(active);

          // Fetch Recent Orders (limit to more than 5 for history page, ideally all, but let's stick to fetchRecentOrders logic for now or create a new fetchAllHistory if needed.
          // Re-using fetchRecentOrders which limits to 5. For a full history page we might want more.
          // Let's assume for now 5 is enough or I'll query more manually here.)

          const { data, error } = await supabase
            .from('orders')
            .select('*, addresses(*)')
            .eq('user_id', session.user.id)
            .neq('status', 'processing') // Exclude active/processing from recent list
            .order('created_at', { ascending: false });

          if (!error && data) {
              setRecentOrders(data as Order[]);
              setFilteredRecentOrders(data as Order[]);
          }
        } catch (e) {
          console.error("Failed to load order history", e);
        }
      }
    };
    loadOrders();
  }, []);

  // Search Logic
  useEffect(() => {
    if (!searchQuery) {
      setFilteredRecentOrders(recentOrders);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = recentOrders.filter(order => {
      const amountStr = order.amount.toString();
      const date = new Date(order.created_at);
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toLowerCase();
      const monthStr = date.toLocaleDateString('en-US', { month: 'long' }).toLowerCase();

      return amountStr.includes(query) ||
             dateStr.includes(query) ||
             monthStr.includes(query);
    });
    setFilteredRecentOrders(filtered);
  }, [searchQuery, recentOrders]);


  // Helper for formatting date/time
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (isToday) {
        return `Today | ${timeStr}`;
    } else {
        return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} | ${timeStr}`;
    }
  };

  // Helper for status styles
  const getStatusConfig = (status: string) => {
      const s = status.toLowerCase();
      if (s === 'processing') {
          return {
              color: '#FACC15',
              bgOpacity: 0.21,
              icon: processingIcon,
              statusIcon: refreshIcon,
              label: 'Processing'
          };
      } else if (s === 'success' || s === 'delivered') { // Assuming 'delivered' maps to success UI
          return {
              color: '#1CB956',
              bgOpacity: 0.21,
              icon: successIcon,
              statusIcon: checkIcon,
              label: 'Success'
          };
      } else if (s === 'failed') {
          return {
              color: '#FF1E1E',
              bgOpacity: 0.21,
              icon: failedIcon,
              statusIcon: crossIcon, // Using cross for failed
              label: 'Failed'
          };
      } else if (s === 'cancelled') {
           return {
              color: '#FF1E1E',
              bgOpacity: 0.21,
              icon: failedIcon, // Using failed icon for cancelled as per instruction ("icons will be updated from 'processing' icon to 'failed' icon")
              statusIcon: crossIcon,
              label: 'Cancelled'
          };
      }
      // Default fallback
      return {
          color: '#FFFFFF',
          bgOpacity: 0.1,
          icon: processingIcon,
          statusIcon: refreshIcon,
          label: status
      };
  };

  const renderOrderCard = (order: Order, isActive: boolean) => {
      const config = getStatusConfig(isActive ? 'processing' : order.status);

      return (
        <div
            key={order.id}
            className="w-full rounded-[13px] overflow-hidden mb-[16px] cursor-pointer active:opacity-90 transition-opacity"
            onClick={() => navigate(`/order-details/${order.id}`, { state: { order } })}
        >
            {/* Top Container */}
            <div className="w-full h-[25px] flex items-center px-[18px] relative overflow-hidden">
                 <div
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundColor: config.color,
                        opacity: config.bgOpacity
                    }}
                 />
                 <div className="relative z-10 flex items-center mt-[2px]">
                     <img src={config.statusIcon} alt="" className="w-3 h-3 mr-[4px]" />
                     <span
                        className="text-[12px] font-bold font-satoshi"
                        style={{ color: config.color }}
                     >
                         {config.label}
                     </span>
                 </div>
            </div>

            {/* Main Content Container */}
            <div
                className="w-full relative"
                style={{
                    height: '67px',
                    backgroundColor: '#000000',
                }}
            >
                <div className="flex items-start justify-between py-[14px] pl-[16px] pr-[14px]">
                    <div className="flex items-start gap-[16px]">
                         <img src={config.icon} alt={config.label} className="w-[35px] h-[35px]" />
                         <div className="flex flex-col">
                             <span className="text-white text-[16px] font-regular font-satoshi leading-none">
                                 {order.addresses?.label ? `Order to ${order.addresses.label}` : "Cash Order"}
                             </span>
                             <span className="text-white text-[12px] font-medium font-satoshi mt-1">
                                 {formatDateTime(order.created_at)}
                             </span>
                         </div>
                    </div>

                    {/* Amount - Center aligned with content on left?
                        "centre aligned with the content on the left side"
                        Flex 'items-center' on the parent row handles vertical centering.
                    */}
                    <div className="h-[35px] flex items-center">
                        <span className="text-white text-[16px] font-medium font-satoshi">
                            ₹{order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
      );
  };

  return (
    <div
      className="h-full w-full overflow-y-auto flex flex-col safe-area-top"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-4 flex items-center relative mb-[26px]">
        <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 active:bg-white/10 absolute left-5"
        >
            <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="w-full text-center text-white text-[18px] font-medium font-sans">
            Order History
        </h1>
      </div>

      {/* Search Bar */}
      <div className="px-5 mb-[38px]">
          <div className="w-full h-[48px] rounded-full bg-white/5 border border-white/10 flex items-center px-[10px]">
              <div className="w-[16px] h-[16px] ml-[6px] mr-[16px] flex items-center justify-center">
                  <img src={searchIcon} alt="Search" className="w-full h-full" />
              </div>
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your orders: “₹2000”, “july”, etc..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-[14px] font-satoshi placeholder:text-white/40"
              />
          </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
          <div className="px-5 mb-[35px]">
              <h2 className="text-white text-[16px] font-bold font-satoshi mb-[12px]">
                  Active orders
              </h2>
              {activeOrders.map(order => renderOrderCard(order, true))}
          </div>
      )}

      {/* Recent Orders */}
      {filteredRecentOrders.length > 0 && (
          <div className="px-5 pb-10">
              <h2 className="text-white text-[16px] font-bold font-satoshi mb-[12px]">
                  Recent orders
              </h2>
              {filteredRecentOrders.map(order => renderOrderCard(order, false))}
          </div>
      )}

    </div>
  );
};

export default OrderHistory;
