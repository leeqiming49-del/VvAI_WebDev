"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { vvaiProducts } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CoreSolutions() {
  const [activeSlug, setActiveSlug] = useState(vvaiProducts[0]?.slug ?? "");
  const activeProduct = useMemo(() => vvaiProducts.find((product) => product.slug === activeSlug) ?? vvaiProducts[0], [activeSlug]);

  return (
    <div className="mt-8 md:mt-10">
      <div className="overflow-hidden rounded-lg border border-white/[.08] bg-white/[.025] shadow-[0_18px_60px_rgba(0,0,0,.16)] md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(320px,.95fr)]">
        <div className="divide-y divide-white/[.07]">
          {vvaiProducts.map((product) => {
            const Icon = product.icon;
            const active = product.slug === activeSlug;
            const isStarterEntry = product.slug === "neural-command";
            return (
              <div key={product.slug} className="group">
                <button type="button" onClick={() => setActiveSlug(product.slug)} className={cn("flex w-full items-center gap-3 px-4 py-4 text-left transition md:px-5 md:py-5", active ? "bg-cyan/[.055]" : "hover:bg-white/[.035]")}>
                  <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-black/20 text-cyan", active ? "border-cyan/30" : "border-white/10")}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold text-cyan/75">{product.eyebrow}</span>
                    <span className="mt-1 block truncate text-sm font-semibold text-white md:text-base">{product.name}</span>
                  </span>
                  <span className="hidden rounded-lg border border-cyan/20 bg-cyan/10 px-3 py-1 text-[10px] font-bold text-cyan sm:inline-flex">{product.status}</span>
                  <ChevronDown size={16} className={cn("text-slate-500 transition", active && "rotate-180 text-cyan")} />
                </button>
                {active && <div className="px-4 pb-4 md:hidden">
                  <div className="rounded-lg border border-white/[.08] bg-black/20 p-4">
                    <span className="rounded-lg border border-cyan/20 bg-cyan/10 px-3 py-1 text-[10px] font-bold text-cyan sm:hidden">{product.status}</span>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{product.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" asChild><Link href={isStarterEntry ? "/products/starter" : "/contact"}>{isStarterEntry ? "Start Free Now" : "Discuss Project"}</Link></Button>
                      <Button size="sm" variant="ghost" asChild><Link href={`/products/${product.slug}`}>Details <ArrowUpRight size={14} /></Link></Button>
                    </div>
                  </div>
                </div>}
              </div>
            );
          })}
        </div>
        {activeProduct && <Card className="relative hidden overflow-hidden rounded-none border-0 border-l border-white/[.08] bg-black/20 p-7 md:block">
          <div className={`absolute inset-0 bg-gradient-to-br ${activeProduct.gradient} opacity-55`} />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-cyan">{activeProduct.eyebrow}</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">{activeProduct.name}</h3>
              </div>
              <span className="rounded-lg border border-cyan/20 bg-cyan/10 px-3 py-1 text-[10px] font-bold text-cyan">{activeProduct.status}</span>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-300">{activeProduct.description}</p>
            <div className="mt-7 grid gap-2">
              {activeProduct.features.slice(0, 4).map((feature) => <span key={feature} className="rounded-lg border border-white/[.08] bg-white/[.035] px-4 py-3 text-sm text-slate-400">{feature}</span>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild><Link href={activeProduct.slug === "neural-command" ? "/products/starter" : "/contact"}>{activeProduct.slug === "neural-command" ? "Start Free Now" : "Discuss Project"}</Link></Button>
              <Button variant="outline" asChild><Link href={`/products/${activeProduct.slug}`}>View Details <ArrowUpRight size={15} /></Link></Button>
            </div>
          </div>
        </Card>}
      </div>
    </div>
  );
}
