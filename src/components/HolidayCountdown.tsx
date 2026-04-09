import { useMemo } from "react";
import { HOLIDAYS, MONTH_NAMES } from "@/lib/calendar-utils";
import { PartyPopper } from "lucide-react";

export function HolidayCountdown() {
  const countdown = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();

    let closest: { name: string; date: Date; days: number } | null = null;

    for (const [key, name] of Object.entries(HOLIDAYS)) {
      const [m, d] = key.split("-").map(Number);
      let hDate = new Date(year, m, d);
      if (hDate < today) hDate = new Date(year + 1, m, d);
      const diff = Math.ceil(
        (hDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (!closest || diff < closest.days) {
        closest = { name, date: hDate, days: diff };
      }
    }
    return closest;
  }, []);

  if (!countdown) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/10">
      <PartyPopper className="w-4 h-4 text-primary shrink-0" />
      <div className="text-xs font-body">
        <span className="font-semibold text-foreground">{countdown.name}</span>
        <span className="text-muted-foreground">
          {" "}
          in{" "}
          <span className="font-bold text-primary">
            {countdown.days === 0 ? "today! 🎉" : `${countdown.days} day${countdown.days !== 1 ? "s" : ""}`}
          </span>
        </span>
      </div>
    </div>
  );
}
