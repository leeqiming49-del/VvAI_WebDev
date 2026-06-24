import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VvAI | AI Automation & Business Health Dashboard",
  description: "VvAI builds practical AI automation systems and free starter tools for business owners who need clearer numbers, cleaner workflows, and better decisions.",
  icons: {
    icon: "/brand/favicon.ico",
    shortcut: "/brand/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
