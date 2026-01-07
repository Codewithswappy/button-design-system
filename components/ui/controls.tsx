import React from "react";
import { cn } from "@/lib/types";
import { ChevronRight, ChevronDown } from "lucide-react";

// --- Primitives ---

export const Label = ({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn(
      "text-[10px] uppercase tracking-wider font-bold text-zinc-500 select-none",
      className
    )}
    {...props}
  >
    {children}
  </label>
);

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, disabled, ...props }, ref) => (
  <input
    ref={ref}
    disabled={disabled}
    className={cn(
      "flex h-7 w-full rounded-[6px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-2 py-1 text-xs text-zinc-900 dark:text-zinc-200 shadow-sm transition-colors",
      "placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6B6B] focus-visible:border-[#FF6B6B]",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Slider = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className="relative flex w-full touch-none select-none items-center group">
    <input
      type="range"
      ref={ref}
      className={cn(
        "h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer",
        "accent-[#FF6B6B] hover:accent-[#ff5252] transition-all",
        // Thumb Styling
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_1px_3px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:border-[4px] [&::-webkit-slider-thumb]:border-[#FF6B6B] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110",
        "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[4px] [&::-moz-range-thumb]:border-[#FF6B6B]",
        className
      )}
      {...props}
    />
  </div>
));
Slider.displayName = "Slider";

// --- Complex Controls ---

export const ControlRow = ({
  label,
  children,
  className,
  compact,
}: {
  label?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}) => (
  <div
    className={cn(
      "flex items-center justify-between gap-3 text-sm min-h-[32px] group",
      className
    )}
  >
    {label && (
      <span
        className={cn(
          "text-zinc-500 dark:text-zinc-400 text-xs font-medium group-hover:text-zinc-800 dark:group-hover:text-zinc-300 transition-colors shrink-0 truncate",
          compact ? "w-auto min-w-[32px]" : "w-[90px]"
        )}
      >
        {label}
      </span>
    )}
    <div className="flex-1 flex justify-end items-center min-w-0">
      {children}
    </div>
  </div>
);

export const Section = ({
  title,
  children,
  defaultOpen = true,
  className,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        "border-b border-zinc-200 dark:border-zinc-900/50 py-2",
        className
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 px-1 text-left hover:bg-zinc-100 dark:hover:bg-zinc-900/50 rounded transition-colors group"
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-500 group-hover:text-[#FF6B6B] dark:group-hover:text-zinc-300 transition-colors">
          {title}
        </span>
        <span className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>
      {isOpen && (
        <div className="space-y-4 px-1 py-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export const ColorPicker = ({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative group overflow-hidden w-6 h-6 rounded-full shadow-sm ring-1 ring-inset ring-zinc-200 dark:ring-zinc-800 cursor-pointer">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer opacity-0"
        />
        <div className="w-full h-full" style={{ backgroundColor: value }} />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[72px] font-mono text-[10px] h-6 uppercase tracking-wider"
      />
    </div>
  );
};

export const Select = ({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative w-full">
    <select
      className={cn(
        "flex h-7 w-full appearance-none items-center justify-between rounded-[6px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-2 py-1 text-xs text-zinc-900 dark:text-zinc-300 shadow-sm ring-offset-white dark:ring-offset-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B6B] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2 top-2 h-3 w-3 text-zinc-400 pointer-events-none" />
  </div>
);

export const Toggle = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <button
    onClick={() => onChange(!value)}
    className={cn(
      "relative h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700",
      value
        ? "bg-[#FF6B6B]"
        : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
    )}
  >
    <span
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out",
        value ? "translate-x-4" : "translate-x-0"
      )}
    />
  </button>
);

export const SegmentedControl = <T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: { label: React.ReactNode; value: T }[];
  onChange: (value: T) => void;
  className?: string;
}) => (
  <div
    className={cn(
      "flex w-full rounded-[8px] bg-zinc-100 dark:bg-zinc-900 p-0.5 border border-zinc-200 dark:border-zinc-800",
      className
    )}
  >
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={cn(
          "flex-1 text-[11px] font-medium py-1.5 px-2 rounded-[6px] transition-all duration-200 relative z-10",
          value === opt.value
            ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
            : "text-zinc-500 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export const Tabs = <T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  className?: string;
}) => (
  <div
    className={cn(
      "flex w-full border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950",
      className
    )}
  >
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={cn(
          "flex-1 text-xs font-semibold py-3 px-2 relative transition-colors",
          value === opt.value
            ? "text-[#FF6B6B]"
            : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
        )}
      >
        {opt.label}
        {value === opt.value && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B6B]" />
        )}
      </button>
    ))}
  </div>
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "default" | "sm" | "xs" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-[6px] text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "default" &&
            "bg-zinc-900 text-white shadow hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
          variant === "outline" &&
            "border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800",
          variant === "ghost" &&
            "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
          variant === "secondary" &&
            "bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
          variant === "destructive" &&
            "bg-red-500 text-white shadow-sm hover:bg-red-600 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/90",

          // Sizes
          size === "default" && "h-8 px-4",
          size === "sm" && "h-7 rounded px-3 text-xs",
          size === "xs" && "h-6 rounded px-2 text-[10px]",
          size === "lg" && "h-10 rounded px-8",
          size === "icon" && "h-8 w-8 p-0",

          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const SliderInput = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  className,
}: {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
}) => (
  <div className={cn("flex items-center gap-3 w-full", className)}>
    <Slider
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="flex-1"
    />
    <Input
      type="number"
      value={value}
      onChange={(e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val)) onChange(val);
      }}
      className="w-12 h-7 text-right font-mono text-[10px] p-1 bg-transparent border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:border-[#FF6B6B] transition-all rounded shadow-none"
    />
  </div>
);
