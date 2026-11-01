import type { Metadata } from "next";
import localFont from "next/font/local";
const bodyFont = localFont({
  src: "./fonts/Manrope.ttf",
  variable: "--font-body",
  display: "swap",
  weight: "200 800",
});
const displayFont = localFont({
  src: "./fonts/BricolageGrotesque.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "200 800",
});
import { Shell } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "StudioSpace — Good work. Great space.",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book photography studios, film stages, podcast rooms, music suites, and creative workshops.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
