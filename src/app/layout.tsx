import type { Metadata } from "next";
import { JetBrains_Mono, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const description =
  "Open-source evidence for crypto transfers: a zero-knowledge proof shows a transfer passed specific checks, while the personal information the rules require is sealed for the one institution entitled to read it.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clearproof.world"),
  title: "Clearproof: prove the checks passed, keep the data sealed",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Clearproof",
    description,
    url: "https://www.clearproof.world",
    siteName: "Clearproof",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clearproof",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
