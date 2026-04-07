import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'MAIZ - Reserve Your Table',
  description: 'Book the best restaurants with MAIZ. Discover, explore, and reserve tables at top restaurants.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
