import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@/styles/nprogress.css';
import { Providers } from '@/components/providers/Providers';
import { Suspense } from 'react';
import NavigationProgress from '@/components/ui/NavigationProgress';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    title: 'Ashborn | The Shadow Monarch',
    description: 'I shall protect my family. There is no need for words among shadows. Unified privacy protocol on Solana.',
    keywords: ['solana', 'privacy', 'zk-proofs', 'blockchain', 'crypto', 'defi', 'shadow monarch', 'ashborn'],
    authors: [{ name: 'Ashborn' }],
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
    openGraph: {
        title: 'Ashborn | The Shadow Monarch',
        description: 'There is no need for words among shadows. Unified privacy protocol on Solana.',
        type: 'website',
        url: 'https://ashborn-sol.vercel.app',
        siteName: 'Ashborn',
        images: [
            {
                url: '/assets/webtoon-bg.png',
                width: 1200,
                height: 630,
                alt: 'Ashborn - The Shadow Monarch',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ashborn | The Shadow Monarch',
        description: 'There is no need for words among shadows. Unified privacy protocol on Solana.',
        images: ['/assets/webtoon-bg.png'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="overflow-x-hidden">
            <body className="font-sans overflow-x-hidden">
                <Suspense fallback={null}>
                    <NavigationProgress />
                </Suspense>
                <Providers>
                    {/* Background glow effect */}
                    <div className="shadow-glow-bg" />

                    {/* Main content */}
                    <main className="relative z-10 min-h-screen overflow-x-hidden">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
