'use client';

import { motion } from 'framer-motion';

interface RadarChartProps {
    stats: { label: string; value: number }[]; // value 0-100
    color: string;
    delay?: number;
}

export default function RadarChart({ stats, color, delay = 0 }: RadarChartProps) {
    const radius = 80;
    const center = 100;
    const angleStep = (Math.PI * 2) / stats.length;

    // Helper to calculate points
    const getPoint = (index: number, value: number) => {
        const angle = index * angleStep - Math.PI / 2; // Start from top
        const r = (value / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    };

    const polyPoints = stats.map((s, i) => getPoint(i, s.value)).join(' ');
    const fullPoints = stats.map((s, i) => getPoint(i, 100)).join(' ');

    return (
        <div className="relative w-[200px] h-[200px] mx-auto">
            {/* Background Grid (Full Hexagon) */}
            <svg width="200" height="200" className="absolute inset-0 opacity-20">
                <polygon points={fullPoints} fill="none" stroke="white" strokeWidth="1" />
                {/* Inner circles/hexagons could go here */}
            </svg>

            {/* Labels */}
            {stats.map((s, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const labelR = radius + 20;
                const x = center + labelR * Math.cos(angle);
                const y = center + labelR * Math.sin(angle);
                return (
                    <div
                        key={i}
                        className="absolute text-[10px] uppercase font-mono tracking-widest text-gray-400"
                        style={{
                            left: x,
                            top: y,
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        {s.label}
                    </div>
                );
            })}

            {/* The Chart Data */}
            <svg width="200" height="200" className="absolute inset-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                <motion.polygon
                    initial={{ scale: 0, opacity: 0, originX: "50%", originY: "50%" }}
                    whileInView={{ scale: 1, opacity: 0.8 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "circOut", delay }}
                    points={polyPoints}
                    fill={color} // e.g. "rgba(59, 130, 246, 0.5)"
                    stroke={color.replace('0.5', '1').replace('0.2', '1')} // Make stroke solid
                    strokeWidth="2"
                    className="mix-blend-screen"
                />
            </svg>
        </div>
    );
}
