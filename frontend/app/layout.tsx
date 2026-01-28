import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import ThemeProvider from "@/components/ThemeProvider";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CircularFund - Platform Pendanaan Ekonomi Sirkular",
  description: "Menghubungkan UMKM berkelanjutan dengan kreditor berdampak",
  manifest: '/manifest.json',
  themeColor: '#16a34a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CircularFund',
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CircularFund" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
            <PWAInstallPrompt />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
