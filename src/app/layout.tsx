import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/core/sidebar";
import MainSidebar from "@/features/channels/components/main-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Workplace for Teams",
  description:
    "It's a collaboration hub for everyone and everything you need for work, plus the tools that teams need to get stuff done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>
            <Toaster richColors />
            <main className="flex h-screen w-screen">{children}</main>
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  );
}
