import { ProductCard } from "@/components/product-card";
import { Card } from "@/components/ui/card";
import { VvaiProductShell } from "@/components/vvai-product-shell";
import { vvaiProducts } from "@/lib/data";

export default function ProductsPage() {
  return <VvaiProductShell>
    <section className="bg-[#030303] px-5 py-16 text-white md:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold tracking-[.2em] text-cyan">VVAI SOLUTIONS</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">Useful systems for practical business problems.</h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-400">Start with a clear need: understand P&L, track sales, improve operations, collect feedback, build a credible website, or reduce repeated manual work.</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vvaiProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
        <Card className="mt-12 border-cyan/15 bg-white/[.025] p-6 text-sm leading-6 text-slate-400">
          The free Business Health Dashboard is available from the P&L Automation System details page. No account, login, registration, checkout, or payment flow is required.
        </Card>
      </div>
    </section>
  </VvaiProductShell>;
}
