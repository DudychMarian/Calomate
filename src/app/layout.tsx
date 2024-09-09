import type { Metadata } from "next";
import { Rubik } from 'next/font/google'

import { Navbar } from '@/components/Navbar';
import { DateProvider } from '@/context/DateContext';

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
    <DateProvider>
      <html lang="en">
        <body className={`${font.className} min-h-screen bg-background`}>
          <Navbar />
          <main className="container mx-auto p-4 space-y-8">
            {children}
          </main>
        </body>
      </html>
    </DateProvider>
  );
}
