import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronDown } from "lucide-react";
import bgDarkMode from "@/assets/bg-dark-mode.png";
import GlassCalendar from "@/components/GlassCalendar";
import timeIcon from "@/assets/time-icon.png";
import clockBase from "@/assets/clock-base.png";

const ScheduleDelivery = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Time state
  const [selectedTime, setSelectedTime] = useState("7:00 am");
  const [isAmPmOpen, setIsAmPmOpen] = useState(false);
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
        if (displayHour === 0) displayHour = 12; // Should not happen with 6am start but safe check

        const displayMin = min === 0 ? "00" : min;
        const ampm = hour >= 12 ? "PM" : "AM";

        slots.push(`${displayHour}:${displayMin} ${ampm.toLowerCase()}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Parse current selected time for clock hands
  const getClockRotation = () => {
    // Parse "7:00 am" -> hour 7, min 0
    const [timePart, amPmPart] = selectedTime.split(" ");
    const [hourStr, minStr] = timePart.split(":");
    let hour = parseInt(hourStr);
    const minute = parseInt(minStr);

    // Adjust hour for calculation (12 should be treated as 0 offset for visual calculation if we want standard 360)
    // But standard clock: 12 is top (0 deg).
    // Hour hand: (hour % 12 + minute/60) * 30
    // Minute hand: minute * 6

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
      // Find index of selected time
      const index = timeSlots.indexOf(selectedTime);
      if (index !== -1) {
        // 5 items visible, item height approx 30px?
        // Let's assume item height is 40px based on visual spacing
        // Center the selected item
        const itemHeight = 32; // refined guess
        // We want selected item in middle (3rd position of 5)
        // offset = index * itemHeight - (containerHeight / 2) + (itemHeight / 2)
        // container is approx 160px?
      }
    }
  }, [selectedTime]);

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

        {/* Time Selection */}
        <div
            className="w-full rounded-[24px] overflow-hidden backdrop-blur-[24px] border border-white/10"
            style={{
                backgroundColor: "rgba(25, 25, 25, 0.30)",
                height: "238px"
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="flex items-center gap-2">
                    <img src={timeIcon} alt="Time" className="w-[22px] h-[22px]" />
                    <span className="text-white text-[15px] font-bold">Time</span>
                </div>
                <span className="text-white text-[15px] font-bold">{selectedTime}</span>
            </div>

            {/* Content: Clock + Picker */}
            <div className="flex items-center justify-between px-8 pt-6">
                {/* Clock Visual */}
                <div
                    className="relative w-[120px] h-[120px] rounded-full"
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

                {/* Time Scroll Picker */}
                <div className="flex items-start gap-4 h-[140px] relative">
                    {/* Time List */}
                    <div
                        className="h-full w-[80px] overflow-y-auto no-scrollbar snap-y snap-mandatory py-[54px]"
                        ref={scrollRef}
                    >
                        {timeSlots.map((time) => {
                            // Extract just the time part for display if needed, or full string
                            // The design shows "7:00 am" styling
                            const isSelected = time === selectedTime;
                            return (
                                <div
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`snap-center h-[32px] flex items-center justify-center cursor-pointer transition-all duration-300 ${isSelected ? 'text-white text-[20px] font-bold' : 'text-white/20 text-[16px] font-medium'}`}
                                >
                                    {time}
                                </div>
                            );
                        })}
                    </div>

                    {/* AM/PM Toggle (Visual mainly based on screenshot, looks like a toggle) */}
                    <div className="flex flex-col gap-1 mt-[40px]">
                        <div className="text-white font-bold text-[14px]">AM</div>
                        <div className="text-white/20 font-medium text-[14px]">PM</div>
                    </div>

                    {/* Selection Highlight Gradient/Overlay could go here if needed */}
                </div>
            </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center px-4">
             <p className="text-white/40 text-[12px] font-normal leading-snug">
                Note: We'll do our best to deliver at your selected time.
                Actual timing may vary slightly based on rider availability.
             </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDelivery;
