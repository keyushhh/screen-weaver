import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import GlassCalendar from "@/components/GlassCalendar";
import timeIcon from "@/assets/time-icon.png";
import clockBase from "@/assets/clock-base.png";

const ScheduleDelivery = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Time state
  const [selectedTime, setSelectedTime] = useState("7:00 am");
  const [meridiem, setMeridiem] = useState<"AM" | "PM">("AM");

  // Time slots generation
  const generateTimeSlots = () => {
    const slots = [];
    // 6:00 AM to 10:00 PM
    const startHour = 6;
    const endHour = 22; // 10 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        // Format time
        let displayHour = hour > 12 ? hour - 12 : hour;
        if (displayHour === 0) displayHour = 12;

        const displayMin = min === 0 ? "00" : min;
        const ampm = hour >= 12 ? "PM" : "AM";

        slots.push(`${displayHour}:${displayMin} ${ampm.toLowerCase()}`);
      }
    }
    return slots;
  };

  const allTimeSlots = generateTimeSlots();

  // Filter slots based on selected meridiem
  const filteredTimeSlots = allTimeSlots.filter(time =>
    time.toLowerCase().includes(meridiem.toLowerCase())
  );

  // Parse current selected time for clock hands
  const getClockRotation = () => {
    const [timePart] = selectedTime.split(" ");
    const [hourStr, minStr] = timePart.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minStr);

    const hourRotation = ((hour % 12) + minute / 60) * 30;
    const minuteRotation = minute * 6;

    return { hourRotation, minuteRotation };
  };

  const { hourRotation, minuteRotation } = getClockRotation();

  // Handle scroll for time picker
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to selected time on mount/change
  useEffect(() => {
    if (scrollRef.current) {
      const index = filteredTimeSlots.indexOf(selectedTime);
      if (index !== -1) {
        // Scroll logic to center the element
        // Item height (16px font + line height + 4px gap) ~ roughly 24-28px
        // Better to just rely on user interaction or simple scroll into view if needed
        // For now, leaving auto-scroll logic basic or manual
      }
    }
  }, [selectedTime, meridiem]);

  return (
    <div
      className="h-full w-full overflow-hidden flex flex-col font-sans"
      style={{
        backgroundColor: "#0a0a12",
        backgroundImage: `url(${bgDarkMode})`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header */}
      <div className="flex-none px-5 pt-4 flex items-center justify-between z-10 mb-6 safe-area-top">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md relative z-20 border border-white/10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white text-[18px] font-medium">
          Schedule Delivery
        </h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto px-5 no-scrollbar pb-[100px]">
        {/* Sub-header */}
        <div className="mb-6">
            <p className="text-white text-[16px] font-medium mb-1">
                Want more flexibility?
            </p>
            <p className="text-white/60 text-[14px] font-normal leading-tight">
                Schedule your delivery for later and pick a time-slot that suits you the best.
            </p>
        </div>

        {/* Calendar */}
        <div className="mb-5 flex justify-center">
            <GlassCalendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                disablePastDates={true}
                className="w-full"
            />
        </div>

        {/* Time Selection Container */}
        <div
            className="w-full rounded-[24px] overflow-hidden backdrop-blur-[24px] border border-white/10"
            style={{
                backgroundColor: "rgba(25, 25, 25, 0.30)",
                paddingBottom: "24px"
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2">
                    <img src={timeIcon} alt="Time" className="w-[22px] h-[22px]" />
                    <span className="text-white text-[15px] font-bold">Time</span>
                </div>
                <span className="text-white text-[15px] font-bold">{selectedTime}</span>
            </div>

            {/* Inner Container: Clock + Picker */}
            <div
                className="mx-5 rounded-[24px] overflow-hidden backdrop-blur-[24px] border border-white/10 relative"
                style={{
                    backgroundColor: "#0E0E0F",
                    height: "150px"
                }}
            >
                {/* AM/PM Switch - Absolute Positioned Top Right */}
                <div className="absolute top-[9px] right-[10px] flex flex-col items-center z-20">
                    <button
                        onClick={() => setMeridiem("AM")}
                        className={`text-[12px] font-bold transition-opacity ${meridiem === "AM" ? "text-white opacity-100" : "text-white opacity-50"}`}
                    >
                        AM
                    </button>
                    <div className="h-[1px] w-[30px] bg-[#2D2D30] my-[4px]" />
                    <button
                        onClick={() => setMeridiem("PM")}
                        className={`text-[12px] font-bold transition-opacity ${meridiem === "PM" ? "text-white opacity-100" : "text-white opacity-50"}`}
                    >
                        PM
                    </button>
                </div>

                {/* Content */}
                <div className="flex items-center justify-between pl-8 pr-16 h-full">
                    {/* Clock Visual */}
                    <div
                        className="relative w-[120px] h-[120px] rounded-full shrink-0"
                        style={{
                            backgroundImage: `url(${clockBase})`,
                            backgroundSize: 'cover'
                        }}
                    >
                        {/* Pivot */}
                        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-sm" />

                        {/* Hour Hand */}
                        <div
                            className="absolute left-1/2 bottom-1/2 w-[2px] bg-white rounded-full origin-bottom z-10"
                            style={{
                                height: '18.5px',
                                transform: `translateX(-50%) rotate(${hourRotation}deg)`
                            }}
                        />

                        {/* Minute Hand */}
                        <div
                            className="absolute left-1/2 bottom-1/2 w-[1px] bg-white rounded-full origin-bottom z-10"
                            style={{
                                height: '34px',
                                transform: `translateX(-50%) rotate(${minuteRotation}deg)`
                            }}
                        />
                    </div>

                    {/* Time List Container */}
                    <div className="relative h-[111px] w-[90px] shrink-0">
                         {/* Top Fade */}
                        <div
                            className="absolute top-0 left-0 right-0 h-[30px] z-10 pointer-events-none"
                            style={{
                                background: 'linear-gradient(180deg, #0E0E0F 0%, rgba(14, 14, 15, 0) 100%)'
                            }}
                        />

                        {/* List */}
                        <div
                            className="h-full overflow-y-auto no-scrollbar flex flex-col gap-[4px] py-[10px]"
                            ref={scrollRef}
                        >
                            {filteredTimeSlots.map((time) => {
                                const isSelected = time === selectedTime;
                                return (
                                    <div
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`flex-none text-center cursor-pointer whitespace-nowrap transition-all duration-200 text-[16px] font-bold font-sans ${isSelected ? 'text-white' : 'text-white/40'}`}
                                    >
                                        {time}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom Fade */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-[30px] z-10 pointer-events-none"
                            style={{
                                background: 'linear-gradient(0deg, #0E0E0F 0%, rgba(14, 14, 15, 0) 100%)'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-left px-1">
             <p className="text-white text-[14px] font-normal font-sans leading-snug">
                Note: We'll do our best to deliver at your selected time. Actual timing may vary slightly based on rider availability.
             </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDelivery;
