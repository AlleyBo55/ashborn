'use client';

import { ReactNode, ElementType } from 'react';
import { BaseButton } from '@/components/ui/base';

interface DemoButtonProps {
    onClick: () => void;
    loading?: boolean;
    loadingText?: string;
    disabled?: boolean;
    icon?: ElementType;
    children: ReactNode;
    variant?: 'primary' | 'gradient'; // Map legacy variants
}

export function DemoButton({
    onClick,
    loading,
    loadingText,
    disabled,
    icon,
    children,
    variant = 'primary'
}: DemoButtonProps) {
    return (
        <BaseButton
            onClick={onClick}
            loading={loading}
            loadingText={loadingText}
            disabled={disabled}
            icon={icon}
            variant={variant}
            fullWidth
            size="lg"
            className="w-full"
        >
            {children}
        </BaseButton>
    );
}
