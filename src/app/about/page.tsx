'use client';

import { useEffect } from 'react';
import Preloader from '@/components/Preloader';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
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
            BRAND STATEMENT / INTRO
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ background: '#000', color: '#fff', textAlign: 'center', padding: '10rem 4vw' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-label reveal-up" style={{ color: '#666', letterSpacing: '0.45em' }}>THE IDENTITY</span>
            <div className="gold-rule reveal-up stagger-1" style={{ background: '#333', margin: '1rem auto 3rem', width: '30px' }} />
            <h1 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 5vw, 5rem)', fontWeight: 300, lineHeight: 1.15 }}>
              Aethangraey is the convergence of classical discipline and contemporary streetwear architecture.
            </h1>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            STORY & VISION — spacious editorial
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: '8rem 6vw' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw', alignItems: 'center' }}>
            <div className="reveal-fade" style={{ overflow: 'hidden', aspectRatio: '4/5' }}>
              <img
                src="https://images.unsplash.com/photo-1764636695674-2c4fde2381d6?q=80&w=1332&auto=format&fit=crop"
                alt="Studio Craftsmanship"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.15)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="section-label reveal-up" style={{ color: '#777', letterSpacing: '0.4em' }}>OUR STORY</span>
              <div className="gold-rule reveal-up stagger-1" style={{ background: '#000', margin: '1rem 0 2.5rem 0', width: '28px' }} />
              
              <h2 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.1 }}>
                From Atelier discipline to the modern Streets.
              </h2>
              
              <p className="reveal-up stagger-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 300, color: '#444', lineHeight: 2, marginBottom: '2rem' }}>
                Founded upon the principles of classical craftsmanship and contemporary shape architecture, Aethangraey began as a strict study of structure. We reject the rapid volume of fast fashion, opting instead for a highly curated drops cycle where each garment is perfected over hundreds of design iterations.
              </p>
              
              <p className="reveal-up stagger-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 300, color: '#444', lineHeight: 2 }}>
                Every design carries a deliberate silhouette weight. We combine structural tailoring coordinates—like double-breasted framing and canvas pads—with the dynamic ease of premium streetwear, producing garments that feel timelessly protective yet thoroughly modern.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PHILOSOPHY & CRAFTSMANSHIP — inverse split
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: '8rem 6vw', background: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', order: 2 }}>
              <span className="section-label reveal-up" style={{ color: '#777', letterSpacing: '0.4em' }}>CRAFTSMANSHIP &amp; VISION</span>
              <div className="gold-rule reveal-up stagger-1" style={{ background: '#000', margin: '1rem 0 2.5rem 0', width: '28px' }} />
              
              <h2 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 300, marginBottom: '2rem', lineHeight: 1.1 }}>
                One Artisan. Pure Materials. No Compromise.
              </h2>
              
              <p className="reveal-up stagger-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 300, color: '#444', lineHeight: 2, marginBottom: '2rem' }}>
                Craftsmanship is a commitment to time. At Aethangraey, our garments are hand-assembled and stitched by a single dedicated artisan. From vegetable-tanned full-grain calf leather to 100% heavy organic cotton and premium Italian virgin wool, we source only raw materials that respond organically to wear, developing a unique character over decades.
              </p>
              
              <p className="reveal-up stagger-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 300, color: '#444', lineHeight: 2 }}>
                Our vision is global. We draw structural inspiration from Paris haute couture, urban utility from Tokyo streets, and bespoke discipline from London’s Savile Row. This hybrid fashion identity makes Aethangraey a truly universal statement of elegance.
              </p>
            </div>

            <div className="reveal-fade" style={{ overflow: 'hidden', aspectRatio: '4/5', order: 1 }}>
              <img
                src="https://images.unsplash.com/photo-1650154281741-498255ad3513?q=80&w=735&auto=format&fit=crop"
                alt="Leather Crafting Detail"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.15)' }}
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
