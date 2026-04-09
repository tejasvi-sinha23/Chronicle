import { MONTH_NAMES } from "@/lib/calendar-utils";
import { cn } from "@/lib/utils";

interface MiniYearViewProps {
  year: number;
  currentMonth: number;
  onMonthClick: (month: number) => void;
}

export function MiniYearView({ year, currentMonth, onMonthClick }: MiniYearViewProps) {
  const today = new Date();

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {MONTH_NAMES.map((name, i) => {
        const isActive = i === currentMonth;
        const isCurrent = i === today.getMonth() && year === today.getFullYear();
        return (
          <button
            key={i}
            onClick={() => onMonthClick(i)}
            className={cn(
              "text-[10px] py-1.5 px-1 rounded-md font-body font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted text-muted-foreground hover:text-foreground",
              isCurrent && !isActive && "ring-1 ring-primary/40 text-primary"
            )}
          >
            {name.slice(0, 3)}
          </button>
        );
      })}
    </div>
  );
}
