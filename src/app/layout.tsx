import { Rubik } from 'next/font/google'
import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'

import { DateProvider } from '@/context/DateContext';
import { UserProvider } from '@/context/UserContext';

import { Toaster } from "@/components/ui/sonner"
import { Navbar } from '@/components/Navbar';

import "./globals.css";

const font = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Calomate - Calorie Tracker & BMR Calculator to Reach Your Goals | Dudych",
  description: "CaloMate: Your personalized nutrition guide for informed choices, intuitive insights, and vibrant living. Join us on the path to a balanced, energized life!",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserProvider>
        <DateProvider>
          <html lang="en">
            <body className={`${font.className} min-h-screen`}>
              {children}
              <Toaster />
            </body>
          </html>
        </DateProvider>
      </UserProvider>
    </ClerkProvider>
  );
}
