import { useState } from "react";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const PhoneInput = ({
  value,
  onChange,
  countryCode = "+91",
  placeholder = "Enter your mobile number",
  className,
  error,
}: PhoneInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = e.target.value.replace(/\D/g, "");
    onChange(numericValue);
  };

  return (
    <div
      className={cn(
        "flex items-center h-14 rounded-2xl input-surface transition-all duration-200 border border-transparent",
        isFocused && !error && "ring-2 ring-primary/50 border-primary/50",
        error && "border-red-500 ring-1 ring-red-500",
        className
      )}
    >
      <div className="flex items-center px-4 border-r border-border/50">
        <span className="text-muted-foreground font-medium text-base">
          {countryCode}
        </span>
      </div>
      <input
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 h-full bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
        maxLength={10}
      />
    </div>
  );
};
