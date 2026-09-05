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
  metadataBase: new URL("https://www.clearproof.world"),
  title: "clearproof — Privacy-focused evidence for crypto transfers",
  description: "Explore pilot-stage zero-knowledge checks, encrypted transfer information and EVM verification. Review current packages, testnet deployments, assurance limits and planned workflows.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "clearproof",
    description: "Pilot-stage zero-knowledge checks and encrypted crypto transfer information. Current capabilities, assurance status and planned workflows.",
    url: "https://www.clearproof.world",
    siteName: "clearproof",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "clearproof",
    description: "Pilot-stage zero-knowledge checks and encrypted crypto transfer information. Current capabilities, assurance status and planned workflows.",
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
