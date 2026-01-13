'use client';

import { useEffect, useRef } from 'react';

interface AsciiArtProps {
    src: string;
    className?: string;
    chars?: string;
    color?: string;
}

export default function AsciiArt({
    src,
    className,
    chars = " .-:;=+*#%@@", // Standard gradient
    color = "#a855f7"
}: AsciiArtProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let animationFrameId: number;

        // Cache for the grid data
        let gridCache: { x: number; y: number; char: string; alpha: number }[] = [];
        let fontSize = 10; // Slightly larger for better perf

        const img = new Image();
        img.src = src;
        img.crossOrigin = "Anonymous";

        img.onload = () => {
            initGrid();
            animate();
        };

        const initGrid = () => {
            if (!canvas.parentElement) return;

            // 1. Setup dimensions
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;

            const cols = Math.floor(canvas.width / fontSize);
            const rows = Math.floor(canvas.height / fontSize);

            // 2. Draw image ONCE to temp canvas to read data
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = cols;
            tempCanvas.height = rows;
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            // Center + Combine fit
            const scale = Math.min(cols / img.width, rows / img.height) * 0.8; // 0.8 to give some margin
            // actually "contain" logic
            const fitScale = Math.min(cols / img.width, rows / img.height);
            const w = img.width * fitScale;
            const h = img.height * fitScale;
            const x = (cols - w) / 2;
            const y = (rows - h) / 1; // Align bottom-ish

            tempCtx.drawImage(img, x, y, w, h);
            const imageData = tempCtx.getImageData(0, 0, cols, rows).data;

            // 3. Populate Grid Cache
            gridCache = [];
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const idx = (i * cols + j) * 4;
                    const r = imageData[idx];
                    const g = imageData[idx + 1];
                    const b = imageData[idx + 2];
                    const a = imageData[idx + 3];

                    if (a > 50) { // Visibility threshold
                        const brightness = (r + g + b) / 3;
                        const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
                        const char = chars[charIndex];
                        gridCache.push({
                            x: j * fontSize,
                            y: i * fontSize,
                            char,
                            alpha: brightness / 255
                        });
                    }
                }
            }
        };

        let lastTime = 0;
        const fps = 24; // Cinematic/Terminal FPS
        const interval = 1000 / fps;

        const animate = (time: number = 0) => {
            animationFrameId = requestAnimationFrame(animate);

            // Throttle FPS
            if (time - lastTime < interval) return;
            lastTime = time;

            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px monospace`;
            ctx.textBaseline = 'top';
            ctx.fillStyle = color;

            // Render form cache
            // We use a for-loop for speed
            for (let i = 0; i < gridCache.length; i++) {
                const cell = gridCache[i];

                // Optimized Glitch Effect
                // Only calc random for a small subset or use scrolling logic
                // Simple flicker:
                if (Math.random() > 0.99) continue; // Randomly drop char

                // Wave effect based on Y and Time
                const wave = Math.sin(cell.y * 0.05 + time * 0.002);

                if (Math.random() > 0.995) {
                    // Bright Glitch
                    ctx.fillStyle = '#ffffff';
                    ctx.globalAlpha = 1;
                    ctx.fillText(String.fromCharCode(33 + Math.random() * 50), cell.x, cell.y);
                    ctx.fillStyle = color; // Reset
                } else {
                    // Normal
                    ctx.globalAlpha = cell.alpha * (0.8 + wave * 0.2);
                    ctx.fillText(cell.char, cell.x, cell.y);
                }
            }
        };

        const handleResize = () => {
            initGrid();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [src, chars, color]);

    return (
        <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
    );
}
