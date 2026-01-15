'use client';

import { motion } from 'framer-motion';
import { ElementType } from 'react';
import { BaseBadge, BaseText, BaseButton } from '@/components/ui/base';
import { ArrowLeft01Icon } from 'hugeicons-react';
import { useRouter } from 'next/navigation';

const colorMap: Record<string, "blue" | "purple" | "green" | "amber"> = {
    blue: 'blue',
    purple: 'purple',
    green: 'green',
    amber: 'amber',
};

interface DemoPageHeaderProps {
    icon: ElementType;
    badge: string;
    title: string;
    description: string;
    color?: keyof typeof colorMap;
}

export function DemoPageHeader({ icon: Icon, badge, title, description, color = 'purple' }: DemoPageHeaderProps) {
    const router = useRouter();

    return (
        <>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
                <BaseButton
                    variant="ghost"
                    size="sm"
                    icon={ArrowLeft01Icon}
                    onClick={() => router.push('/demo')}
                >
                    Back to Demos
                </BaseButton>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                <div className="mb-6">
                    <BaseBadge variant={colorMap[color]} icon={Icon} animate>
                        {badge}
                    </BaseBadge>
                </div>
                <BaseText variant="h1" className="mb-4">
                    {title}
                </BaseText>
                <BaseText variant="body" color="muted" className="max-w-md mx-auto">
                    {description}
                </BaseText>
            </motion.div>
        </>
    );
}
