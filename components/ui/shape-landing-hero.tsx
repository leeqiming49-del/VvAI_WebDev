"use client";

import Link from "next/link";
import { ArrowRight, Circle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96], opacity: { duration: 1.2 } }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        style={{ width, height }}
        className="relative"
      >
        <div className={cn(
          "absolute inset-0 rounded-full border-2 border-white/[0.15] bg-gradient-to-r to-transparent backdrop-blur-[2px]",
          "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full",
          "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          gradient
        )} />
      </motion.div>
    </motion.div>
  );
}

export function HeroGeometric({
  badge = "VVAI AI AUTOMATION",
  title1 = "Business Tools",
  title2 = "Built for Clarity",
  description = "VvAI helps businesses turn repeated operational problems into dashboards, workflow systems, and practical AI-ready automation modules.",
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
}) {
  const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.45 + index * 0.18, ease: [0.25, 0.4, 0.25, 1] as const },
    }),
  };

  return (
    <section className="relative flex min-h-[620px] w-full items-center justify-center overflow-hidden bg-[#030303] md:min-h-[760px]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] via-transparent to-cyan-500/[0.05] blur-2xl md:blur-3xl" />
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape delay={0.3} width={600} height={140} rotate={12} gradient="from-indigo-500/[0.18]" className="left-[-55%] top-[12%] sm:left-[-18%] md:left-[-5%] md:top-[20%]" />
        <ElegantShape delay={0.5} width={500} height={120} rotate={-15} gradient="from-cyan-500/[0.16]" className="right-[-65%] top-[73%] sm:right-[-25%] md:right-0 md:top-[75%]" />
        <ElegantShape delay={0.4} width={300} height={80} rotate={-8} gradient="from-violet-500/[0.16]" className="bottom-[7%] left-[-20%] hidden sm:left-[5%] md:left-[10%] md:block" />
        <ElegantShape delay={0.6} width={200} height={60} rotate={20} gradient="from-amber-500/[0.12]" className="right-[-10%] top-[12%] hidden sm:right-[15%] md:right-[20%] md:block" />
        <ElegantShape delay={0.7} width={150} height={40} rotate={-25} gradient="from-cyan-500/[0.18]" className="left-[14%] top-[7%] hidden md:left-[25%] md:top-[10%] md:block" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-5 py-24 text-center md:px-6">
        <motion.div custom={0} variants={fadeUpVariants} initial="hidden" animate="visible" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 md:mb-12">
          <Circle className="h-2 w-2 fill-cyan text-cyan" />
          <span className="text-xs font-semibold tracking-[.16em] text-white/60">{badge}</span>
        </motion.div>
        <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl font-bold leading-[1.02] tracking-[-.06em] sm:text-6xl md:text-8xl lg:text-[104px]">
            <span className="bg-gradient-to-b from-white to-white/75 bg-clip-text text-transparent">{title1}</span>
            <br />
            <span className="bg-gradient-to-r from-cyan via-white/90 to-violet bg-clip-text text-transparent">{title2}</span>
          </h1>
        </motion.div>
        <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
          <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-6 tracking-wide text-white/50 sm:text-base md:mt-7 md:text-lg md:leading-7">{description}</p>
        </motion.div>
        <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible" className="mt-9 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild><Link href="/products">View Products <ArrowRight size={16} /></Link></Button>
          <Button variant="outline" size="lg" asChild><Link href="/contact">Start a Project</Link></Button>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80" />
    </section>
  );
}
