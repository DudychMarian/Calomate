import type { Metadata } from "next";
import { Rubik } from 'next/font/google'

import "./globals.css";

const font = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Calomate - Calorie Tracker & BMR Calculator to Reach Your Goals | Dudych",
  description: "CaloMate: Your personalized nutrition guide for informed choices, intuitive insights, and vibrant living. Join us on the path to a balanced, energized life!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
      </body>
    </html>
  );
}
