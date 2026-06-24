"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MockForm } from "@/components/ui/mock-form";
import { CalendarPicker } from "@/components/ui/calendar-picker";

const timeGroups = [
  ["Morning", ["09:00", "10:00", "11:00"]],
  ["Afternoon", ["13:00", "14:00", "15:00", "16:00"]],
  ["Evening", ["18:00", "19:00", "20:00"]],
] as const;

export function AppointmentForm() {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  return <MockForm buttonLabel="Request Appointment" successMessage="Appointment request saved locally for this prototype.">
    <div className="grid gap-4 sm:grid-cols-2"><Input required placeholder="Your name" /><Input required placeholder="Phone number" /></div>
    <button type="button" onClick={() => setShowCalendar((value) => !value)} className="w-full rounded-xl border border-cyan/20 bg-cyan/[.06] px-4 py-3 text-left text-sm font-semibold text-cyan md:hidden">{appointmentDate ? "Change selected date" : "Choose a date"}</button>
    <div className={showCalendar ? "block" : "hidden md:block"}>
      <CalendarPicker value={appointmentDate} onChange={(value) => { setAppointmentDate(value); setShowCalendar(false); }} />
    </div>
    <div className="grid gap-3">
      <p className="text-sm font-semibold text-slate-300">Preferred appointment time</p>
      <input required readOnly tabIndex={-1} value={appointmentTime} className="pointer-events-none absolute h-px w-px opacity-0" aria-label="Selected appointment time" />
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
                  onClick={() => setAppointmentTime(time)}
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
