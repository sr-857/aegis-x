import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";

export const viewport: Viewport = {
  themeColor: "#f2ca50",
};

export const metadata: Metadata = {
  title: "AEGIS - Reconnaissance Intelligence Suite",
  description: "Advanced attack surface reconnaissance and vulnerability intelligence platform",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
