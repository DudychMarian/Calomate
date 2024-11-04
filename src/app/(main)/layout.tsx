import { Navbar } from '@/components/Navbar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 space-y-8">
        {children}
      </main>
    </>
  );
}
