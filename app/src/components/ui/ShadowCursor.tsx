'use client';

import { useEffect, useRef } from 'react';

interface Point {
    x: number;
    y: number;
    age: number;
    vx: number;
    vy: number;
    size: number;
}

export default function ShadowCursor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const points = useRef<Point[]>([]);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', updateSize);
        updateSize();

        const handleMouseMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            // Spawn particles on move
            for (let i = 0; i < 3; i++) {
                points.current.push({
                    x: e.clientX,
                    y: e.clientY,
                    age: 0,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 8 + 2
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Filter dead points
            points.current = points.current.filter(p => p.age < 50);

            points.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy - 0.5; // Float up like smoke
                p.age++;

                const life = 1 - p.age / 50;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * life, 0, Math.PI * 2);

                // Color gradient from Blue Core -> Purple Edge -> Transparent
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * life);
                gradient.addColorStop(0, `rgba(59, 130, 246, ${life * 0.8})`);   // #3b82f6 (Arise Blue)
                gradient.addColorStop(0.5, `rgba(88, 28, 135, ${life * 0.5})`);  // Purple
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = gradient;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', updateSize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 mix-blend-screen" />;
}
