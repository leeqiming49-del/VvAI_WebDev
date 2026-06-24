import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-[10px] font-bold tracking-[.18em] text-cyan", className)}>{children}</span>;
}
