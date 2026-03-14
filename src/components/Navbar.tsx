'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const leftLinks = [
    { href: '#about', label: 'About' },
    { href: '#collection', label: 'Collection' },
    { href: '#leather', label: 'Leather' },
];

const rightLinks = [
    { href: '#bespoke', label: 'Bespoke' },
    { href: '#shipping', label: 'Shipping' },
    { href: '#quality', label: 'Quality' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [announcementVisible, setAnnouncementVisible] = useState(true);
    const { cartCount, openCart } = useCart();

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
                {/* Announcement bar — single line, collapses on scroll */}
                <div
                    className="announcement-bar-fixed"
                    style={{
                        maxHeight: announcementVisible ? '36px' : '0',
                        paddingTop: announcementVisible ? undefined : '0',
                        paddingBottom: announcementVisible ? undefined : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease, padding 0.3s ease',
                        pointerEvents: announcementVisible ? 'auto' : 'none',
                    }}
                >
                    Free DDP Shipping to All EU Countries · Made to Order · 4–6 Weeks Crafting Period
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
                            href="mailto:contact@aethangraey.com?subject=Order%20Enquiry"
                            className="nav-cta"
                        >
                            Order Now
                        </a>

                        {/* Cart icon */}
                        <button
                            onClick={openCart}
                            aria-label={`Open cart — ${cartCount} items`}
                            style={{
                                position: 'relative',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.3rem',
                                color: '#1A1916',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {cartCount > 0 && (
                                <span
                                    style={{
                                        position: 'absolute',
                                        top: '-2px',
                                        right: '-4px',
                                        width: '16px',
                                        height: '16px',
                                        background: '#A8925A',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        fontSize: '9px',
                                        fontFamily: 'Jost, sans-serif',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        lineHeight: 1,
                                    }}
                                >
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </button>

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
                        href="mailto:contact@aethangraey.com?subject=Order%20Enquiry"
                        className="mobile-nav-link accent-link"
                    >
                        Order Bespoke ↗
                    </a>
                    <button
                        onClick={() => { setMenuOpen(false); openCart(); }}
                        className="mobile-nav-link"
                        style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        Cart {cartCount > 0 && <span style={{ background: '#A8925A', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600 }}>{cartCount}</span>}
                    </button>
                </div>
            </div>
        </>
    );
}
