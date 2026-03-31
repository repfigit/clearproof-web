import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "clearproof — ZK infrastructure for compliant value transfer",
  description: "Generate zero-knowledge proofs that FATF Travel Rule compliance was performed correctly. Sanctions clearance, credential validity, and jurisdiction-correct tier encoding — without revealing private data.",
  openGraph: {
    title: "clearproof",
    description: "ZK infrastructure for compliant value transfer",
    url: "https://clearproof.world",
    siteName: "clearproof",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "clearproof",
    description: "ZK infrastructure for compliant value transfer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
