"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 transition duration-300 ${
        isScrolled
          ? "border-b border-cyan/[.10] bg-[#030303]/95 shadow-[0_18px_60px_rgba(0,0,0,.34)] backdrop-blur-xl"
          : "border-b border-transparent bg-[#030303]/90 backdrop-blur-md"
      }`}>
        <nav className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-4 lg:px-8">
          <Link href="/products" aria-label="VvAI products"><BrandLogo /></Link>
          <div className="mx-auto flex items-center gap-1 rounded-full border border-cyan/[.12] bg-black/45 p-1 text-sm font-semibold text-slate-400 shadow-[0_14px_40px_rgba(0,0,0,.28)] backdrop-blur-md">
            {siteLinks.map(([label, href]) => (
              <Link key={href} href={href} className={`rounded-full px-3 py-2 transition hover:bg-cyan/10 hover:text-cyan ${pathname === href ? "bg-cyan/10 text-cyan" : ""}`}>
                {label}
              </Link>
            ))}
          </div>
          <Button size="sm" className="hidden sm:inline-flex" asChild><Link href="/contact">Start a Project</Link></Button>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/[.08] bg-[#030303] px-5 py-10 text-sm text-slate-500 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <BrandLogo />
            <p className="mt-4 leading-6">
              VvAI builds practical AI-ready business dashboards, automation workflows, and MVP systems for clearer decisions.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 md:min-w-[360px] md:justify-end">
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-cyan">SITE</p>
              <div className="mt-4 grid gap-3">
                {siteLinks.slice(2).map(([label, href]) => (
                  <Link key={href} href={href} className="hover:text-cyan">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-cyan">CONTACT</p>
              <div className="mt-4 grid gap-3">
                {contactLinks.map(([label, href]) => (
                  <Link key={href} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="hover:text-cyan">
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
