'use client';

import { useEffect } from 'react';
import Preloader from '@/components/Preloader';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function B2BPartnershipsPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left').forEach((el) =>
      observer.observe(el)
    );

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navbar />

      <main style={{ background: '#FAF9F6', color: '#000', paddingTop: '62px' }}>
        {/* ══════════════════════════════════════════
            B2B INTRO
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ background: '#000', color: '#fff', textAlign: 'center', padding: '10rem 4vw' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-label reveal-up" style={{ color: '#666', letterSpacing: '0.45em' }}>B2B PARTNERSHIPS</span>
            <div className="gold-rule reveal-up stagger-1" style={{ background: '#333', margin: '1rem auto 3rem', width: '30px' }} />
            <h1 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.15 }}>
              True hand-welted footwear — without building an atelier from scratch.
            </h1>
            <p className="reveal-up stagger-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 300, color: '#aaa', lineHeight: 2, marginTop: '2rem' }}>
              For boutiques, concept stores, shoe stores, and labels. Two master artisans, 47 years of combined cordwaining experience, one last, hand-welted construction — built under your name, not ours.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            WHAT WE OFFER
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: '8rem 6vw' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw', alignItems: 'center' }}>
            <div className="reveal-fade" style={{ overflow: 'hidden', aspectRatio: '4/5' }}>
              <img
                src="/b2b_cloth1.webp"
                alt="B2B Partnership Offerings"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="section-label reveal-up" style={{ color: '#777', letterSpacing: '0.4em' }}>OUR SERVICES</span>
              <div className="gold-rule reveal-up stagger-1" style={{ background: '#000', margin: '1rem 0 2.5rem 0', width: '28px' }} />
              
              <h2 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.1 }}>
                What we offer.
              </h2>
              
              <ul className="reveal-up stagger-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 300, color: '#444', lineHeight: 2, paddingLeft: '1.2rem', marginBottom: '2rem' }}>
                <li style={{ marginBottom: '1rem' }}>Full hand-welted manufacturing to your specification</li>
                <li style={{ marginBottom: '1rem' }}>Private-label customization within artisan capability</li>
                <li style={{ marginBottom: '1rem' }}>Small-batch production suited to boutique and concept-store volumes</li>
                <li style={{ marginBottom: '1rem' }}>Same construction standard as our own collection — no shortcuts for white-label</li>
                <li style={{ marginBottom: '1rem' }}>Raw leather sheets available separately, for labels who want to construct their own footwear in-house</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            WHO THIS IS FOR — inverse split
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: '8rem 6vw', background: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', order: 2 }}>
              <span className="section-label reveal-up" style={{ color: '#777', letterSpacing: '0.4em' }}>THE PARTNERS</span>
              <div className="gold-rule reveal-up stagger-1" style={{ background: '#000', margin: '1rem 0 2.5rem 0', width: '28px' }} />
              
              <h2 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.1 }}>
                Who this is for.
              </h2>
              
              <p className="reveal-up stagger-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 300, color: '#444', lineHeight: 2, marginBottom: '2rem' }}>
                Luxury boutiques, concept stores, shoe stores, and fashion labels around the world who want hand-welted footwear — or the leather itself — as part of their own line.
              </p>
            </div>

            <div className="reveal-fade" style={{ overflow: 'hidden', aspectRatio: '4/5', order: 1 }}>
              <img
                src="/b2b_cloth2.webp"
                alt="B2B Partnerships Audience"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            THIRD IMAGE FULL WIDTH OR BANNER
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: '4rem 6vw 8rem', background: '#fff' }}>
           <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              <div className="reveal-fade" style={{ overflow: 'hidden', width: '100%', height: '70vh', borderRadius: '4px' }}>
                <img
                  src="/b2b_cloth3.webp"
                  alt="Craftsmanship detail"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
