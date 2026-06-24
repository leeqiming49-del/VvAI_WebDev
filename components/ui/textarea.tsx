import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("min-h-32 w-full rounded-lg border border-white/[.10] bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-cyan/60 focus:bg-black/50 focus:ring-2 focus:ring-cyan/10", className)} {...props} />
));
Textarea.displayName = "Textarea";
