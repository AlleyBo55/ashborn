'use client';

import { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Assuming standard util

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
type TextColor = 'default' | 'muted' | 'white' | 'blue' | 'purple' | 'green' | 'red';

interface BaseTextProps {
    children: ReactNode;
    variant?: TextVariant;
    color?: TextColor;
    className?: string;
    as?: ElementType;
}

const variants = {
    h1: 'text-4xl font-bold tracking-tight',
    h2: 'text-2xl font-bold tracking-tight',
    h3: 'text-lg font-semibold',
    body: 'text-sm leading-relaxed',
    caption: 'text-xs',
    label: 'text-xs font-semibold uppercase tracking-wider',
};

const colors = {
    default: 'text-gray-300',
    muted: 'text-gray-500',
    white: 'text-white',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    green: 'text-green-400',
    red: 'text-red-400',
};

export function BaseText({
    children,
    variant = 'body',
    color = 'default',
    className,
    as,
}: BaseTextProps) {
    const Component = as || (variant.startsWith('h') ? variant : 'p');

    return (
        <Component className={cn(variants[variant], colors[color], className)}>
            {children}
        </Component>
    );
}
