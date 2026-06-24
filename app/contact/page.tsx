import Link from "next/link";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { VvaiProductShell } from "@/components/vvai-product-shell";
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
    <section className="relative overflow-hidden bg-[#030303] px-5 py-20 text-white md:py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(17,179,179,.10),transparent_34%),radial-gradient(circle_at_90%_18%,rgba(124,58,237,.07),transparent_28%)]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-bold tracking-[.2em] text-cyan">CONTACT VVAI</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">Let&apos;s talk about your project.</h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-400">
          Have an idea, dashboard, website MVP, workflow system, or automation problem? Send a message and VvAI will review it.
        </p>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
          <Card className="p-5 md:p-7">
            <p className="text-xs font-bold tracking-[.18em] text-cyan">PROJECT MESSAGE</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Tell VvAI what you want to improve.</h2>
            <div className="mt-6">
              <MockForm buttonLabel="Send Message" successMessage="Your message has been saved locally for this prototype.">
                <Input required placeholder="Name" />
                <Input required placeholder="Email or WhatsApp" />
                <Textarea required className="min-h-40" placeholder="Project / idea description" />
              </MockForm>
            </div>
          </Card>
          <div>
            <p className="text-xs font-bold tracking-[.18em] text-cyan">CONTACT DIRECTLY</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Choose the easiest way to reach us.</h2>
            <div className="mt-6 grid gap-3">
              {links.map(([label, value, href, Icon]) => (
                <Link key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="flex min-h-16 items-center gap-4 rounded-xl border border-white/[.08] bg-black/25 px-4 py-3 text-sm text-slate-300 transition hover:border-cyan/40 hover:bg-cyan/[.06] hover:text-cyan">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-cyan/20 bg-cyan/10 text-cyan"><Icon size={18} /></span>
                  <span>
                    <span className="block text-xs text-slate-500">{label}</span>
                    <span>{value}</span>
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-500">Based in Malaysia and focused on practical business systems.</p>
          </div>
        </div>
      </div>
    </section>
  </VvaiProductShell>;
}
