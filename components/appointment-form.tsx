"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MockForm } from "@/components/ui/mock-form";
import { CalendarPicker } from "@/components/ui/calendar-picker";
import { cn } from "@/lib/utils";

const timeGroups = [
  ["Morning", ["09:00", "10:00", "11:00"]],
  ["Afternoon", ["13:00", "14:00", "15:00", "16:00"]],
  ["Evening", ["18:00", "19:00", "20:00"]],
] as const;

const hours = Array.from({ length: 13 }, (_, index) => String(index + 9).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

function TimeSelect({
  label,
  value,
  options,
  open,
  onToggle,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <p className="mb-2 text-xs font-bold uppercase tracking-[.14em] text-slate-500">{label}</p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={onToggle}
        className="flex h-12 w-full items-center justify-between rounded-lg border border-white/[.10] bg-black/45 px-4 text-left text-sm font-semibold text-white outline-none transition hover:border-cyan/35 focus:border-cyan/60 focus:ring-2 focus:ring-cyan/10"
      >
        <span className={value ? "text-white" : "text-slate-500"}>{value || "--"}</span>
        <ChevronDown size={16} className={cn("text-cyan transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-cyan/20 bg-[#080c10] p-1.5 shadow-[0_20px_55px_rgba(0,0,0,.65),0_0_28px_rgba(17,179,179,.10)]"
        >
          <div className="grid grid-cols-3 gap-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={value === option}
                onClick={() => onChange(option)}
                className={cn(
                  "flex items-center justify-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold transition",
                  value === option
                    ? "bg-cyan/15 text-cyan"
                    : "text-slate-400 hover:bg-white/[.06] hover:text-white",
                )}
              >
                {value === option && <Check size={13} />}
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AppointmentForm() {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [openSelect, setOpenSelect] = useState<"hour" | "minute" | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const appointmentTime = hour && minute ? `${hour}:${minute}` : "";
  const timeInMinutes = appointmentTime ? Number(hour) * 60 + Number(minute) : null;
  const timeIsValid = timeInMinutes !== null && timeInMinutes >= 9 * 60 && timeInMinutes <= 21 * 60;
  const showTimeError = Boolean(appointmentTime) && !timeIsValid;
  const availableMinutes = hour === "21" ? ["00"] : minutes;

  const setTime = (time: string) => {
    const [nextHour, nextMinute] = time.split(":");
    setHour(nextHour);
    setMinute(nextMinute);
    setOpenSelect(null);
  };

  return <MockForm buttonLabel="Request Appointment" successMessage="Appointment request saved locally for this prototype.">
    <div className="grid gap-4 sm:grid-cols-2"><Input required placeholder="Your name" /><Input required placeholder="Phone number" /></div>
    <button type="button" onClick={() => setShowCalendar((value) => !value)} className="w-full rounded-xl border border-cyan/20 bg-cyan/[.06] px-4 py-3 text-left text-sm font-semibold text-cyan md:hidden">{appointmentDate ? "Change selected date" : "Choose a date"}</button>
    <div className={showCalendar ? "block" : "hidden md:block"}>
      <CalendarPicker value={appointmentDate} onChange={(value) => { setAppointmentDate(value); setShowCalendar(false); }} />
    </div>
    <div className="grid gap-3">
      <p className="text-sm font-semibold text-slate-300">Preferred appointment time</p>
      <p className="text-xs leading-5 text-slate-500">Choose any time from 09:00 to 21:00 using the custom 24-hour selector.</p>
      <input
        required
        readOnly
        tabIndex={-1}
        name="appointmentTime"
        value={timeIsValid ? appointmentTime : ""}
        className="pointer-events-none absolute h-px w-px opacity-0"
        aria-label="Selected appointment time"
      />
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 rounded-xl border border-white/[.08] bg-black/20 p-3">
        <TimeSelect
          label="Hour"
          value={hour}
          options={hours}
          open={openSelect === "hour"}
          onToggle={() => setOpenSelect((current) => current === "hour" ? null : "hour")}
          onChange={(value) => {
            setHour(value);
            if (value === "21") {
              setMinute("00");
            }
            setOpenSelect(null);
          }}
        />
        <span className="pb-3 text-lg font-bold text-cyan">:</span>
        <TimeSelect
          label="Minute"
          value={minute}
          options={availableMinutes}
          open={openSelect === "minute"}
          onToggle={() => setOpenSelect((current) => current === "minute" ? null : "minute")}
          onChange={(value) => {
            setMinute(value);
            setOpenSelect(null);
          }}
        />
      </div>
      <div className={cn(
        "rounded-xl border px-4 py-3 text-sm font-semibold",
        timeIsValid
          ? "border-cyan/30 bg-cyan/10 text-cyan shadow-[0_0_24px_rgba(17,179,179,.10)]"
          : "border-white/[.08] bg-black/20 text-slate-500",
      )}>
        Selected time: <span className={timeIsValid ? "text-cyan" : "text-slate-400"}>{appointmentTime || "HH:MM"}</span>
      </div>
      {showTimeError && (
        <p role="alert" className="rounded-xl border border-rose-400/25 bg-rose-400/[.08] px-4 py-3 text-sm text-rose-300">
          Please select a time between 09:00 and 21:00.
        </p>
      )}
      {timeGroups.map(([label, times]) => (
        <div key={label} className="rounded-xl border border-white/[.08] bg-black/20 p-3">
          <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">{label}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {times.map((time) => {
              const selected = appointmentTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setTime(time)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    selected
                      ? "border-cyan bg-cyan/15 text-cyan shadow-[0_0_24px_rgba(17,179,179,.16)]"
                      : "border-white/[.08] bg-black/25 text-slate-400 hover:border-cyan/40 hover:text-cyan"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
    <Input placeholder="What should we discuss?" />
  </MockForm>;
}
