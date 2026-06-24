import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VvaiProductShell } from "@/components/vvai-product-shell";
import { vvaiProducts } from "@/lib/data";

export function generateStaticParams() { return vvaiProducts.map(({ slug }) => ({ slug })); }

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = vvaiProducts.find((item) => item.slug === slug);
  if (!product) notFound();
  const Icon = product.icon;
  const isStarterEntry = product.slug === "neural-command";

  return <VvaiProductShell>
    <section className="bg-[#030303] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"><ArrowLeft size={15} /> Back to products</Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card className={`overflow-hidden border-white/[.09] bg-gradient-to-br ${product.gradient} p-8 md:p-10`}>
            <Icon className="text-cyan" size={42} />
            <p className="mt-16 text-xs font-bold tracking-[.18em] text-cyan">{product.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">{product.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{product.longDescription}</p>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {product.features.map((feature) => <div key={feature} className="flex gap-2 rounded-lg border border-white/[.08] bg-white/[.035] p-3 text-sm text-slate-300"><CheckCircle2 size={17} className="shrink-0 text-cyan" />{feature}</div>)}
            </div>
          </Card>
          <div className="space-y-4">
            <Card className="border-white/[.09] bg-white/[.025] p-5">
              <p className="text-xs font-bold tracking-[.18em] text-cyan">STATUS</p>
              <p className="mt-3 text-2xl font-semibold text-white">{product.status}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{product.availability}</p>
              <Button className="mt-5 w-full" asChild><Link href={isStarterEntry ? "/products/starter" : "/contact"}>{isStarterEntry ? "Start Free Now" : "Discuss Project"}</Link></Button>
            </Card>
            <Card className="border-white/[.09] bg-white/[.025] p-5">
              <p className="text-xs font-bold tracking-[.18em] text-cyan">NEXT STEP</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{isStarterEntry ? "Open the free Business Health Dashboard, add sales categories, compare category costs, and generate practical business insights without login." : "Share your workflow, dashboard idea, or automation need so VvAI can scope a practical MVP."}</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  </VvaiProductShell>;
}
