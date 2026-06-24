import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-lg border border-white/[.09] bg-white/[.025] shadow-[0_16px_50px_rgba(0,0,0,.18)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan/35 hover:shadow-[0_20px_60px_rgba(17,179,179,.10)]", className)}>{children}</div>;
}
