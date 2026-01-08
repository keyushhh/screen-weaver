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
  const [isDragging, setIsDragging] = useState(false);

  // Time slots generation
  const generateTimeSlots = (extraTime?: string) => {
    const slots = [];
    const startHour = 6;
    const endHour = 22; // 10 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        let displayHour = hour > 12 ? hour - 12 : hour;
        if (displayHour === 0) displayHour = 12;

        const displayMin = min === 0 ? "00" : min;
        const ampm = hour >= 12 ? "PM" : "AM";

        slots.push(`${displayHour}:${displayMin} ${ampm.toLowerCase()}`);
      }
    }

    // Inject the selected time if it's not in the list (for 15/45 min intervals)
    if (extraTime && !slots.includes(extraTime)) {
        // Need to insert it in the correct order
        // Parse extraTime to minutes from midnight
        const parseTime = (t: string) => {
            const [timeStr, m] = t.split(' ');
            let [h, min] = timeStr.split(':').map(Number);
            if (m.toLowerCase() === 'pm' && h !== 12) h += 12;
            if (m.toLowerCase() === 'am' && h === 12) h = 0;
            return h * 60 + min;
        };
        const extraMinutes = parseTime(extraTime);

        // Find insert index
        let insertIndex = slots.length;
        for (let i = 0; i < slots.length; i++) {
            if (parseTime(slots[i]) > extraMinutes) {
                insertIndex = i;
                break;
            }
        }
        slots.splice(insertIndex, 0, extraTime);
    }

    return slots;
  };

  const allTimeSlots = generateTimeSlots(selectedTime);

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

  // Scroll Sync
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      const index = filteredTimeSlots.indexOf(selectedTime);
      if (index !== -1) {
        // Calculate scroll position to center the item
        // Container height: 111px
        // Item height: ~28px (16px font + 4px gap + padding)
        // Let's approximate center position
        const itemHeight = 28;
        const containerHeight = 111;
        const scrollTop = (index * itemHeight) - (containerHeight / 2) + (itemHeight / 2);

        scrollRef.current.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: "smooth"
        });
      }
    }
  }, [selectedTime, meridiem, filteredTimeSlots]); // Added dependency to re-scroll when list changes

  // Clock Interaction
  const clockRef = useRef<HTMLDivElement>(null);

  const handleClockInteraction = (clientX: number, clientY: number) => {
    if (!clockRef.current) return;
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate angle
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    // atan2 returns -PI to PI. -PI/2 is top (12 o'clock).
    // We want 0 at top.
    // angle in radians + PI/2 -> 0 at top.
    let angleRad = Math.atan2(deltaY, deltaX) + Math.PI / 2;
    if (angleRad < 0) angleRad += 2 * Math.PI;

    // Convert to degrees (0-360)
    const degrees = (angleRad * 180) / Math.PI;

    // Determine nearest 15 minute interval (6 degrees per minute, 15 min = 90 degrees)
    // Wait, 360 deg = 60 min -> 6 deg/min. 15 min = 90 deg.
    // Snap to 15 min = 90 deg steps? No, clock face is 12 hours.
    // Minute hand logic:
    // angle maps to 0-60 minutes.
    const rawMinutes = (degrees / 360) * 60;
    const snappedMinutes = Math.round(rawMinutes / 15) * 15; // 0, 15, 30, 45, 60(0)

    let finalMinutes = snappedMinutes % 60;

    // Determine Hour based on current selected time or drag?
    // User wants to scrub time.
    // If we only update minutes, hour stays same.
    // Let's assume user is modifying minute hand primarily as requested "15 min interval".
    // Getting hour from current state
    const [timePart, mPart] = selectedTime.split(" ");
    let [currentHour] = timePart.split(":").map(Number);

    // If dragging moves past 12, should we increment hour?
    // For simplicity, let's keep hour static unless logic gets complex,
    // OR we can deduce hour from angle if user touches near center?
    // Let's stick to minute modification for the "handle" request,
    // as changing hours via circular drag can be tricky without a mode switch.
    // However, if the user drags near the hour hand, we could switch hour.

    // Distance check
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const radius = rect.width / 2;
    // If distance is < 60% of radius, maybe it's hour hand?
    // Standard UI behavior: usually separate rings or modes.
    // Let's Stick to Minute modification for the "fun 15 min" feature.

    let finalHour = currentHour;

    // Construct new time string
    let displayMin = finalMinutes === 0 ? "00" : finalMinutes.toString();
    // Keep current meridiem unless logic changes it?
    // Let's allow simple minute adjustment within current hour/meridiem.

    const newTime = `${finalHour}:${displayMin} ${mPart}`;
    setSelectedTime(newTime);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
      setIsDragging(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      handleClockInteraction(clientX, clientY);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      handleClockInteraction(clientX, clientY);
  };

  const handleEnd = () => {
      setIsDragging(false);
  };

  // Validation Logic
  const parseTimeMinutes = (t: string) => {
      const [timeStr, m] = t.split(' ');
      let [h, min] = timeStr.split(':').map(Number);
      if (m.toLowerCase() === 'pm' && h !== 12) h += 12;
      if (m.toLowerCase() === 'am' && h === 12) h = 0;
      return h * 60 + min;
  };

  const currentTimeMinutes = parseTimeMinutes(selectedTime);
  const startLimit = 6 * 60; // 6:00 AM
  const endLimit = 22 * 60; // 10:00 PM

  const isInvalidTime = currentTimeMinutes < startLimit || currentTimeMinutes > endLimit;

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
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
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
                <span className={`text-[15px] font-bold transition-colors duration-300 ${isInvalidTime ? 'text-white/30' : 'text-white'}`}>
                    {selectedTime}
                </span>
            </div>

            {/* Inner Container: Clock + Picker */}
            <div
                className="mx-5 rounded-[24px] overflow-hidden backdrop-blur-[24px] border border-white/10 relative transition-colors duration-300"
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
                        ref={clockRef}
                        className="relative w-[120px] h-[120px] rounded-full shrink-0 cursor-pointer touch-none"
                        style={{
                            backgroundImage: `url(${clockBase})`,
                            backgroundSize: 'cover'
                        }}
                        onMouseDown={handleStart}
                        onTouchStart={handleStart}
                    >
                        {/* Pivot */}
                        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 z-20 shadow-sm" />

                        {/* Hour Hand */}
                        <div
                            className="absolute left-1/2 bottom-1/2 w-[2px] bg-white rounded-full origin-bottom z-10 transition-transform duration-100 ease-out"
                            style={{
                                height: '18.5px',
                                transform: `translateX(-50%) rotate(${hourRotation}deg)`
                            }}
                        />

                        {/* Minute Hand */}
                        <div
                            className="absolute left-1/2 bottom-1/2 w-[1px] bg-white rounded-full origin-bottom z-10 transition-transform duration-100 ease-out"
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

            {/* Invalid Time Message */}
            {isInvalidTime && (
                <div className="px-5 pb-4 pt-2 text-center animate-fade-in">
                    <p className="text-[#FF3B30] text-[13px] font-medium">
                        Hey man, even we need rest and sleep!
                    </p>
                </div>
            )}
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
