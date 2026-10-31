import type { Metadata } from "next";
import { Shell } from "@/components/shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "StudioSpace — Room for your next big idea",
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
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
