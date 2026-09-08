'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    router.push(target);
  };

  return (
    <>
      {/* ══════════════════════════════════════════
          NEWSLETTER
          ══════════════════════════════════════════ */}
      <div className="newsletter-strip" style={{ background: '#000', color: '#fff', borderTop: 'none', borderBottom: 'none' }}>
        <div className="reveal-left visible">
          <h3 className="newsletter-heading" style={{ color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: 500, letterSpacing: '0.1em' }}>JOIN THE AETHANGRAEY CIRCLE.</h3>
          <p className="newsletter-sub" style={{ color: '#aaa' }}>Subscribers receive exclusive access to capsule collection previews and limited drop notifications.</p>
        </div>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="ENTER EMAIL ADDRESS"
            className="newsletter-input"
            aria-label="Email address"
            required
            maxLength={254}
            autoComplete="email"
            spellCheck={false}
            style={{ background: 'transparent', borderBottom: '1px solid #444', color: '#fff' }}
          />
          <button type="submit" className="newsletter-btn" style={{ color: '#000', background: '#fff', border: '1px solid #fff' }}>SUBSCRIBE</button>
        </form>
      </div>

      {/* ══════════════════════════════════════════
          FOOTER — Rebranded Minimalist Monochrome
          ══════════════════════════════════════════ */}
      <footer className="site-footer" style={{ background: '#FAF9F6', borderTop: '1px solid #eee', color: '#000' }}>
        {/* Top row: brand + socials */}
        <div className="footer-top-bar" style={{ borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
          <div>
            <Link href="/" className="footer-brand-name" style={{ letterSpacing: '0.6em', fontWeight: 500, fontSize: '0.9rem' }}>AETHANGRAEY</Link>
            <span className="footer-brand-tagline" style={{ letterSpacing: '0.15em', fontSize: '0.5rem', color: '#777' }}>ARCHITECTURAL SILHOUETTES · BESPOKE FINISH</span>
          </div>
          <div className="footer-socials">
            <a href="mailto:contact@aethangraey.com" className="footer-social-link">EMAIL</a>
            <a href="https://www.instagram.com/aethangraey" target="_blank" rel="noopener noreferrer" className="footer-social-link">INSTAGRAM</a>
            <a href="#" className="footer-social-link" onClick={(e) => e.preventDefault()}>TWITTER</a>
          </div>
        </div>

        {/* Column grid */}
        <div className="footer-grid" style={{ paddingTop: '3rem' }}>
          <div>
            <p className="footer-desc" style={{ color: '#444', fontSize: '0.75rem', lineHeight: 1.8 }}>
              Aethangraey is a premium international fashion label. Every design represents a sculpted convergence of classic tailoring discipline and contemporary urban aesthetics.
            </p>
          </div>

          <div>
            <div className="footer-col-title" style={{ letterSpacing: '0.2em', fontSize: '0.6rem', color: '#000' }}>COLLECTION</div>
            {[
              { label: 'NEW ARRIVALS', href: '/collection?category=new-arrivals' },
              { label: 'OXFORDS', href: '/collection?category=Oxfords' },
              { label: 'MONK STRAPS', href: '/collection?category=Monk-Straps' },
              { label: 'CHELSEA BOOTS', href: '/collection?category=Chelsea-Boots' },
              { label: 'SNEAKERS', href: '/collection?category=Sneakers' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-link"
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{ fontSize: '0.58rem', letterSpacing: '0.1em' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <div className="footer-col-title" style={{ letterSpacing: '0.2em', fontSize: '0.6rem', color: '#000' }}>DIRECTORY</div>
            {[
              ['/', 'HOME'],
              ['/about', 'ABOUT THE BRAND'],
              ['/collection', 'SHOP PRODUCTS'],
              ['/gallery', 'EDITORIAL GALLERY'],
              ['/shipping', 'SHIPPING & DUTIES'],
              ['/b2b-partnerships', 'B2B PARTNERSHIPS'],
              ['/contact', 'STUDIO CONTACT'],
            ].map(([path, label]) => (
              <a
                key={path}
                href={path}
                className="footer-link"
                onClick={(e) => handleLinkClick(e, path)}
                style={{ fontSize: '0.58rem', letterSpacing: '0.1em' }}
              >
                {label}
              </a>
            ))}
          </div>

          <div>
            <div className="footer-col-title" style={{ letterSpacing: '0.2em', fontSize: '0.6rem', color: '#000' }}>STUDIO</div>
            <a href="mailto:contact@aethangraey.com" className="footer-link" style={{ fontSize: '0.58rem' }}>CONTACT@AETHANGRAEY.COM</a>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.05em', color: '#777', marginTop: '1.2rem', lineHeight: 1.8 }}>
              PARIS ATELIER · TOKYO STUDIO · CALCUTTA WORKSHOP
            </p>
          </div>
        </div>

        <div className="footer-bottom" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
          <span className="footer-gstin" style={{ background: '#eee', color: '#000', borderRadius: '4px', fontSize: '0.55rem' }}>
            ATELIER REG: 19ABFCA1293G1ZN
          </span>
          <span className="footer-copy" style={{ color: '#777' }}>© 2026 AETHANGRAEY. ALL RIGHTS RESERVED. HANDCRAFTED INTERNATIONALLY.</span>
        </div>
      </footer>
    </>
  );
}
