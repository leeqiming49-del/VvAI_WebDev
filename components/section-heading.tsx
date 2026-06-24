import { Badge } from "@/components/ui/badge";

export function SectionHeading({ eyebrow, title, text, center = false }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
    <Badge>{eyebrow}</Badge>
    <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-800 md:text-5xl">{title}</h2>
    {text && <p className="mt-4 leading-7 text-slate-400">{text}</p>}
  </div>;
}
