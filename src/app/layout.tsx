import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "@/trpc/react";
import { Navigation } from "@/components/layout";

export const metadata: Metadata = {
  title: "skillEd - Master New Skills with Expert-Led Courses",
  description:
    "Join thousands of learners worldwide in our comprehensive e-learning platform. From programming to design, business to science - unlock your potential with expert-led courses and hands-on projects.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-background-white">
        <SessionProvider>
          <TRPCReactProvider>
            <Navigation />
            {children}
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
