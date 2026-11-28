import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";

const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The 1%",
  description:
    "Commit to something real, do the work, and prove it to people who check. Weekly challenges, commitments with something at stake, peer-reviewed proof.",
  keywords: ["the 1%", "focus", "productivity", "challenges", "commitment", "accountability"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "The 1%",
    description: "Say it. Do it. Prove it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1014" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${grotesk.variable} ${martian.variable} antialiased`}>{children}</body>
    </html>
  );
}
