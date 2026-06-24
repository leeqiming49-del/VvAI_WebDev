import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image src="/brand/vvai-logo.svg" alt="VvAI logo" width={120} height={40} className={cn("h-8 w-auto object-contain", className)} />
  );
}
