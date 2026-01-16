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
    description: 'I shall protect my family. There is no need for words among shadows.',
    keywords: ['solana', 'privacy', 'zk-proofs', 'blockchain', 'crypto', 'defi'],
    authors: [{ name: 'Ashborn Protocol' }],
    openGraph: {
        title: 'Ashborn | The Shadow Monarch',
        description: 'There is no need for words among shadows. Unified privacy on Solana.',
        type: 'website',
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
