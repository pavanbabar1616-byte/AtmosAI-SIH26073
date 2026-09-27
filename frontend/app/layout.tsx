import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Crimson_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const serif = Crimson_Pro({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "AtmosAI · AWS Command",
  description: "Mission control for India's Automatic Weather Stations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable} ${serif.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}