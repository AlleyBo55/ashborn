'use client';

import LinkSquare02Icon from 'hugeicons-react/dist/esm/icons/link_square_02_icon';
import { BaseButton } from '@/components/ui/base';

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
            <LinkSquare02Icon className="w-3.5 h-3.5" />
        </a>
    );
}
