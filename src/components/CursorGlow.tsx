'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let x = 0, y = 0;
        let cx = 0, cy = 0;
        let raf: number;

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const onMove = (e: MouseEvent) => {
            x = e.clientX;
            y = e.clientY;
        };

        const animate = () => {
            cx = lerp(cx, x, 0.1);
            cy = lerp(cy, y, 0.1);
            el.style.left = `${cx}px`;
            el.style.top = `${cy}px`;
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        raf = requestAnimationFrame(animate);
        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return <div ref={ref} className="cursor-glow" />;
}
