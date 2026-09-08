'use client';

import { useEffect } from 'react';
import Preloader from '@/components/Preloader';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import ShippingMap from '@/components/ShippingMap';
import Footer from '@/components/Footer';

const logisticsBlocks = [
  {
    title: 'INTERNATIONAL SHIPPING',
    desc: 'We provide secure, fully insured premium express shipping to all destinations across Europe, North America, and Asia. Every order is prepared individually at our atelier to ensure maximum protection during transit.'
  },
  {
    title: 'DELIVERY TIMELINES',
    desc: 'Because Aethangraey operates on a bespoke, made-to-order model, each garment is handcrafted individually upon order confirmation. Meticulous construction and quality assurance take 4–6 weeks. Once dispatched, transit takes 3–5 business days.'
  },
  {
    title: 'CUSTOMS DUTIES (DDP)',
    desc: 'All international shipments are delivered duty paid (DDP). Customs clearings, processing charges, and border tariffs are fully settled by Aethangraey prior to shipping. The price shown at checkout represents the final absolute cost. No hidden fees or surprises.'
  },
  {
    title: 'REAL-TIME TRACKING',
    desc: 'Upon dispatch, a secure tracking signature will be sent directly to your registered email address. This provides real-time transit telemetry from our atelier directly to your coordinates.'
  },
  {
    title: 'RETURN POLICY',
    desc: 'To support our commitment to perfect craftsmanship, Aethangraey offers a seamless 14-day return and sizing exchange window. Garments must remain unworn, in original packaging, and with safety tags attached. Return shipments are fully guided.'
  }
];

export default function ShippingPage() {
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
            SHIPPING INTRO
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ background: '#000', color: '#fff', padding: '10rem 4vw', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <span className="section-label reveal-up" style={{ color: '#666', letterSpacing: '0.45em' }}>THE LOGISTICS</span>
            <div className="gold-rule reveal-up stagger-1" style={{ background: '#333', margin: '1rem auto 3rem', width: '30px' }} />
            <h1 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.4rem, 5vw, 5rem)', fontWeight: 300, lineHeight: 1.15 }}>
              Delivered Duty Paid (DDP). Fully Insured. Global Dispatch.
            </h1>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            LOGISTICS CONTENTS
            ══════════════════════════════════════════ */}
        <section className="section-pad" style={{ padding: '8rem 6vw' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              {logisticsBlocks.map((block, i) => (
                <div 
                  key={block.title} 
                  className="reveal-up" 
                  style={{ 
                    transitionDelay: `${i * 0.05}s`,
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '4rem',
                    borderBottom: '1px solid #eee',
                    paddingBottom: '3rem'
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#000'
                  }}>
                    {block.title}
                  </div>
                  
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    fontWeight: 300,
                    color: '#444',
                    lineHeight: 1.95,
                    margin: 0
                  }}>
                    {block.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive European Shipping Map Panel */}
            <div className="reveal-up" style={{ marginTop: '6rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
                <span className="section-label" style={{ color: '#777', letterSpacing: '0.4em' }}>
                  TRANSIT TELEMETRY
                </span>
                <div className="gold-rule" style={{ background: '#000', margin: '0.8rem auto 0', width: '28px' }} />
              </div>
              <ShippingMap />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
