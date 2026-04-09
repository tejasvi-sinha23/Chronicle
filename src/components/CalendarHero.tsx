import { MONTH_NAMES, MONTH_IMAGES } from "@/lib/calendar-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeroProps {
  year: number;
  month: number;
  isFlipping: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const SEASON_EMOJIS: Record<number, string> = {
  0: "❄️", 1: "❄️", 2: "🌸",
  3: "🌸", 4: "🌿", 5: "☀️",
  6: "☀️", 7: "☀️", 8: "🍂",
  9: "🍂", 10: "🍁", 11: "❄️",
};

export function CalendarHero({ year, month, isFlipping, onPrev, onNext, onToday }: CalendarHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-t-2xl" style={{ perspective: "1200px" }}>
      {/* Hero image */}
      <div
        className={`relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden transition-all duration-500 ${
          isFlipping ? "opacity-0 scale-95 rotate-x-3" : "opacity-100 scale-100 rotate-x-0"
        }`}
      >
        <img
          src={MONTH_IMAGES[month]}
          alt={MONTH_NAMES[month]}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Wave overlay */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ height: "70px" }}
        >
          <path
            d="M0,80 C150,30 350,100 600,55 C850,10 1050,85 1200,45 L1200,120 L0,120 Z"
            fill="hsl(var(--primary))"
            opacity="0.85"
          />
          <path
            d="M0,95 C200,60 400,110 600,80 C800,50 1000,100 1200,70 L1200,120 L0,120 Z"
            fill="hsl(var(--primary))"
            opacity="0.4"
          />
        </svg>

        {/* Month/Year label */}
        <div className="absolute bottom-3 right-4 sm:right-8 z-10 text-right">
          <div className="text-primary-foreground/70 text-sm sm:text-base font-body font-medium tracking-wider flex items-center justify-end gap-2">
            <span>{SEASON_EMOJIS[month]}</span>
            {year}
          </div>
          <h1 className="text-primary-foreground text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-wide uppercase drop-shadow-lg">
            {MONTH_NAMES[month]}
          </h1>
        </div>
      </div>

      {/* Spiral binding */}
      <div className="absolute top-0 left-0 right-0 flex justify-center gap-3 sm:gap-4 -translate-y-1 z-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-5 rounded-full border-2 hidden sm:block"
            style={{
              borderColor: "hsl(var(--calendar-spiral))",
              background: "linear-gradient(to bottom, hsl(var(--card)), hsl(var(--muted)))",
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-4 rounded-full border-2 sm:hidden"
            style={{
              borderColor: "hsl(var(--calendar-spiral))",
              background: "linear-gradient(to bottom, hsl(var(--card)), hsl(var(--muted)))",
            }}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <button
        onClick={onPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-card/70 backdrop-blur-md shadow-lg hover:bg-card transition-all hover:scale-110 active:scale-95 border border-border/30"
        aria-label="Previous month"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2.5 rounded-full bg-card/70 backdrop-blur-md shadow-lg hover:bg-card transition-all hover:scale-110 active:scale-95 border border-border/30"
        aria-label="Next month"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Today button */}
      <button
        onClick={onToday}
        className="absolute top-3 left-3 z-10 px-4 py-1.5 text-xs font-semibold rounded-full bg-card/70 backdrop-blur-md shadow-lg hover:bg-card transition-all text-foreground border border-border/30 hover:scale-105 active:scale-95"
      >
        📍 Today
      </button>
    </div>
  );
}
