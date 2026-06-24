"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function CalendarPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const leadingBlanks = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const isCurrentMonth = visibleMonth.getFullYear() === today.getFullYear() && visibleMonth.getMonth() === today.getMonth();
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;

  function changeMonth(offset: number) {
    setVisibleMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between">
        <button type="button" disabled={isCurrentMonth} onClick={() => changeMonth(-1)} className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-cyan/40 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-30" aria-label="Previous month"><ChevronLeft size={16} /></button>
        <p className="text-sm font-semibold text-white">{visibleMonth.toLocaleDateString("en-MY", { month: "long", year: "numeric" })}</p>
        <button type="button" onClick={() => changeMonth(1)} className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-cyan/40 hover:text-cyan" aria-label="Next month"><ChevronRight size={16} /></button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day) => <span key={day} className="py-1 text-[9px] font-bold tracking-wider text-slate-600">{day}</span>)}
        {Array.from({ length: leadingBlanks }, (_, index) => <span key={`blank-${index}`} />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index + 1);
          const dateKey = toDateKey(date);
          const isPast = date < today;
          const isSelected = value === dateKey;
          return <button key={dateKey} type="button" disabled={isPast} onClick={() => onChange(dateKey)} className={cn("aspect-square rounded-lg text-xs text-slate-300 transition hover:bg-cyan/10 hover:text-cyan disabled:cursor-not-allowed disabled:text-slate-800", isSelected && "bg-cyan text-slate-950 hover:bg-cyan hover:text-slate-950")}>{index + 1}</button>;
        })}
      </div>
      <input required readOnly tabIndex={-1} value={value} className="pointer-events-none absolute h-px w-px opacity-0" aria-label="Selected appointment date" />
      <p className="mt-3 border-t border-white/10 pt-3 text-xs text-slate-500">
        Selected date: <span className="font-semibold text-cyan">{selectedDate ? selectedDate.toLocaleDateString("en-MY", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "Choose a date"}</span>
      </p>
    </div>
  );
}
