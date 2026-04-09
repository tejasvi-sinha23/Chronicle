import { useState, useCallback, useEffect } from "react";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface NoteEntry {
  id: string;
  text: string;
  /** Key encoding the date or range this note belongs to */
  date: string;
  /** Human-readable label for display, e.g. "Apr 12" or "Apr 5 → Apr 10" */
  label: string;
  /** ISO string of start date for click-to-select restoration */
  startISO: string | null;
  /** ISO string of end date for click-to-select restoration */
  endISO: string | null;
  createdAt: number;
}

const NOTES_KEY = "chronicle_notes_v1";

function loadNotes(): NoteEntry[] {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistNotes(notes: NoteEntry[]) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function formatNoteLabel(
  range: DateRange,
  year: number,
  month: number
): string {
  const MONTH_SHORT = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];
  if (range.start && range.end) {
    const s = range.start;
    const e = range.end;
    const sLabel = `${MONTH_SHORT[s.getMonth()]} ${s.getDate()}`;
    const eLabel = `${MONTH_SHORT[e.getMonth()]} ${e.getDate()}`;
    return `${sLabel} → ${eLabel}`;
  }
  return `${MONTH_SHORT[month]} ${year}`;
}

function buildNoteKey(range: DateRange, year: number, month: number): string {
  if (range.start && range.end) {
    return `${range.start.toISOString()}_${range.end.toISOString()}`;
  }
  return `${year}-${month}`;
}

export function useCalendarState() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [isSelecting, setIsSelecting] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const goToMonth = useCallback((dir: 1 | -1) => {
    setIsFlipping(true);
    setTimeout(() => {
      setMonth((prev) => {
        let next = prev + dir;
        if (next < 0) { setYear((y) => y - 1); return 11; }
        if (next > 11) { setYear((y) => y + 1); return 0; }
        return next;
      });
      setTimeout(() => setIsFlipping(false), 50);
    }, 200);
  }, []);

  const handleDayClick = useCallback((date: Date) => {
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        setIsSelecting(true);
        return { start: date, end: null };
      }
      setIsSelecting(false);
      return { ...prev, end: date };
    });
  }, []);

  const clearSelection = useCallback(() => {
    setRange({ start: null, end: null });
    setIsSelecting(false);
  }, []);

  const goToToday = useCallback(() => {
    const t = new Date();
    setIsFlipping(true);
    setTimeout(() => {
      setYear(t.getFullYear());
      setMonth(t.getMonth());
      setTimeout(() => setIsFlipping(false), 50);
    }, 200);
  }, []);

  const jumpToMonth = useCallback((m: number) => {
    setIsFlipping(true);
    setTimeout(() => {
      setMonth(m);
      setTimeout(() => setIsFlipping(false), 50);
    }, 200);
  }, []);

  const restoreRange = useCallback((startISO: string | null, endISO: string | null) => {
    if (!startISO) {
      setRange({ start: null, end: null });
      setIsSelecting(false);
      return;
    }
    const start = new Date(startISO);
    const end = endISO ? new Date(endISO) : null;
    setRange({ start, end });
    setIsSelecting(false);
    // Navigate to the month of the start date
    setYear(start.getFullYear());
    setMonth(start.getMonth());
  }, []);

  return {
    year, month, range, isSelecting, isFlipping,
    goToMonth, handleDayClick, clearSelection,
    goToToday, jumpToMonth, restoreRange,
  };
}

export function useNotesStore(range: DateRange, year: number, month: number) {
  const [notes, setNotes] = useState<NoteEntry[]>(loadNotes);

  useEffect(() => {
    persistNotes(notes);
  }, [notes]);

  const noteKey = buildNoteKey(range, year, month);
  const noteLabel = formatNoteLabel(range, year, month);

  /** Notes matching the current selection */
  const activeNotes = notes.filter((n) => n.date === noteKey);
  const hasNotes = notes.length > 0;

  const addNote = useCallback(
    (text: string) => {
      const entry: NoteEntry = {
        id: crypto.randomUUID(),
        text,
        date: noteKey,
        label: noteLabel,
        startISO: range.start ? range.start.toISOString() : null,
        endISO: range.end ? range.end.toISOString() : null,
        createdAt: Date.now(),
      };
      setNotes((prev) => [entry, ...prev]);
    },
    [noteKey, noteLabel, range]
  );

  const updateNote = useCallback((id: string, text: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text } : n))
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    allNotes: notes,
    activeNotes,
    hasNotes,
    noteKey,
    addNote,
    updateNote,
    deleteNote,
  };
}

// Legacy default export kept for backward compat during migration
export function useCalendar() {
  const cal = useCalendarState();
  const notesStore = useNotesStore(cal.range, cal.year, cal.month);
  return {
    ...cal,
    selectingEnd: cal.isSelecting,
    notes: notesStore.activeNotes,
    allNotes: notesStore.allNotes,
    addNote: notesStore.addNote,
    deleteNote: notesStore.deleteNote,
    handleDateClick: cal.handleDayClick,
  };
}
