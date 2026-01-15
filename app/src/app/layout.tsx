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
    title: 'Ashborn | Compliant Private Payment Protocol on Solana',
    description: 'A unified privacy layer on Solana. Shield your assets, transfer in shadows, reveal only what you choose. Compliant by design.',
    keywords: ['solana', 'privacy', 'zk-proofs', 'blockchain', 'crypto', 'defi'],
    authors: [{ name: 'Ashborn Protocol' }],
    openGraph: {
        title: 'Ashborn | The Shadow Monarch',
        description: 'I alone level up. Unified privacy on Solana.',
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
