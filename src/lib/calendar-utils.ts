import januaryImg from "@/assets/calendar-january.jpg";
import februaryImg from "@/assets/calendar-february.jpg";
import marchImg from "@/assets/calendar-march.jpg";
import aprilImg from "@/assets/calendar-april.jpg";
import mayImg from "@/assets/calendar-may.jpg";
import juneImg from "@/assets/calendar-june.jpg";
import julyImg from "@/assets/calendar-july.jpg";
import augustImg from "@/assets/calendar-august.jpg";
import septemberImg from "@/assets/calendar-september.jpg";
import octoberImg from "@/assets/calendar-october.jpg";
import novemberImg from "@/assets/calendar-november.jpg";
import decemberImg from "@/assets/calendar-december.jpg";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const MONTH_IMAGES: Record<number, string> = {
  0: januaryImg,
  1: februaryImg,
  2: marchImg,
  3: aprilImg,
  4: mayImg,
  5: juneImg,
  6: julyImg,
  7: augustImg,
  8: septemberImg,
  9: octoberImg,
  10: novemberImg,
  11: decemberImg,
};

// US holidays (month is 0-indexed)
export const HOLIDAYS: Record<string, string> = {
  "0-1": "New Year's Day",
  "0-20": "MLK Day",
  "1-14": "Valentine's Day",
  "2-17": "St. Patrick's Day",
  "3-1": "April Fools'",
  "4-27": "Memorial Day",
  "5-19": "Juneteenth",
  "6-4": "Independence Day",
  "8-1": "Labor Day",
  "9-31": "Halloween",
  "10-11": "Veterans Day",
  "10-28": "Thanksgiving",
  "11-25": "Christmas",
  "11-31": "New Year's Eve",
};

export function getHoliday(month: number, day: number): string | undefined {
  return HOLIDAYS[`${month}-${day}`];
}

export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  holiday?: string;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();

  // Monday = 0
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const days: CalendarDay[] = [];

  // Previous month fill
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({
      date: d,
      day: d.getDate(),
      isCurrentMonth: false,
      isToday: false,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }

  // Current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    days.push({
      date: d,
      day: i,
      isCurrentMonth: true,
      isToday:
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      holiday: getHoliday(month, i),
    });
  }

  // Next month fill (complete to 42 = 6 rows)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      date: d,
      day: i,
      isCurrentMonth: false,
      isToday: false,
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }

  return days;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const t = date.getTime();
  const s = Math.min(start.getTime(), end.getTime());
  const e = Math.max(start.getTime(), end.getTime());
  return t >= s && t <= e;
}
