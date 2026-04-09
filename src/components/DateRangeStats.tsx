import type { DateRange } from "@/hooks/useCalendar";
import { Calendar, Clock, Sun } from "lucide-react";

interface DateRangeStatsProps {
  range: DateRange;
}

export function DateRangeStats({ range }: DateRangeStatsProps) {
  if (!range.start || !range.end) return null;

  const start = range.start.getTime();
  const end = range.end.getTime();
  const diffMs = Math.abs(end - start);
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  // Count weekends
  const s = new Date(Math.min(start, end));
  let weekends = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date(s);
    d.setDate(d.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) weekends++;
  }
  const workdays = days - weekends;

  return (
    <div className="grid grid-cols-3 gap-2 animate-scale-in">
      <div className="flex flex-col items-center py-2 px-1 rounded-lg bg-muted/50">
        <Calendar className="w-3.5 h-3.5 text-primary mb-1" />
        <span className="text-lg font-bold text-foreground font-display">{days}</span>
        <span className="text-[10px] text-muted-foreground font-body">days</span>
      </div>
      <div className="flex flex-col items-center py-2 px-1 rounded-lg bg-muted/50">
        <Clock className="w-3.5 h-3.5 text-primary mb-1" />
        <span className="text-lg font-bold text-foreground font-display">{workdays}</span>
        <span className="text-[10px] text-muted-foreground font-body">workdays</span>
      </div>
      <div className="flex flex-col items-center py-2 px-1 rounded-lg bg-muted/50">
        <Sun className="w-3.5 h-3.5 text-primary mb-1" />
        <span className="text-lg font-bold text-foreground font-display">{weekends}</span>
        <span className="text-[10px] text-muted-foreground font-body">weekends</span>
      </div>
    </div>
  );
}
