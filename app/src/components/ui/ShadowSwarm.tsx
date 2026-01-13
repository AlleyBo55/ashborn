'use client';

import { useEffect, useRef } from 'react';

export default function ShadowSwarm() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 1500; // High density

        let mouse = { x: 0, y: 0, active: false };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            baseX: number;
            baseY: number;
            density: number;
            color: string;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.baseX = this.x;
                this.baseY = this.y;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.size = Math.random() * 2 + 0.5;
                this.density = (Math.random() * 30) + 1;
                // Mix of colors: Black, Dark Purple, Arise Blue
                const colors = ['rgba(0,0,0,0.8)', 'rgba(59, 130, 246, 0.4)', 'rgba(88, 28, 135, 0.3)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                // Mouse Interaction (Aggressive Swarm)
                if (mouse.active) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    const maxDistance = 300;

                    // Repulsion (Fear) or Attraction (Command)? 
                    // Let's go with "Command" - they swirl around cursor
                    if (distance < maxDistance) {
                        const force = (maxDistance - distance) / maxDistance;
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;
                        this.vx += directionX * 0.05;
                        this.vy += directionY * 0.05;
                    }
                }

                // Friction
                this.vx *= 0.95;
                this.vy *= 0.95;

                // Return to base (The Shadows are anchored to the domain)
                if (!mouse.active) {
                    let dx = this.baseX - this.x;
                    let dy = this.baseY - this.y;
                    this.vx += dx * 0.01;
                    this.vy += dy * 0.01;
                }

                // Random Browninan motion (Alive)
                this.x += this.vx + (Math.random() - 0.5) * 0.5;
                this.y += this.vy + (Math.random() - 0.5) * 0.5;

                this.draw();
            }
        }

        function init() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas!.width, canvas!.height));
            }
        }

        function animate() {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            // Connect nearby particles (Web Effect)
            // connect(); // Disabled for performance with 1500 count, unless we lower count
            animationFrameId = requestAnimationFrame(animate);
        }

        // Event Listeners
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
            mouse.active = true;
        });
        window.addEventListener('mouseleave', () => {
            mouse.active = false;
        });

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-60" />;
}
