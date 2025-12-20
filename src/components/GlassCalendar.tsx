import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { getDaysInMonth, startOfMonth, getDay, addMonths, subMonths, setYear } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import calendarBg from "@/assets/calendar-bg.png";
import calendarSelection from "@/assets/calendar-selection.png";
import yearDropdownBg from "@/assets/year-dropdown-bg.png";

interface GlassCalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  onClose?: () => void;
  disableFutureDates?: boolean;
  className?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Generate years from 1920 to current year
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1920 + 1 }, (_, i) => currentYear - i);

export function GlassCalendar({ selected, onSelect, onClose, disableFutureDates = false, className }: GlassCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selected || new Date());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate);
  // getDay returns 0 for Sunday, we need Monday as first day (0)
  const startDay = (getDay(firstDayOfMonth) + 6) % 7;

  // Click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleYearSelect = (selectedYear: number) => {
    setCurrentDate(setYear(currentDate, selectedYear));
    setShowYearDropdown(false);
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(year, month, day);
    // Check if future date is disabled
    if (disableFutureDates && newDate > today) {
      return;
    }
    onSelect?.(newDate);
  };

  const isFutureDate = (day: number) => {
    if (!disableFutureDates) return false;
    const date = new Date(year, month, day);
    return date > today;
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === month &&
      selected.getFullYear() === year
    );
  };

  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div
      ref={calendarRef}
      className={cn(
        "w-[340px] rounded-[20px] p-3 relative overflow-hidden",
        "backdrop-blur-[25.2px]",
        className
      )}
      style={{
        backgroundImage: `url(${calendarBg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Inner content with black 20% opacity fill */}
      <div
        className="rounded-[16px] p-4 relative"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.20)",
        }}
      >
        {/* Header with Month/Year and Navigation */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          {/* Previous Month Button */}
          <button
            onClick={handlePrevMonth}
            className="w-10 h-10 rounded-[10px] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:bg-white/20 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          {/* Month/Year Selector */}
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="flex items-center gap-2 text-white text-lg font-semibold hover:opacity-80 transition-opacity"
          >
            <span>{MONTHS[month]} {year}</span>
            {showYearDropdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Next Month Button */}
          <button
            onClick={handleNextMonth}
            className="w-10 h-10 rounded-[10px] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all hover:bg-white/20 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Year Dropdown */}
        {showYearDropdown && (
          <div
            className="absolute left-1/2 -translate-x-1/2 top-16 z-50 w-[160px] rounded-[16px] overflow-hidden"
            style={{
              backgroundImage: `url(${yearDropdownBg})`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Year header */}
            <div
              className="px-4 py-3 flex items-center justify-between border-b border-black/10 cursor-pointer"
              onClick={() => setShowYearDropdown(false)}
            >
              <span className="text-white text-lg font-semibold">{year}</span>
              <ChevronUp className="w-5 h-5 text-white" />
            </div>
            
            {/* Scrollable year list */}
            <ScrollArea className="h-[220px]">
              <div className="py-1">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => handleYearSelect(y)}
                    className={cn(
                      "w-full px-4 py-2.5 text-left text-lg font-medium transition-colors text-white",
                      y === year
                        ? "bg-[rgba(0,0,0,0.49)]"
                        : "hover:bg-black/20"
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </ScrollArea>
            
            {/* Custom scrollbar indicator */}
            <div className="absolute right-1 top-[52px] bottom-2 w-1 bg-black/30 rounded-full">
              <div className="w-full h-[60px] bg-blue-500 rounded-full" />
            </div>
          </div>
        )}

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2 relative z-10">
          {DAYS.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-white/60 text-xs font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 relative z-10">
          {calendarDays.map((day, index) => (
            <div key={index} className="aspect-square flex items-center justify-center">
              {day !== null ? (
                <button
                  onClick={() => handleDayClick(day)}
                  disabled={isFutureDate(day)}
                  className={cn(
                    "w-10 h-10 rounded-[10px] flex items-center justify-center text-base font-medium transition-all",
                    isFutureDate(day)
                      ? "text-white/30 cursor-not-allowed"
                      : "text-white",
                    !isSelected(day) && !isFutureDate(day) && "hover:bg-white/10 active:scale-95"
                  )}
                  style={isSelected(day) ? {
                    backgroundImage: `url(${calendarSelection})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                  } : undefined}
                >
                  {day}
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GlassCalendar;
