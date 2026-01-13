'use client';

import { useEffect, useRef } from 'react';

interface DataAvatarProps {
    src: string;
    className?: string;
}

export default function DataAvatar({ src, className }: DataAvatarProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.crossOrigin = "Anonymous";
        imageRef.current = img;

        img.onload = () => {
            initCanvas();
        };
    }, [src]);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions (Responsive)
        // We'll use the parent container's size or image size
        // For now, let's match the image aspect ratio but scale to fit height
        const updateSize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        let frame = 0;

        const render = () => {
            frame++;
            if (!ctx || !canvas || !img) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw original image (ghosted)
            ctx.globalAlpha = 0.8;
            // Draw slightly flickering
            const flicker = Math.random() > 0.9 ? 0.5 : 1;
            ctx.globalAlpha = 0.8 * flicker;

            // Calculate aspect ratio fit
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            const w = img.width * scale;
            const h = img.height * scale;

            // Draw Base
            ctx.drawImage(img, x, y, w, h);

            // GLITCH EFFECT: Random Horizontal Slices
            const slices = 5;
            for (let i = 0; i < slices; i++) {
                if (Math.random() > 0.95) { // Occasional glitch
                    const sliceH = Math.random() * 50 + 10;
                    const sliceY = Math.random() * canvas.height;
                    const offset = (Math.random() - 0.5) * 40; // Shift X

                    // Draw slice shifted
                    ctx.drawImage(
                        canvas,
                        0, sliceY, canvas.width, sliceH,
                        offset, sliceY, canvas.width, sliceH
                    );

                    // Add digital noise (colored pixels)
                    ctx.fillStyle = Math.random() > 0.5 ? '#3b82f6' : '#a855f7'; // Blue or Purple
                    ctx.fillRect(Math.random() * canvas.width, sliceY, Math.random() * 100, 2);
                }
            }

            // PIXEL SORTING / DATA RAIN (Simplified)
            // Draw random "data blocks" moving up
            ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
            for (let i = 0; i < 5; i++) {
                const bx = Math.random() * canvas.width;
                const by = (Date.now() / 2 + Math.random() * 1000) % canvas.height;
                const bw = Math.random() * 4 + 2;
                const bh = Math.random() * 20 + 10;
                ctx.fillRect(bx, canvas.height - by, bw, bh);
            }

            // Scanline
            const scanY = (frame * 2) % canvas.height;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.fillRect(0, scanY, canvas.width, 10);

            requestAnimationFrame(render);
        };
        render();

        return () => window.removeEventListener('resize', updateSize);
    };

    return (
        <div className={`relative ${className}`}>
            <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </div>
    );
}
