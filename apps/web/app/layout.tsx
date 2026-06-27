import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Klip - Short Video Platform",
  description: "Discover and share short videos on Klip",
  authors: [{ name: "Klip" }],
  openGraph: {
    title: "Klip - Short Video Platform",
    description: "Discover and share short videos on Klip",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@klip",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
