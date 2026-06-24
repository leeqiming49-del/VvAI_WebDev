import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-cyan to-cyan/75 px-5 py-3 text-slate-950 shadow-[0_10px_30px_rgba(17,179,179,.22)] hover:from-white hover:to-cyan",
        outline: "border border-cyan/25 bg-black/20 px-5 py-3 text-cyan hover:border-cyan hover:bg-cyan/10 hover:text-white",
        ghost: "px-4 py-2 text-slate-300 hover:bg-cyan/10 hover:text-cyan",
      },
      size: { default: "", sm: "px-4 py-2 text-xs", lg: "px-6 py-3.5" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
