'use client';

import { motion } from 'framer-motion';
import { ElementType } from 'react';
import { BaseBadge, BaseText, BaseButton } from '@/components/ui/base';
import ArrowLeft01Icon from 'hugeicons-react/dist/esm/icons/arrow_left_01_icon';
import Shield02Icon from 'hugeicons-react/dist/esm/icons/shield_02_icon';
import { useRouter } from 'next/navigation';

const colorMap: Record<string, "blue" | "purple" | "green" | "amber" | "red"> = {
    blue: 'blue',
    purple: 'purple',
    green: 'green',
    amber: 'amber',
    red: 'red',
};

interface DemoPageHeaderProps {
    icon: ElementType;
    badge: string;
    title: string;
    description: string;
    color?: keyof typeof colorMap;
    /** Show "Privacy Relay" badge indicating server-side relay */
    privacyRelay?: boolean;
}

export function DemoPageHeader({ icon: Icon, badge, title, description, color = 'purple', privacyRelay = false }: DemoPageHeaderProps) {
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
                <div className="mb-6 flex flex-wrap justify-center gap-2">
                    <BaseBadge variant={colorMap[color]} icon={Icon} animate>
                        {badge}
                    </BaseBadge>
                    {privacyRelay && (
                        <BaseBadge variant="green" icon={Shield02Icon}>
                            🔒 Privacy Relay
                        </BaseBadge>
                    )}
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

