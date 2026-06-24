import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { AppointmentForm } from "@/components/appointment-form";
import { VvaiProductShell } from "@/components/vvai-product-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MockForm } from "@/components/ui/mock-form";
import { Textarea } from "@/components/ui/textarea";

const links = [
  ["Email", "officialvvai@gmail.com", "mailto:officialvvai@gmail.com", Mail],
  ["WhatsApp", "0126340073", "https://wa.me/60126340073", MessageCircle],
  ["Instagram", "@vvai_official", "https://www.instagram.com/vvai_official/", Instagram],
] as const;

export default function ContactPage() {
  return <VvaiProductShell>
    <section className="bg-[#030303] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold tracking-[.2em] text-cyan">CONTACT VVAI</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Start a project or explore a practical automation system.</h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-400">
          Tell VvAI about the repeated workflow, dashboard idea, feedback system, or website MVP you want to improve. Forms are prototype-only and do not submit to a backend yet.
        </p>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_390px]">
          <div className="grid gap-5">
            <Card className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[.18em] text-cyan">PROJECT REQUEST</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Describe the system you want to build.</h2>
                </div>
                <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-xs font-semibold text-cyan">Prototype form</span>
              </div>
              <MockForm buttonLabel="Send Project Request" successMessage="Project request saved locally for this prototype.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input required placeholder="Your name" />
                  <Input required type="email" placeholder="Email address" />
                </div>
                <Input placeholder="Business or project name" />
                <Textarea required placeholder="What workflow, dashboard, automation, or AI-ready tool should VvAI help you explore?" />
              </MockForm>
            </Card>
            <Card className="p-5 md:p-6">
              <p className="text-xs font-bold tracking-[.18em] text-cyan">DISCOVERY SESSION</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Book a prototype discussion.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">Use this local appointment form to outline a preferred time and project context. No booking backend is connected yet.</p>
              <div className="mt-5"><AppointmentForm /></div>
            </Card>
          </div>
          <Card className="h-fit p-5 md:p-6">
            <p className="text-xs font-bold tracking-[.18em] text-cyan">CONTACT INFORMATION</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Reach VvAI directly.</h2>
            <p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><MapPin size={16} className="text-cyan" /> Based in Malaysia, building for practical business use cases.</p>
            <div className="mt-6 grid gap-3">
              {links.map(([label, value, href, Icon]) => (
                <Link key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="flex items-center gap-3 rounded-xl border border-white/[.08] bg-black/25 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan/40 hover:text-cyan">
                  <Icon size={18} />
                  <span>
                    <span className="block text-xs text-slate-500">{label}</span>
                    <span>{value}</span>
                  </span>
                </Link>
              ))}
            </div>
            <Button className="mt-6 w-full" asChild><Link href="https://wa.me/60126340073" target="_blank" rel="noreferrer">Message on WhatsApp</Link></Button>
          </Card>
        </div>
      </div>
    </section>
  </VvaiProductShell>;
}
