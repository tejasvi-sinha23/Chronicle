import { useState, useEffect, useCallback } from "react";
import type { EventColor } from "@/lib/tokens";

export interface CalendarEvent {
  id: string;
  name: string;
  day: number;   // 1-31, within the current month context
  month: number; // 0-indexed
  year: number;
  color: EventColor;
  createdAt: number;
}

const EVENTS_KEY = "chronicle_events_v1";

function loadEvents(): CalendarEvent[] {
  try {
    const raw = localStorage.getItem(EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useEventsStore() {
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents);

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  const addEvent = useCallback((event: Omit<CalendarEvent, "id" | "createdAt">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const getEventsForMonth = useCallback(
    (year: number, month: number) =>
      events
        .filter((e) => e.year === year && e.month === month)
        .sort((a, b) => a.day - b.day),
    [events]
  );

  const getEventsForDay = useCallback(
    (year: number, month: number, day: number) =>
      events.filter((e) => e.year === year && e.month === month && e.day === day),
    [events]
  );

  return { events, addEvent, deleteEvent, getEventsForMonth, getEventsForDay };
}
