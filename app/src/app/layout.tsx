import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

// const inter = Inter({ subsets: ['latin'] });

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
        <html lang="en">
            <body className="font-sans">
                <Providers>
                    {/* Background glow effect */}
                    <div className="shadow-glow-bg" />

                    {/* Main content */}
                    <main className="relative z-10 min-h-screen">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
