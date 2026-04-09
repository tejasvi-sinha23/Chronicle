import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const MOODS = [
  { emoji: "😊", label: "Great", color: "hsl(145, 63%, 49%)" },
  { emoji: "🙂", label: "Good", color: "hsl(205, 78%, 50%)" },
  { emoji: "😐", label: "Okay", color: "hsl(45, 93%, 55%)" },
  { emoji: "😔", label: "Bad", color: "hsl(15, 72%, 55%)" },
  { emoji: "😢", label: "Awful", color: "hsl(0, 72%, 55%)" },
];

const MOODS_KEY = "calendar-moods";

function loadMoods(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(MOODS_KEY) || "{}");
  } catch {
    return {};
  }
}

interface MoodTrackerProps {
  year: number;
  month: number;
}

export function MoodTracker({ year, month }: MoodTrackerProps) {
  const [moods, setMoods] = useState<Record<string, number>>(loadMoods);
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const currentMood = moods[todayKey];

  useEffect(() => {
    localStorage.setItem(MOODS_KEY, JSON.stringify(moods));
  }, [moods]);

  const setMood = (idx: number) => {
    setMoods((prev) => ({ ...prev, [todayKey]: idx }));
  };

  // Calculate mood stats for current month
  const monthMoods = Object.entries(moods)
    .filter(([key]) => key.startsWith(`${year}-${month}-`))
    .map(([, v]) => v);

  const avgMood =
    monthMoods.length > 0
      ? Math.round(monthMoods.reduce((a, b) => a + b, 0) / monthMoods.length)
      : null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold font-display text-foreground">
        How are you today?
      </h3>
      <div className="flex gap-2 justify-center">
        {MOODS.map((mood, i) => (
          <button
            key={i}
            onClick={() => setMood(i)}
            className={cn(
              "text-2xl p-1.5 rounded-lg transition-all duration-200 hover:scale-125",
              currentMood === i
                ? "bg-muted ring-2 ring-primary scale-110 shadow-md"
                : "hover:bg-muted/50"
            )}
            title={mood.label}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      {monthMoods.length > 0 && (
        <div className="text-xs text-muted-foreground text-center font-body">
          This month's vibe: {MOODS[avgMood ?? 2].emoji}{" "}
          <span className="font-medium">{MOODS[avgMood ?? 2].label}</span>
          <span className="text-muted-foreground/60"> ({monthMoods.length} logged)</span>
        </div>
      )}
    </div>
  );
}

export function getMoodForDay(date: Date): number | undefined {
  const moods = loadMoods();
  const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  return moods[key];
}
