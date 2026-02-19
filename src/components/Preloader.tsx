'use client';
import { useEffect, useState } from 'react';

export default function Preloader() {
    const [hidden, setHidden] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => {
            setHidden(true);
        }, 2600);
        return () => clearTimeout(timer);
    }, []);

    if (!mounted) return null;

    return (
        <div id="preloader" className={hidden ? 'hidden' : ''}>
            <div className="preloader-logo">AETH AN GRAEY</div>
            <div className="preloader-bar">
                <div className="preloader-progress" />
            </div>
            <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.55rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--stone)',
                marginTop: '1.5rem',
            }}>
                The Architecture of Elegance
            </p>
        </div>
    );
}
