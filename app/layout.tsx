import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/layout/footer/Footer";
import Container from "@/components/Container";
import { Toaster } from "@/components/ui/toaster";
import NavbarTest from "@/components/layout/nav/page";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PalmTree",
  description: "Book a hotel of your choice",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            <main className="flex flex-col min-h-screen">
              {/* Add fixed positioning to NavbarTest */}
              <div className="fixed top-0 left-0 right-0 z-50">
                <NavbarTest />
              </div>
              <section className="flex-grow pt-[60px]">
                {/* Adjust top padding to compensate for fixed navbar */}
                <Container>{children}</Container>
              </section>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
