import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("h-12 w-full rounded-lg border border-white/[.10] bg-black/35 px-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-cyan/60 focus:bg-black/50 focus:ring-2 focus:ring-cyan/10", className)} {...props} />
));
Input.displayName = "Input";
