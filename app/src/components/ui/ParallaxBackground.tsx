'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxBackground() {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Variable speeds for parallax
    const y1 = useTransform(scrollY, [0, 2000], [0, 300]);   // Slow (Far background)
    const y2 = useTransform(scrollY, [0, 2000], [0, -500]);  // Fast (Smoke/Fog)
    const y3 = useTransform(scrollY, [0, 2000], [0, -100]);  // Medium (Particles)

    return (
        <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none">

            {/* Layer 1: The Army (Far) - Moves slowly down to create depth */}
            <motion.div
                style={{ y: y1 }}
                className="absolute inset-0 bg-webtoon-army bg-cover bg-center opacity-30 mix-blend-screen scale-110"
            />

            {/* Layer 2: Dark Gradient Overlay (Fixed) */}
            <div className="absolute inset-0 bg-gradient-to-t from-monarch-black via-monarch-black/90 to-monarch-black/40" />

            {/* Layer 3: Rising Smoke (Mid) - Moves Up against scroll */}
            <motion.div
                style={{ y: y2 }}
                className="absolute inset-0 bg-[url('/assets/smoke-texture.png')] bg-cover opacity-20 mix-blend-overlay"
            />
            {/* (Note: smoke-texture.png doesn't exist yet, we can use CSS cloud generation or just rely on the existing smoke generator in CinematicHero. 
               For now, let's use a CSS gradient trick for "Fog" if we don't generate another image to avoid 429.) 
            */}
            <motion.div
                style={{ y: y2 }}
                className="absolute inset-0 opacity-20"
            >
                <div className="absolute top-0 left-0 w-full h-[200%] bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />
            </motion.div>

            {/* Layer 4: Embers/Sparks (Fore) */}
            <motion.div style={{ y: y3 }} className="absolute inset-0">
                {/* CSS driven particles that just float */}
            </motion.div>

        </div>
    );
}
