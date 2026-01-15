'use client';

import { ExternalLink } from 'lucide-react';

interface TxLinkProps {
    signature: string;
    cluster?: 'devnet' | 'mainnet';
    label?: string;
    className?: string;
}

export function TxLink({ signature, cluster = 'devnet', label = 'View on Solscan', className = '' }: TxLinkProps) {
    const url = `https://solscan.io/tx/${signature}${cluster === 'devnet' ? '?cluster=devnet' : ''}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition ${className}`}
        >
            {label}
            <ExternalLink className="w-3.5 h-3.5" />
        </a>
    );
}
