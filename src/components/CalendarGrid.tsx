import { useMemo } from "react";
import {
  DAY_NAMES,
  getCalendarDays,
  isSameDay,
  isInRange,
  type CalendarDay,
} from "@/lib/calendar-utils";
import { getMoodForDay } from "./MoodTracker";
import type { DateRange } from "@/hooks/useCalendar";
import type { CalendarEvent } from "@/hooks/useEventsStore";
import { cn } from "@/lib/utils";

const MOOD_DOTS = ["🟢", "🔵", "🟡", "🟠", "🔴"];

interface CalendarGridProps {
  year: number;
  month: number;
  range: DateRange;
  isFlipping: boolean;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

export function CalendarGrid({
  year,
  month,
  range,
  isFlipping,
  events,
  onDateClick,
}: CalendarGridProps) {
  const days = useMemo(() => getCalendarDays(year, month), [year, month]);

  return (
    <div
      className={`transition-all duration-300 ${
        isFlipping
          ? "opacity-0 translate-y-2 scale-[0.98]"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={cn(
              "text-center text-[10px] sm:text-xs font-bold py-2.5 font-body tracking-widest uppercase",
              i >= 5
                ? "text-[hsl(var(--calendar-weekend))]"
                : "text-muted-foreground"
            )}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-1" />

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayEvents = day.isCurrentMonth
            ? events.filter((e) => e.day === day.day)
            : [];
          return (
            <DayCell
              key={idx}
              day={day}
              range={range}
              events={dayEvents}
              onClick={() => onDateClick(day.date)}
              index={idx}
            />
          );
        })}
      </div>
    </div>
  );
}

interface DayCellProps {
  day: CalendarDay;
  range: DateRange;
  events: CalendarEvent[];
  onClick: () => void;
  index: number;
}

function DayCell({ day, range, events, onClick, index }: DayCellProps) {
  const { start, end } = range;
  const isStart = start ? isSameDay(day.date, start) : false;
  const isEnd = end ? isSameDay(day.date, end) : false;
  const inRange = isInRange(day.date, start, end) && !isStart && !isEnd;
  const col = index % 7;
  const mood = day.isCurrentMonth ? getMoodForDay(day.date) : undefined;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-200 font-body group",
        !day.isCurrentMonth && "opacity-25",
        day.isCurrentMonth &&
          "hover:bg-[hsl(var(--calendar-hover))] hover:rounded-lg",
        day.isWeekend &&
          day.isCurrentMonth &&
          "text-[hsl(var(--calendar-weekend))] font-medium",
        day.isToday && "font-bold",
        inRange && "bg-[hsl(var(--calendar-selected-range))]",
        (isStart || isEnd) &&
          "bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-primary/90 z-10 scale-105",
        inRange && col === 0 && "rounded-l-lg",
        inRange && col === 6 && "rounded-r-lg"
      )}
      title={day.holiday || undefined}
    >
      {/* Today ring */}
      {day.isToday && !isStart && !isEnd && (
        <span className="absolute inset-1 rounded-xl border-2 border-[hsl(var(--calendar-today))] opacity-60 animate-pulse-glow pointer-events-none" />
      )}

      <span className="relative z-10">{day.day}</span>

      {/* Event color dots */}
      {events.length > 0 && (
        <span className="absolute top-1 right-1 flex gap-0.5 flex-wrap justify-end max-w-[18px]">
          {events.slice(0, 3).map((ev) => (
            <span
              key={ev.id}
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: ev.color }}
              title={ev.name}
            />
          ))}
        </span>
      )}

      {/* Mood dot */}
      {mood !== undefined && (
        <span className="absolute bottom-0.5 right-1 text-[7px] leading-none pointer-events-none">
          {MOOD_DOTS[mood]}
        </span>
      )}

      {/* Holiday dot */}
      {day.holiday && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[hsl(var(--holiday))] opacity-70" />
      )}

      {/* Holiday tooltip */}
      {day.holiday && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-foreground text-card px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-lg">
          {day.holiday}
        </span>
      )}
    </button>
  );
}
