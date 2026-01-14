'use client';

import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

export default function ClientWalletButton({ className }: { className?: string }) {
    return <WalletMultiButton className={className} />;
}
