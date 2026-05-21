'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CursorGlow from '@/components/CursorGlow';
import Preloader from '@/components/Preloader';

export default function GalleryPage() {
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

    return () => { observer.disconnect(); };
  }, []);

  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navbar />

      <main style={{ paddingTop: '80px', minHeight: '100vh', background: '#fff' }}>
        <section className="section-pad" id="gallery" style={{ textAlign: 'center' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
            <span className="section-label reveal-up">The Gallery</span>
            <div className="gold-rule reveal-up stagger-1" style={{ margin: '0.8rem auto 2rem' }} />
            <h2 className="reveal-up stagger-1" style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, color: '#1A1916', marginBottom: '1rem' }}>
              In The Wild
            </h2>
            <p className="reveal-up stagger-2" style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.9rem', color: '#5F5A55', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
              A curated look at our handcrafted shoes in their natural element. See how AETH AN GRAEY pieces complement various styles and occasions.
            </p>

            <div className="reveal-up stagger-3" style={{ padding: '6rem 2rem', border: '1px dashed rgba(26, 25, 22, 0.15)', background: '#F8F7F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8F8579" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8F8579', margin: 0 }}>
                IMAGES UPLOADED SOON
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
