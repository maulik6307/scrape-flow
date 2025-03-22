import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/providers/AppProviders";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scrape Flow",
  description: "Web Scraper for your needs",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/sign-in"} appearance={{
      elements: {
        formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 !shadow-none"
      }
    }}>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" type="image/png" href="/favicon-32x32.png" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </head>
        <body className={inter.className}>
          <AppProviders>
            {children}
          </AppProviders>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
