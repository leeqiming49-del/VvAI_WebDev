import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  Globe2,
  MessageSquareText,
  MousePointer2,
  PanelsTopLeft,
  Route,
  Sparkles,
  Workflow,
} from "lucide-react";
import { VvaiProductShell } from "@/components/vvai-product-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const introCards = [
  ["Current Focus", "Dashboards, workflow tools, feedback systems, and practical MVPs that solve one real business problem at a time.", PanelsTopLeft],
  ["Who It Helps", "Owners and small teams who need clearer numbers, cleaner operations, and better visibility without heavy software.", MousePointer2],
  ["How It Thinks", "Start with the actual workflow, remove noise, and build the smallest useful system before expanding.", Sparkles],
] as const;

const problems = [
  ["Manual P&L calculation", "Revenue, cost, expenses, and profit are still calculated manually or scattered across spreadsheets.", FileSpreadsheet],
  ["Scattered sales data", "Sales signals exist, but they are not organized into one view that supports daily decisions.", BarChart3],
  ["Customer feedback", "Customer comments are collected informally, making repeated issues hard to spot and act on.", MessageSquareText],
  ["Repeated admin work", "Teams repeat the same forms, updates, and follow-ups without a simple workflow system.", ClipboardList],
  ["Missing digital presence", "The business needs a clean website or action flow that helps customers understand what to do next.", Globe2],
  ["Unclear performance", "Owners need a clearer view of what is working, what is leaking time, and what should improve first.", Route],
] as const;

const process = [
  ["Start with the workflow", "Understand the current process, repeated inputs, decision points, and the outcome the system should support."],
  ["Keep it useful", "Build a focused first version with clear inputs, simple outputs, and no unnecessary complexity."],
  ["Build for progress", "Use the MVP to learn what matters, then extend it into stronger dashboards, workflows, and automation modules."],
] as const;

function AboutSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden bg-[#030303] px-5 py-20 text-white md:py-28 lg:px-8 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(17,179,179,.10),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(124,58,237,.07),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return <VvaiProductShell>
    <AboutSection className="pt-24 md:pt-32">
      <p className="text-xs font-bold tracking-[.2em] text-cyan">ABOUT VVAI</p>
      <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
        Practical automation.
        <br />
        Built around real work.
      </h1>
      <div className="mt-10 h-px w-full bg-gradient-to-r from-cyan/35 via-white/[.08] to-transparent" />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <p className="text-lg leading-8 text-slate-300">
          VvAI builds practical business systems for owners who want clearer operations, better visibility, and less repeated manual work.
        </p>
        <p className="text-lg leading-8 text-slate-400">
          The focus is not automation for show. VvAI starts with the real workflow, then shapes dashboards, feedback tools, websites, and MVP systems around what the business actually needs.
        </p>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {introCards.map(([title, text, Icon]) => <Card key={title} className="border-white/[.10] bg-black/25 p-6">
          <Icon className="text-cyan" />
          <h2 className="mt-8 text-xl font-semibold text-white">{title}</h2>
          <p className="mt-4 text-sm leading-6 text-slate-400">{text}</p>
        </Card>)}
      </div>
    </AboutSection>

    <AboutSection className="bg-[linear-gradient(180deg,#030303_0%,#041012_50%,#030303_100%)]">
      <p className="text-xs font-bold tracking-[.2em] text-cyan">BUSINESS PROBLEMS</p>
      <h2 className="mt-6 max-w-4xl text-3xl font-semibold tracking-tight md:text-5xl">Turn scattered work into a clearer system.</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {problems.map(([title, text, Icon]) => <Card key={title} className="border-white/[.10] bg-black/25 p-6">
          <Icon className="text-cyan" />
          <h3 className="mt-7 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">{text}</p>
        </Card>)}
      </div>
    </AboutSection>

    <AboutSection>
      <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-cyan">HOW VVAI WORKS</p>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">Clear systems, built with intent.</h2>
        </div>
        <div className="grid gap-5">
          {process.map(([title, text], index) => <Card key={title} className="flex gap-5 border-white/[.10] bg-black/25 p-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cyan/25 bg-cyan/10 text-sm font-bold text-cyan">{index + 1}</span>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          </Card>)}
        </div>
      </div>
    </AboutSection>

    <AboutSection className="pb-24 text-center md:pb-32">
      <div className="mx-auto max-w-4xl rounded-2xl border border-cyan/15 bg-cyan/[.06] p-8 md:p-10">
        <p className="text-xs font-bold tracking-[.2em] text-cyan">START WITH THE PROCESS</p>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">Turn one messy workflow into a working system.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-400">
          Share the business problem. VvAI will help map the clearest MVP path.
        </p>
        <Button className="mt-8" asChild><Link href="/contact">Start a Project</Link></Button>
      </div>
    </AboutSection>
  </VvaiProductShell>;
}
