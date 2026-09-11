import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pulse - Performance Telemetry Lab',
  description: 'A high-performance real-time orbital telemetry dashboard.',
  openGraph: {
    title: 'Pulse - Performance Telemetry Lab',
    description: 'Realtime, without compromise.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse - Performance Telemetry Lab',
    description: 'Realtime, without compromise.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
