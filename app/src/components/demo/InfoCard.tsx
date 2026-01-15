'use client';

import { ReactNode, ElementType } from 'react';
import { BaseCard, BaseBadge, BaseText } from '@/components/ui/base';
import { ArrowRight01Icon } from 'hugeicons-react';

// Legacy mapping: InfoCard uses gradient logic that matches BaseCard variants
const variantMap: Record<string, "gradient-blue" | "gradient-purple" | "gradient-green" | "gradient-amber"> = {
    blue: 'gradient-blue',
    purple: 'gradient-purple',
    green: 'gradient-green',
    amber: 'gradient-amber',
};

interface Step {
    label: string;
    color: 'blue' | 'purple' | 'green' | 'amber';
}

interface InfoCardProps {
    icon: ElementType;
    title: string;
    children?: ReactNode;
    steps?: Step[];
    color?: keyof typeof variantMap;
    delay?: number;
}

export function InfoCard({ icon, title, children, steps, color = 'blue', delay = 0.05 }: InfoCardProps) {
    return (
        <BaseCard
            variant={variantMap[color]}
            icon={icon}
            title={title}
            delay={delay}
            className="mb-8"
        >
            {children && (
                <div className="mb-4 text-sm text-gray-400">
                    {children}
                </div>
            )}

            {steps && (
                <div className="flex flex-wrap items-center gap-2">
                    {steps.map((step, i) => (
                        <span key={i} className="flex items-center">
                            <BaseBadge variant={step.color}>
                                {step.label}
                            </BaseBadge>
                            {i < steps.length - 1 && (
                                <ArrowRight01Icon className="w-3 h-3 text-gray-600 mx-2" />
                            )}
                        </span>
                    ))}
                </div>
            )}
        </BaseCard>
    );
}
