'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SlashSectionProps {
    children: React.ReactNode;
    className?: string;
    wrapperClassName?: string;
    slant?: 'left' | 'right' | 'none';
    delay?: number;
}

export default function SlashSection({ children, className, wrapperClassName, slant = 'none', delay = 0 }: SlashSectionProps) {

    // Slant Styles using clip-path
    // Adjusted to be less aggressive to prevent "broken" look
    const clipPaths = {
        none: 'none',
        left: 'polygon(0 0, 100% 0, 100% 95%, 0 100%)',   // Slant Down-Left (Gentler)
        right: 'polygon(0 0, 100% 0, 100% 100%, 0 95%)'   // Slant Down-Right (Gentler)
    };

    // Reduced negative margins to avoid overlap clash
    const margins = {
        none: 'py-10 md:py-20',
        left: 'py-12 md:py-24 -my-6 md:-my-10',
        right: 'py-12 md:py-24 -my-6 md:-my-10'
    };

    return (
        <div className={clsx("relative w-full z-10", margins[slant], wrapperClassName)}>
            {/* Background Container having the slant */}
            <div
                className="absolute inset-0 bg-monarch-black/40 backdrop-blur-md z-0 border-b border-arise-blue/10"
                style={{ clipPath: clipPaths[slant] }}
            />

            {/* Content Animation - Less "Slam", more "Glide" to feel premium */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, ease: "circOut", delay }}
                className={clsx("relative z-10 container mx-auto px-4", className)}
            >
                {children}
            </motion.div>
        </div>
    );
}
