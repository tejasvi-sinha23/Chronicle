import { useState, useRef, useEffect } from "react";
import { Plus, StickyNote, CalendarRange, NotebookPen } from "lucide-react";
import type { NoteEntry, DateRange } from "@/hooks/useCalendar";
import { MONTH_NAMES } from "@/lib/calendar-utils";
import { NoteCard } from "./NoteCard";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  /** Notes matching the current selection */
  activeNotes: NoteEntry[];
  /** All notes across all dates */
  allNotes: NoteEntry[];
  hasNotes: boolean;
  range: DateRange;
  month: number;
  year: number;
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
  onClearSelection: () => void;
  /** Restore a date/range selection from a note card click */
  onRestoreSelection: (startISO: string | null, endISO: string | null) => void;
}

export function NotesPanel({
  activeNotes,
  allNotes,
  hasNotes,
  range,
  month,
  year,
  onAdd,
  onDelete,
  onClearSelection,
  onRestoreSelection,
}: NotesPanelProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLInputElement>(null);

  const hasRange = Boolean(range.start && range.end);

  const formatDate = (d: Date) =>
    `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
  };

  const handleNoteCardClick = (note: NoteEntry) => {
    onRestoreSelection(note.startISO, note.endISO);
    // Pre-fill textarea for editing context
    setInput("");
  };

  // Determine which note key is "active" for highlighting
  const activeKey =
    range.start && range.end
      ? `${range.start.toISOString()}_${range.end.toISOString()}`
      : `${year}-${month}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-primary" />
          Notes
        </h2>
        {hasRange && (
          <button
            onClick={onClearSelection}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Range indicator */}
      {hasRange && (
        <div className="flex items-center gap-2 text-xs text-primary font-medium bg-[hsl(var(--calendar-selected-range))] rounded-lg px-3 py-2 animate-scale-in">
          <CalendarRange className="w-3.5 h-3.5 shrink-0" />
          <span>
            {formatDate(range.start!)} — {formatDate(range.end!)}
          </span>
        </div>
      )}

      {/* Add note form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={textareaRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={hasRange ? "Note for selected range..." : "Note for this month..."}
          className="flex-1 text-sm px-3 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-body transition-shadow"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all active:scale-95 shrink-0"
          aria-label="Add note"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      {/* All notes list */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <NotebookPen className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground font-body">
            All Notes
            {hasNotes && (
              <span className="ml-1 text-primary">({allNotes.length})</span>
            )}
          </span>
        </div>

        {/* Scrollable notes list */}
        <div
          className={cn(
            "flex flex-col gap-2 overflow-y-auto pr-0.5",
            allNotes.length > 3 ? "max-h-52" : ""
          )}
        >
          {!hasNotes ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <StickyNote className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-xs text-muted-foreground/60 font-body italic">
                No notes yet — select a date to begin
              </p>
            </div>
          ) : (
            allNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isActive={note.date === activeKey}
                onDelete={onDelete}
                onClick={handleNoteCardClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
