import { X } from "lucide-react";
import type { NoteEntry } from "@/hooks/useCalendar";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  note: NoteEntry;
  isActive: boolean;
  onDelete: (id: string) => void;
  onClick: (note: NoteEntry) => void;
}

export function NoteCard({ note, isActive, onDelete, onClick }: NoteCardProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border px-3 py-2.5 cursor-pointer transition-all duration-200 animate-note-slide-in",
        "hover:shadow-sm",
        isActive
          ? "border-primary/60 bg-[hsl(var(--calendar-selected-range))] shadow-sm"
          : "border-border/60 bg-card hover:border-border"
      )}
      onClick={() => onClick(note)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(note)}
      aria-label={`Note for ${note.label}`}
    >
      {/* Date label */}
      <p
        className={cn(
          "text-[10px] font-semibold uppercase tracking-wider mb-1 font-body",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        {note.label}
      </p>

      {/* Note text — 2-line clamp */}
      <p className="text-sm text-foreground font-body leading-relaxed line-clamp-2">
        {note.text}
      </p>

      {/* Delete button — visible on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
        aria-label="Delete note"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
