import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vvaiProducts } from "@/lib/data";

export function ProductCard({ product }: { product: (typeof vvaiProducts)[number] }) {
  const Icon = product.icon;
  const isPrimaryProduct = product.slug === "neural-command";
  return (
    <Card className="relative h-full overflow-hidden border-white/[.09] bg-white/[.025] p-5 shadow-[0_12px_36px_rgba(0,0,0,.16)] transition duration-300 hover:border-cyan/35 hover:bg-white/[.04] md:p-6 md:hover:-translate-y-1 md:shadow-[0_16px_50px_rgba(0,0,0,.18)]">
      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-45`} />
      <div className="relative">
        <div className="mb-8 flex items-start justify-between md:mb-12">
          <span className="rounded-lg border border-cyan/15 bg-black/20 p-3 text-cyan"><Icon /></span>
          <span className="rounded-lg border border-cyan/20 bg-cyan/10 px-3 py-1 text-[10px] font-bold text-cyan">{product.status}</span>
        </div>
        <p className="text-[10px] font-bold text-cyan">{product.eyebrow}</p>
        <h3 className="mt-3 text-xl font-semibold text-white md:text-2xl">{product.name}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-400 line-clamp-3">{product.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button size="sm" asChild><Link href={isPrimaryProduct ? "/products/starter" : "/contact"}>{isPrimaryProduct ? "Start Free Now" : "Discuss Project"}</Link></Button>
          <Button size="sm" variant="ghost" asChild><Link href={`/products/${product.slug}`}>Details <ArrowUpRight size={14} /></Link></Button>
        </div>
      </div>
    </Card>
  );
}
