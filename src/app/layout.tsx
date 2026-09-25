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

const description =
  "Open-source evidence for crypto transfers: a zero-knowledge proof shows a transfer passed specific checks, while the personal information the rules require is sealed for the one institution entitled to read it.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clearproof.world"),
  title: "clearproof: prove the checks passed, keep the data sealed",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "clearproof",
    description,
    url: "https://www.clearproof.world",
    siteName: "clearproof",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "clearproof",
    description,
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
