import type { Metadata, Viewport } from "next";
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
  title: "The 1%: focus, challenges and proof of work",
  description:
    "A focused performance app. Weekly challenges, real-world proof, commitments with something at stake, and a community that ships.",
  keywords: ["the 1%", "focus", "productivity", "challenges", "commitment", "accountability"],
  authors: [{ name: "The 1%" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "The 1%",
    description: "Weekly challenges. Real proof. Something at stake.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The 1%",
    description: "Weekly challenges. Real proof. Something at stake.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
