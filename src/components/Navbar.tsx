'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
    { href: '#collection', label: 'Collection' },
    { href: '#bespoke', label: 'Custom' },
    { href: '#about', label: 'About' },
    { href: '#leather', label: 'Leather' },
    { href: '#shipping', label: 'Shipping' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNav = (href: string) => {
        setMenuOpen(false);
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <Link href="/" className="nav-logo">
                    AETH AN GRAEY
                    <small>The Architecture of Elegance</small>
                </Link>

                {/* Desktop Nav */}
                <ul className="nav-links" style={{ display: 'flex' }}>
                    {navLinks.map((l) => (
                        <li key={l.href}>
                            <a
                                href={l.href}
                                onClick={(e) => { e.preventDefault(); handleNav(l.href); }}
                            >
                                {l.label}
                            </a>
                        </li>
                    ))}
                    <li>
                        <a
                            href="#bespoke"
                            onClick={(e) => { e.preventDefault(); handleNav('#bespoke'); }}
                            style={{
                                background: 'var(--bone)',
                                color: 'var(--charcoal)',
                                padding: '0.55rem 1.2rem',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLElement).style.background = 'var(--gold)';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLElement).style.background = 'var(--bone)';
                            }}
                        >
                            Order Now
                        </a>
                    </li>
                </ul>

                {/* Hamburger */}
                <button
                    id="menu-toggle"
                    aria-label="Toggle menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        flexDirection: 'column',
                        gap: '5px',
                    }}
                    className="hamburger"
                >
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            style={{
                                display: 'block',
                                width: '24px',
                                height: '1px',
                                background: 'var(--bone)',
                                transition: 'all 0.3s ease',
                                transformOrigin: 'center',
                                transform: menuOpen
                                    ? i === 0 ? 'translateY(6px) rotate(45deg)'
                                        : i === 1 ? 'scaleX(0)'
                                            : 'translateY(-6px) rotate(-45deg)'
                                    : 'none',
                            }}
                        />
                    ))}
                </button>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}>
                <button
                    onClick={() => setMenuOpen(false)}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '4vw',
                        background: 'none',
                        border: 'none',
                        color: 'var(--stone)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontFamily: 'Montserrat, sans-serif',
                        letterSpacing: '0.15em',
                    }}
                >
                    ✕ CLOSE
                </button>
                {navLinks.map((l) => (
                    <a
                        key={l.href}
                        href={l.href}
                        onClick={(e) => { e.preventDefault(); handleNav(l.href); }}
                    >
                        {l.label}
                    </a>
                ))}
                <a
                    href="#bespoke"
                    onClick={(e) => { e.preventDefault(); handleNav('#bespoke'); }}
                    style={{ color: 'var(--gold)' }}
                >
                    Order Bespoke
                </a>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
        </>
    );
}
