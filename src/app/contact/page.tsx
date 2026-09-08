'use client';

import { useEffect } from 'react';
import Preloader from '@/components/Preloader';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
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
            CONTACT INTRO
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ background: '#000', color: '#fff', padding: '10rem 4vw', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-label reveal-up" style={{ color: '#666', letterSpacing: '0.45em' }}>THE CONTACT</span>
            <div className="gold-rule reveal-up stagger-1" style={{ background: '#333', margin: '1rem auto 3rem', width: '30px' }} />
            <h1 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 5vw, 5rem)', fontWeight: 300, lineHeight: 1.15 }}>
              Studio Enquiries &amp; Consultations.
            </h1>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CONTACT DETAIL & FORM — split layout
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: '8rem 6vw' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8vw' }}>
            {/* Left Coordinates Panel */}
            <div className="reveal-up" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="section-label" style={{ color: '#777', letterSpacing: '0.4em' }}>STUDIOS</span>
              <div className="gold-rule" style={{ background: '#000', margin: '1rem 0 3rem', width: '28px' }} />
              
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem', color: '#000' }}>
                  PARIS ATELIER
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 300, color: '#555', lineHeight: 1.8 }}>
                  12 Avenue Montaigne<br />
                  75008 Paris, France<br />
                  paris@aethangraey.com
                </p>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem', color: '#000' }}>
                  TOKYO STUDIO
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 300, color: '#555', lineHeight: 1.8 }}>
                  5-Chome Minami-Aoyama<br />
                  Minato-ku, Tokyo 107-0062, Japan<br />
                  tokyo@aethangraey.com
                </p>
              </div>

              <div>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1rem', color: '#000' }}>
                  GENERAL INQUIRIES
                </h3>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 300, color: '#555', lineHeight: 1.8 }}>
                  For general customer support, sizing consultations, and drops logistics info:<br />
                  <strong>contact@aethangraey.com</strong>
                </p>
              </div>
            </div>

            {/* Right Contact Form Panel */}
            <div className="reveal-fade stagger-1" style={{ background: '#fff', border: '1px solid #eee', padding: '3.5rem' }}>
              <span className="section-label" style={{ color: '#777', letterSpacing: '0.3em', marginBottom: '2rem', display: 'block' }}>
                SEND AN INQUIRY
              </span>
              
              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.48rem', fontWeight: 500, letterSpacing: '0.2em', color: '#777' }}>FULL NAME</span>
                  <input
                    type="text"
                    required
                    placeholder="ALEXANDER VANCE"
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ddd',
                      padding: '0.6rem 0',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.72rem',
                      outline: 'none',
                      letterSpacing: '0.05em'
                    }}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.48rem', fontWeight: 500, letterSpacing: '0.2em', color: '#777' }}>EMAIL ADDRESS</span>
                  <input
                    type="email"
                    required
                    placeholder="vance@heritage.com"
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ddd',
                      padding: '0.6rem 0',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.72rem',
                      outline: 'none',
                      letterSpacing: '0.05em'
                    }}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.48rem', fontWeight: 500, letterSpacing: '0.2em', color: '#777' }}>MESSAGE</span>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your bespoke enquiry here..."
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ddd',
                      padding: '0.6rem 0',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.72rem',
                      outline: 'none',
                      resize: 'none',
                      lineHeight: 1.6,
                      letterSpacing: '0.05em'
                    }}
                  />
                </label>

                <button
                  type="submit"
                  style={{
                    background: '#000',
                    color: '#fff',
                    border: '1px solid #000',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.55rem',
                    fontWeight: 500,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    padding: '0.88rem 2rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '1rem'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = '#000';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#000';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                >
                  SUBMIT ENQUIRY
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
