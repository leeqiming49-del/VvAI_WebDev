import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, Layers3, MessageSquareText, PanelsTopLeft, Workflow } from "lucide-react";
import { CoreSolutions } from "@/components/core-solutions";
import { VvaiProductShell } from "@/components/vvai-product-shell";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const selectedWork = [
  ["P&L automation system", "A clearer way to structure revenue, cost, expenses, and profit visibility.", BarChart3],
  ["Customer feedback hub", "A simple feedback flow that turns repeated customer comments into improvement signals.", MessageSquareText],
  ["Workflow module", "A mapped process for reducing repeated manual tasks with forms, dashboards, and AI-ready logic.", Workflow],
] as const;

const audiences = [
  ["Business owners", "Need practical numbers, workflow clarity, and fewer messy manual processes."],
  ["Operators", "Need dashboards and routines that make daily decisions easier to monitor."],
  ["Small teams", "Need MVP systems that can launch without heavy backend complexity."],
  ["Creators and service brands", "Need websites, forms, and automation flows that support real customer action."],
] as const;

const mvpSystems = [
  ["Business dashboards", "Sales, P&L, feedback, or operations views built around the decisions owners actually make.", Layers3],
  ["Automation workflows", "Structured forms, handoffs, and repeated task flows prepared for future AI modules.", Workflow],
  ["Website MVPs", "Fast, focused public sites that explain the business and route customers to the right action.", PanelsTopLeft],
] as const;

function HomeSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden bg-[#030303] px-5 py-24 text-white md:py-28 lg:px-8 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(17,179,179,.10),transparent_34%),radial-gradient(circle_at_86%_24%,rgba(124,58,237,.08),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export default function HomePage() {
  return <VvaiProductShell>
    <HeroGeometric />

    <HomeSection className="pt-28 md:pt-32">
      <div className="flex flex-wrap items-end justify-between gap-10">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-cyan">CORE SOLUTIONS</p>
          <h1 className="mt-6 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-6xl">
            VvAI helps businesses turn repeated operational problems into AI-ready tools and automation modules.
          </h1>
          <p className="mt-6 max-w-3xl leading-7 text-slate-400">
            Start with a real process: P&L clarity, sales tracking, feedback collection, workflow automation, or a clean website MVP.
          </p>
        </div>
        <Button variant="outline" className="min-h-12 w-full sm:w-auto" asChild><Link href="/products">View Products <ArrowRight size={15} /></Link></Button>
      </div>
      <div className="mt-14 md:mt-16">
        <CoreSolutions />
      </div>
    </HomeSection>

    <HomeSection className="bg-[linear-gradient(180deg,#030303_0%,#041012_50%,#030303_100%)]">
      <p className="text-xs font-bold tracking-[.2em] text-cyan">SELECTED WORK</p>
      <h2 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">Practical systems before oversized software.</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {selectedWork.map(([title, text, Icon]) => <Card key={title} className="border-white/[.10] bg-black/25 p-5 md:p-6">
          <Icon className="text-cyan" />
          <h3 className="mt-7 text-xl font-semibold text-white">{title}</h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">{text}</p>
        </Card>)}
      </div>
    </HomeSection>

    <HomeSection>
      <div className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-bold tracking-[.2em] text-cyan">WHO VVAI HELPS</p>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight md:text-5xl">For owners and teams who need clarity, not clutter.</h2>
          <p className="mt-6 leading-7 text-slate-400">
            VvAI is broad by design: the work starts with business problems, then turns them into focused dashboards, workflows, and MVP tools.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {audiences.map(([title, text]) => <Card key={title} className="border-white/[.10] bg-black/25 p-5 md:p-6">
            <BriefcaseBusiness className="text-cyan" size={20} />
            <h3 className="mt-6 font-semibold text-white">{title}</h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">{text}</p>
          </Card>)}
        </div>
      </div>
    </HomeSection>

    <HomeSection className="pb-24 md:pb-32">
      <p className="text-xs font-bold tracking-[.2em] text-cyan">PRACTICAL MVP SYSTEMS</p>
      <div className="mt-6 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Build the smallest useful system first.</h2>
          <p className="mt-6 leading-7 text-slate-400">
            A VvAI MVP keeps the first version focused: clear inputs, useful outputs, and a path toward stronger automation later.
          </p>
          <Button className="mt-8 min-h-12 w-full sm:w-auto" asChild><Link href="/contact">Discuss a Project <ArrowRight size={15} /></Link></Button>
        </div>
        <div className="grid gap-6">
          {mvpSystems.map(([title, text, Icon]) => <Card key={title} className="flex gap-4 border-white/[.10] bg-black/25 p-5 md:gap-5 md:p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan"><Icon size={20} /></span>
            <div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          </Card>)}
        </div>
      </div>
    </HomeSection>
  </VvaiProductShell>;
}
