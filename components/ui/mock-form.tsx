"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MockForm({ children, buttonLabel, successMessage }: { children: React.ReactNode; buttonLabel: string; successMessage: string }) {
  const [submitted, setSubmitted] = useState(false);
  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
      {children}
      {submitted ? (
        <div className="flex items-center gap-2 rounded-xl border border-cyan/20 bg-cyan/10 px-4 py-3 text-sm text-cyan">
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      ) : <Button className="w-full">{buttonLabel}</Button>}
    </form>
  );
}
