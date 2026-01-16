'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function PortalTransition() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ inset: 0, opacity: 1 }}
            animate={{
                opacity: 0,
                transition: { duration: 0.5, delay: 1.5 }
            }}
            onAnimationComplete={() => setIsVisible(false)}
            className="fixed z-[999] inset-0 bg-transparent flex items-center justify-center pointer-events-none"
        >
            {/* Background Blocker - Fades out first */}
            <motion.div
                className="absolute inset-0 bg-black"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
            />

            {/* Upper Gate */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1/2 bg-monarch-black border-b-4 border-arise-blue shadow-[0_0_50px_#3b82f6] z-10 flex items-end justify-center pb-4 overflow-hidden"
                initial={{ y: 0 }}
                animate={{ y: "-100%" }}
                transition={{ duration: 1.2, ease: "circInOut", delay: 0.2 }}
            >
                <div className="font-manga text-arise-blue text-6xl md:text-9xl tracking-tighter opacity-20 uppercase translate-y-[40%]">
                    SHADOW
                </div>
            </motion.div>

            {/* Lower Gate */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-monarch-black border-t-4 border-arise-blue shadow-[0_0_50px_#3b82f6] z-10 flex items-start justify-center pt-4 overflow-hidden"
                initial={{ y: 0 }}
                animate={{ y: "100%" }}
                transition={{ duration: 1.2, ease: "circInOut", delay: 0.2 }}
            >
                <div className="font-manga text-arise-blue text-6xl md:text-9xl tracking-tighter opacity-20 uppercase translate-y-[-40%]">
                    MONARCH
                </div>
            </motion.div>

            {/* Central Energy Burst */}
            <motion.div
                className="absolute w-2 h-full bg-white blur-[50px] mix-blend-overlay z-20"
                initial={{ scaleY: 1, opacity: 1 }}
                animate={{ scaleY: 20, opacity: 0 }}
                transition={{ duration: 0.5 }}
            />

        </motion.div>
    );
}
