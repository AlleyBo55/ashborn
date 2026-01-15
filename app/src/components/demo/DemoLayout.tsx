'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { DemoPageHeader } from './DemoPageHeader';
import { InfoCard } from './InfoCard';
import CodeBlock from '@/components/ui/CodeBlock';

interface DemoLayoutSkeleton {
    header: {
        icon: any;
        badge: string;
        title: string;
        description: string;
        color?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'pink' | 'cyan';
    };
    info: {
        icon: any;
        title: string;
        color?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'pink' | 'cyan';
        steps: Array<{ label: string; color?: string } | string>;
        description: ReactNode;
    };
    code: string;
    children: ReactNode;
    maxWidth?: string;
}

export function DemoLayout({ header, info, code, children, maxWidth = "max-w-3xl" }: DemoLayoutSkeleton) {
    return (
        <div className={`${maxWidth} mx-auto space-y-8`}>
            {/* 1. Header */}
            <DemoPageHeader
                icon={header.icon}
                badge={header.badge}
                title={header.title}
                description={header.description}
                color={header.color}
            />

            {/* 2. Educational Context */}
            <InfoCard
                icon={info.icon}
                title={info.title}
                color={info.color}
                steps={info.steps?.map(s => typeof s === 'string' ? { label: s, color: 'blue' as const } : { ...s, color: (s.color as any) || 'blue' })}
            >
                {info.description}
            </InfoCard>

            {/* 3. Interactive Demo Area */}
            {children}

            {/* 4. SDK Implementation Code */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <h3 className="text-sm font-semibold mb-4 text-gray-500 uppercase tracking-wider pl-2">SDK Implementation</h3>
                <CodeBlock
                    language="typescript"
                    code={code}
                    filename="implementation.ts"
                />
            </motion.div>
        </div>
    );
}
