import { Navbar } from '@/components/Navbar';
import { BottomNavbar } from '@/components/BottomNavbar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 space-y-8 pb-16 md:pb-4">
        {children}
      </main>
      <BottomNavbar />
    </>
  );
}
