'use client';
import { useEffect, useState } from 'react';

export default function Preloader() {
    const [hidden, setHidden] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setHidden(true), 2800);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div id="preloader" className={hidden ? 'hidden' : ''}>
            <div className="preloader-logo">AETH AN GRAEY</div>
            <div className="preloader-subtitle">The Architecture of Elegance</div>
            <div className="preloader-bar">
                <div className="preloader-progress" />
            </div>
        </div>
    );
}
