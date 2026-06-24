"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";

const siteLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Contact", "/contact"],
] as const;

const contactLinks = [
  ["Email", "mailto:officialvvai@gmail.com"],
  ["WhatsApp", "https://wa.me/60126340073"],
  ["Instagram", "https://www.instagram.com/vvai_official/"],
] as const;

export function VvaiProductShell({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className={`sticky top-0 z-50 transition duration-300 ${
        isScrolled
          ? "border-b border-cyan/[.10] bg-[#030303]/95 shadow-[0_18px_60px_rgba(0,0,0,.34)] backdrop-blur-xl"
          : "border-b border-transparent bg-[#030303]/90 backdrop-blur-md"
      }`}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:grid md:grid-cols-[auto_1fr_auto] md:gap-3 md:py-4 lg:px-8">
          <Link href="/products" aria-label="VvAI products"><BrandLogo /></Link>
          <div className="mx-auto hidden items-center gap-1 rounded-full border border-cyan/[.12] bg-black/45 p-1 text-sm font-semibold text-slate-400 shadow-[0_14px_40px_rgba(0,0,0,.28)] backdrop-blur-md md:flex">
            {siteLinks.map(([label, href]) => (
              <Link key={href} href={href} className={`rounded-full px-3 py-2 transition hover:bg-cyan/10 hover:text-cyan ${pathname === href ? "bg-cyan/10 text-cyan" : ""}`}>
                {label}
              </Link>
            ))}
          </div>
          <Button size="sm" className="hidden md:inline-flex" asChild><Link href="/contact">Start a Project</Link></Button>
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-cyan/20 bg-black/35 text-cyan transition hover:border-cyan/50 hover:bg-cyan/10 md:hidden"
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>
        {mobileMenuOpen && <div className="md:hidden">
          <div className="mx-5 mb-4 rounded-2xl border border-cyan/[.14] bg-[#080b0d]/98 p-3 shadow-[0_24px_70px_rgba(0,0,0,.55)]">
            <div className="grid gap-1">
              {siteLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold transition ${
                    pathname === href ? "bg-cyan/10 text-cyan" : "text-slate-300 hover:bg-white/[.05] hover:text-cyan"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Button className="mt-3 min-h-12 w-full" asChild><Link href="/contact">Start a Project</Link></Button>
          </div>
        </div>}
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/[.08] bg-[#030303] px-5 py-10 text-sm text-slate-500 md:py-12 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 md:flex-row md:items-start md:justify-between md:gap-9">
          <div className="max-w-sm">
            <BrandLogo />
            <p className="mt-3 leading-6 md:mt-4">
              VvAI builds practical AI-ready business dashboards, automation workflows, and MVP systems for clearer decisions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:min-w-[360px] md:gap-8 md:justify-end">
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-cyan">SITE</p>
              <div className="mt-3 grid md:mt-4 md:gap-1">
                {siteLinks.slice(2).map(([label, href]) => (
                  <Link key={href} href={href} className="flex min-h-9 items-center hover:text-cyan md:min-h-10">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-cyan">CONTACT</p>
              <div className="mt-3 grid md:mt-4 md:gap-1">
                {contactLinks.map(([label, href]) => (
                  <Link key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="flex min-h-9 items-center hover:text-cyan md:min-h-10">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
