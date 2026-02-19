'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const leftLinks = [
    { href: '#collection', label: 'Collection' },
    { href: '#about', label: 'About' },
    { href: '#leather', label: 'Leather' },
];

const rightLinks = [
    { href: '#bespoke', label: 'Bespoke' },
    { href: '#shipping', label: 'Shipping' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [announcementVisible, setAnnouncementVisible] = useState(true);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 40);
            setAnnouncementVisible(window.scrollY < 80);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNav = (href: string) => {
        setMenuOpen(false);
        setTimeout(() => {
            const el = document.querySelector(href);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 350);
    };

    return (
        <>
            {/* Fixed wrapper */}
            <div className="navbar-wrapper">
                {/* Announcement bar */}
                <div
                    className="announcement-bar-fixed"
                    style={{
                        maxHeight: announcementVisible ? '40px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease',
                    }}
                >
                    Free DDP Shipping to All EU Countries · Made to Order · 7–14 Days Crafting
                </div>

                {/* Main navbar */}
                <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                    {/* Left links */}
                    <div className="nav-left">
                        {leftLinks.map((l) => (
                            <button
                                key={l.href}
                                className="nav-link"
                                onClick={() => handleNav(l.href)}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    {/* Center logo */}
                    <Link href="/" className="nav-logo">AETH AN GRAEY</Link>

                    {/* Right links + CTA */}
                    <div className="nav-right">
                        {rightLinks.map((l) => (
                            <button
                                key={l.href}
                                className="nav-link"
                                onClick={() => handleNav(l.href)}
                            >
                                {l.label}
                            </button>
                        ))}
                        <a
                            href="mailto:hello@aethangraey.com?subject=Order%20Enquiry"
                            className="nav-cta"
                        >
                            Order Now
                        </a>

                        {/* Hamburger */}
                        <button
                            id="menu-toggle"
                            aria-label="Toggle menu"
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="hamburger"
                        >
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    style={{
                                        display: 'block',
                                        width: '22px',
                                        height: '1px',
                                        background: '#1A1916',
                                        transition: 'all 0.35s ease',
                                        transformOrigin: 'center',
                                        transform: menuOpen
                                            ? i === 0 ? 'translateY(6px) rotate(45deg)'
                                                : i === 1 ? 'scaleX(0)'
                                                    : 'translateY(-6px) rotate(-45deg)'
                                            : 'none',
                                        opacity: menuOpen && i === 1 ? 0 : 1,
                                    }}
                                />
                            ))}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu — slides in from right */}
            <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-header">
                    <span className="mobile-menu-logo">AETH AN GRAEY</span>
                    <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
                        Close ✕
                    </button>
                </div>

                <div className="mobile-menu-body">
                    {[...leftLinks, ...rightLinks].map((l) => (
                        <a
                            key={l.href}
                            href={l.href}
                            className="mobile-nav-link"
                            onClick={(e) => { e.preventDefault(); handleNav(l.href); }}
                        >
                            {l.label}
                        </a>
                    ))}
                    <a
                        href="mailto:hello@aethangraey.com?subject=Order%20Enquiry"
                        className="mobile-nav-link accent-link"
                    >
                        Order Bespoke ↗
                    </a>
                </div>
            </div>
        </>
    );
}
