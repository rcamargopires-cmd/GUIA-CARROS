import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Seminovo sem Surpresa — Guia de compra",
  description: "Avalie um seminovo passo a passo, compare custos e identifique sinais de alerta antes de comprar.",
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR"><head><meta name="theme-color" content="#111819"/><link rel="stylesheet" href="/styles.css"/></head><body>{children}<Script src="/bundle.js" strategy="afterInteractive"/></body></html>;
}
