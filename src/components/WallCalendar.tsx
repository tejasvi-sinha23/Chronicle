import { useState, useCallback } from "react";
import { CalendarHero } from "./CalendarHero";
import { CalendarGrid } from "./CalendarGrid";
import { NotesPanel } from "./NotesPanel";
import { MoodTracker } from "./MoodTracker";
import { HolidayCountdown } from "./HolidayCountdown";
import { MiniYearView } from "./MiniYearView";
import { DateRangeStats } from "./DateRangeStats";
import { ThemeToggle } from "./ThemeToggle";
import { EventModal } from "./EventModal";
import { useCalendarState, useNotesStore } from "@/hooks/useCalendar";
import { useEventsStore } from "@/hooks/useEventsStore";
import type { EventColor } from "@/lib/tokens";
import { MONTH_NAMES } from "@/lib/calendar-utils";
import { CalendarPlus, X } from "lucide-react";

export function WallCalendar() {
  const {
    year, month, range, isSelecting, isFlipping,
    goToMonth, handleDayClick, clearSelection,
    goToToday, jumpToMonth, restoreRange,
  } = useCalendarState();

  const { allNotes, activeNotes, hasNotes, addNote, deleteNote } =
    useNotesStore(range, year, month);

  const { addEvent, deleteEvent, getEventsForMonth } = useEventsStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialDay, setModalInitialDay] = useState<number | undefined>(undefined);

  const monthEvents = getEventsForMonth(year, month);

  const handleOpenModal = useCallback((day?: number) => {
    setModalInitialDay(day);
    setIsModalOpen(true);
  }, []);

  const handleModalSave = useCallback(
    (event: { name: string; day: number; color: EventColor }) => {
      addEvent({ ...event, year, month });
    },
    [addEvent, year, month]
  );

  const handleRestoreSelection = useCallback(
    (startISO: string | null, endISO: string | null) => {
      restoreRange(startISO, endISO);
    },
    [restoreRange]
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-display font-semibold text-muted-foreground tracking-widest uppercase">
          Chronicle
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-sm font-body"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            Add Event
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* Calendar card */}
      <div
        className="bg-card rounded-2xl overflow-hidden transition-shadow duration-500"
        style={{
          boxShadow:
            "0 25px 80px -20px hsl(var(--calendar-shadow) / 0.18), 0 10px 30px -15px hsl(var(--calendar-shadow) / 0.12)",
        }}
      >
        <CalendarHero
          year={year}
          month={month}
          isFlipping={isFlipping}
          onPrev={() => goToMonth(-1)}
          onNext={() => goToMonth(1)}
          onToday={goToToday}
        />

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="order-2 lg:order-1 lg:w-72 xl:w-80 border-t lg:border-t-0 lg:border-r border-border/60 p-4 sm:p-5 space-y-5 min-h-[200px] lg:min-h-[380px]">
            <HolidayCountdown />
            <NotesPanel
              activeNotes={activeNotes}
              allNotes={allNotes}
              hasNotes={hasNotes}
              range={range}
              month={month}
              year={year}
              onAdd={addNote}
              onDelete={deleteNote}
              onClearSelection={clearSelection}
              onRestoreSelection={handleRestoreSelection}
            />
            <DateRangeStats range={range} />
            <MoodTracker year={year} month={month} />
            <div>
              <h3 className="text-xs font-semibold font-display text-muted-foreground mb-2 uppercase tracking-wider">
                Quick Jump
              </h3>
              <MiniYearView year={year} currentMonth={month} onMonthClick={jumpToMonth} />
            </div>
          </div>

          {/* Main grid + events */}
          <div className="order-1 lg:order-2 flex-1 p-4 sm:p-5 pb-6 flex flex-col gap-4">
            {isSelecting && (
              <div className="text-xs text-primary font-medium animate-fade-slide-up font-body flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                Select an end date to complete your range
              </div>
            )}

            <CalendarGrid
              year={year}
              month={month}
              range={range}
              isFlipping={isFlipping}
              events={monthEvents}
              onDateClick={handleDayClick}
            />

            {/* This month events list */}
            {monthEvents.length > 0 && (
              <div className="border-t border-border/60 pt-4">
                <h3 className="text-xs font-semibold font-display text-muted-foreground mb-3 uppercase tracking-wider">
                  This Month
                </h3>
                <div className="flex flex-col gap-1.5">
                  {monthEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: ev.color }}
                      />
                      <span className="text-xs font-medium text-foreground font-body flex-1 truncate">
                        {ev.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-body shrink-0">
                        {MONTH_NAMES[ev.month].slice(0, 3)} {ev.day}
                      </span>
                      <button
                        onClick={() => deleteEvent(ev.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all"
                        aria-label={`Delete event ${ev.name}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-5 text-xs text-muted-foreground font-body">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--calendar-today))] shadow-sm" />
          Today
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--holiday))] shadow-sm" />
          Holiday
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-2.5 rounded-sm bg-primary shadow-sm" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-2.5 rounded-sm bg-[hsl(var(--calendar-selected-range))] shadow-sm" />
          In range
        </span>
      </div>

      <p className="text-center text-[10px] text-muted-foreground/50 mt-4 font-body">
        Built with React + TypeScript + Tailwind CSS
      </p>

      <EventModal
        isOpen={isModalOpen}
        year={year}
        month={month}
        initialDay={modalInitialDay}
        onSave={handleModalSave}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
