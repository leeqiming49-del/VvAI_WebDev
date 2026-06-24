import Link from "next/link";
import { ArrowRight, MessageSquareText } from "lucide-react";
import { VvaiProductShell } from "@/components/vvai-product-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MockForm } from "@/components/ui/mock-form";

export default function FeedbackPage() {
  return <VvaiProductShell>
    <section className="bg-[#030303] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold tracking-[.2em] text-cyan">VVAI FEEDBACK</p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">Help shape better VvAI tools.</h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-400">General feedback helps VvAI understand which dashboards, workflows, and automation modules would be most useful for business owners.</p>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_340px]">
          <Card className="border-white/[.09] bg-white/[.025] p-5 md:p-6">
            <MessageSquareText className="text-cyan" />
            <h2 className="mt-5 text-xl font-semibold text-white">General feedback</h2>
            <MockForm buttonLabel="Send Feedback" successMessage="Feedback saved locally for this prototype.">
              <Input placeholder="Your email (optional)" type="email" />
              <Textarea required placeholder="What should VvAI improve or build next?" />
            </MockForm>
          </Card>
          <Card className="border-cyan/15 bg-cyan/[.06] p-5">
            <p className="text-xs font-bold tracking-[.18em] text-cyan">DASHBOARD FEEDBACK</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Using the Business Health Dashboard?</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">Use the focused dashboard feedback form so VvAI can improve the free starter tool.</p>
            <Button className="mt-5 w-full" asChild><Link href="/products/starter/feedback">Open Dashboard Feedback <ArrowRight size={15} /></Link></Button>
          </Card>
        </div>
      </div>
    </section>
  </VvaiProductShell>;
}
