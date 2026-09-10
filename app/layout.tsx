import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mirai',
  description: 'Mirai - Small Steps, Higher Tomorrows',
};

import ToastProvider from '@/components/common/ToastProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
