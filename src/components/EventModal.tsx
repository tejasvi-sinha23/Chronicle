import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { EVENT_COLORS, TOKENS } from "@/lib/tokens";
import type { EventColor } from "@/lib/tokens";
import { cn } from "@/lib/utils";

interface EventModalProps {
  isOpen: boolean;
  year: number;
  month: number;
  /** Pre-selected day (e.g. from clicking a day cell) */
  initialDay?: number;
  onSave: (event: { name: string; day: number; color: EventColor }) => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function EventModal({
  isOpen,
  year,
  month,
  initialDay,
  onSave,
  onClose,
}: EventModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [eventName, setEventName] = useState("");
  const [selectedDay, setSelectedDay] = useState<number>(initialDay ?? 1);
  const [selectedColor, setSelectedColor] = useState<EventColor>(EVENT_COLORS[0].value);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const daysInMonth = getDaysInMonth(year, month);

  // Sync initialDay when it changes
  useEffect(() => {
    if (initialDay !== undefined) setSelectedDay(initialDay);
  }, [initialDay]);

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      setIsAnimatingOut(false);
      setIsVisible(true);
      // Reset form
      setEventName("");
      setSelectedColor(EVENT_COLORS[0].value);
      setTimeout(() => nameInputRef.current?.focus(), 50);
    } else if (isVisible) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimatingOut(false);
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSave = useCallback(() => {
    if (!eventName.trim()) return;
    onSave({ name: eventName.trim(), day: selectedDay, color: selectedColor });
    onClose();
  }, [eventName, selectedDay, selectedColor, onSave, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSave();
      if (e.key === "Escape") onClose();
    },
    [handleSave, onClose]
  );

  if (!isVisible) return null;

  return (
    // Backdrop
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        isAnimatingOut ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in"
      )}
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Add event"
    >
      {/* Modal panel */}
      <div
        className={cn(
          "relative w-full max-w-sm bg-card rounded-2xl shadow-2xl border border-border/60 p-6",
          isAnimatingOut ? "animate-modal-out" : "animate-modal-in"
        )}
        onKeyDown={handleKeyDown}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-display text-xl font-semibold text-foreground mb-5">
          Add Event
        </h2>

        {/* Event name */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 font-body">
            Event Name
          </label>
          <input
            ref={nameInputRef}
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g. Team meeting"
            maxLength={60}
            className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body transition-shadow"
          />
        </div>

        {/* Day picker */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 font-body">
            Day — {MONTH_NAMES[month]} {year}
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="w-full text-sm px-3 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body cursor-pointer"
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {MONTH_NAMES[month]} {d}
              </option>
            ))}
          </select>
        </div>

        {/* Color picker */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 font-body">
            Color
          </label>
          <div className="flex gap-2.5 flex-wrap">
            {EVENT_COLORS.map((swatch) => (
              <button
                key={swatch.value}
                onClick={() => setSelectedColor(swatch.value)}
                title={swatch.label}
                className={cn(
                  "w-7 h-7 rounded-full transition-all duration-150 hover:scale-110 active:scale-95",
                  selectedColor === swatch.value
                    ? "ring-2 ring-offset-2 ring-offset-card scale-110 shadow-md"
                    : "opacity-70 hover:opacity-100"
                )}
                style={{
                  backgroundColor: swatch.value,
                  ringColor: swatch.value,
                  // ring color via outline for cross-browser
                  outline: selectedColor === swatch.value ? `2px solid ${swatch.value}` : "none",
                  outlineOffset: "3px",
                }}
                aria-label={swatch.label}
                aria-pressed={selectedColor === swatch.value}
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-body"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!eventName.trim()}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] font-body shadow-sm"
          >
            Save Event
          </button>
        </div>
      </div>
    </div>
  );
}
