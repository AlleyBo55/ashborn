'use client';

import { motion } from 'framer-motion';

export default function PortalTransition() {
    return (
        <motion.div
            initial={{ inset: 0, opacity: 1 }}
            animate={{
                inset: "unset",
                opacity: 0,
                pointerEvents: "none"
            }}
            transition={{ duration: 1.5, ease: "circIn", delay: 0.5 }}
            className="fixed z-[999] bg-black flex items-center justify-center overflow-hidden"
        >
            {/* Upper Gate */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1/2 bg-monarch-black border-b-4 border-arise-blue shadow-[0_0_50px_#3b82f6]"
                initial={{ y: 0 }}
                animate={{ y: "-100%" }}
                transition={{ duration: 1.2, ease: "circInOut", delay: 0.2 }}
            >
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-manga text-arise-blue text-9xl tracking-tighter opacity-10 uppercase">
                    ASHBORN
                </div>
            </motion.div>

            {/* Lower Gate */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-monarch-black border-t-4 border-arise-blue shadow-[0_0_50px_#3b82f6]"
                initial={{ y: 0 }}
                animate={{ y: "100%" }}
                transition={{ duration: 1.2, ease: "circInOut", delay: 0.2 }}
            >
                <div className="absolute top-4 left-1/2 -translate-x-1/2 font-manga text-arise-blue text-9xl tracking-tighter opacity-10 uppercase">
                    PROTOCOL
                </div>
            </motion.div>

            {/* Central Energy Burst */}
            <motion.div
                className="absolute w-2 h-full bg-white blur-[50px] mix-blend-overlay"
                initial={{ scaleY: 1, opacity: 1 }}
                animate={{ scaleY: 20, opacity: 0 }}
                transition={{ duration: 0.5 }}
            />

        </motion.div>
    );
}
