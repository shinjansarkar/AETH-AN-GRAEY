'use client';

import { useEffect, useState } from 'react';
import Preloader from '@/components/Preloader';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import MarqueeBanner from '@/components/MarqueeBanner';
import ScrollReveal from '@/components/ScrollReveal';

// ── Product data ──────────────────────────────────────────────────────────────
const products = [
  {
    id: 'oxford-noir',
    name: 'The Noir Oxford',
    desc: 'Goat Calfskin · Welt Stitched',
    price: '€ 299',
    tag: 'Bestseller',
    // Classic black leather oxford dress shoe
    img: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=600&q=85&fit=crop&crop=center',
  },
  {
    id: 'cognac-derby',
    name: 'The Cognac Derby',
    desc: 'Full-Grain Goat · Hand-lasted',
    price: '€ 279',
    tag: 'New',
    // Warm brown leather derby shoe
    img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=85&fit=crop&crop=center',
  },
  {
    id: 'monk-strap',
    name: 'The Double Monk',
    desc: 'Burnished Goat · Double Buckle',
    price: '€ 319',
    tag: 'Edition',
    // Dark leather monk strap shoe
    img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=85&fit=crop&crop=center',
  },
  {
    id: 'bone-loafer',
    name: 'The Bone Loafer',
    desc: 'Smooth Goat · Penny Slot',
    price: '€ 249',
    tag: 'Classic',
    // Tan leather penny loafer
    img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=85&fit=crop&crop=center',
  },
];

// ── Leather advantages ─────────────────────────────────────────────────────────
const leatherRows = [
  { feature: 'Weight', value: 'Ultra-light, 30% lighter than cowhide' },
  { feature: 'Breathability', value: 'Natural micro-pores allow air circulation' },
  { feature: 'Durability', value: 'Tensile strength surpasses most bovine leathers' },
  { feature: 'Texture', value: 'Fine, tight grain — elegantly uniform' },
  { feature: 'Flexibility', value: 'Conforms to foot instantly, zero break-in' },
  { feature: 'Aging', value: 'Develops rich patina over years of wear' },
  { feature: 'Sustainability', value: 'Lower ecological footprint per hide' },
];

// ── Bespoke Steps ──────────────────────────────────────────────────────────────
const bespokeSteps = [
  {
    num: '01',
    title: 'Consultation',
    desc: 'We begin with a digital consultation. You share your foot measurements, style references, and functional requirements.',
  },
  {
    num: '02',
    title: 'Selection',
    desc: 'Choose your leather grade, colour, sole type, and construction method. Every decision is yours to make.',
  },
  {
    num: '03',
    title: 'Creation',
    desc: 'Your shoes are hand-lasted and stitched by a single artisan in a 7–14 day craft window. No shortcuts. No compromises.',
  },
];

// ── Shipping features ─────────────────────────────────────────────────────────
const shippingFeatures = [
  {
    icon: (
      <svg className="shipping-icon" viewBox="0 0 40 40" fill="none" strokeWidth="1.2">
        <rect x="2" y="10" width="36" height="24" rx="1" />
        <path d="M2 17h36M14 10V6a2 2 0 012-2h8a2 2 0 012 2v4" />
      </svg>
    ),
    title: 'DDP – No Surprises',
    desc: 'Delivered Duty Paid straight to your door. No hidden customs fees, no surprise invoices on delivery.',
  },
  {
    icon: (
      <svg className="shipping-icon" viewBox="0 0 40 40" fill="none" strokeWidth="1.2">
        <circle cx="20" cy="20" r="17" />
        <path d="M20 10v10l6 4" />
      </svg>
    ),
    title: '7–14 Day Crafting',
    desc: 'Your shoes take time. Each pair is crafted individually — not assembled on a factory line.',
  },
  {
    icon: (
      <svg className="shipping-icon" viewBox="0 0 40 40" fill="none" strokeWidth="1.2">
        <path d="M20 4l2.5 7.5H30l-6 4.5 2.3 7L20 19l-6.3 4 2.3-7L10 11.5h7.5z" />
      </svg>
    ),
    title: 'Fully Tracked',
    desc: 'Every shipment carries real-time tracking from the atelier to your address across Europe.',
  },
  {
    icon: (
      <svg className="shipping-icon" viewBox="0 0 40 40" fill="none" strokeWidth="1.2">
        <path d="M20 6C12.3 6 6 12.3 6 20s6.3 14 14 14 14-6.3 14-14S27.7 6 20 6z" />
        <path d="M6 20h28M20 6s-6 6-6 14 6 14 6 14 6-6 6-14-6-14-6-14z" />
      </svg>
    ),
    title: 'Ships to All EU',
    desc: 'Germany, France, Italy, Spain, Netherlands, Scandinavia — all destinations covered.',
  },
];

// ── Trinity values ────────────────────────────────────────────────────────────
const trinity = [
  {
    num: '1',
    title: 'Discipline',
    desc: 'Every cut, stitch, and last is governed by rigorous technique. No rushed processes.',
  },
  {
    num: '2',
    title: 'Aesthetics',
    desc: 'Form follows function, but never at the cost of beauty. Sculptural design with purpose.',
  },
  {
    num: '3',
    title: 'Ambition',
    desc: 'To make shoes that outlive fashion — objects of permanence in a disposable world.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    // Trigger hero parallax-zoom on load
    const t = setTimeout(() => setHeroLoaded(true), 100);
    // Scroll reveal for all sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal-up, .reveal-fade').forEach((el) =>
      observer.observe(el)
    );
    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);

  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navbar />

      {/* ═══════════════════════════════════
          HERO
          ═══════════════════════════════════ */}
      <section className="hero" id="hero">
        <div className="hero-bg" />
        <div
          className={`hero-image ${heroLoaded ? 'loaded' : ''}`}
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(17,17,17,0.35) 0%, rgba(17,17,17,0.15) 40%, rgba(17,17,17,0.85) 100%),
              url('https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=1920&q=90&fit=crop&crop=center')
            `,
          }}
        />

        <div className="hero-content">
          <p className="hero-eyebrow reveal-up">
            Handcrafted Goat Leather · Est. India for Europe
          </p>
          <h1 className="hero-title reveal-up stagger-1">
            AETH<br />AN<br />GRAEY
          </h1>
          <p className="hero-subtitle reveal-up stagger-2">
            The Architecture of Elegance.
          </p>
          <p className="hero-tagline reveal-up stagger-3">
            One Artisan &nbsp;·&nbsp; Pure Goat Leather &nbsp;·&nbsp; Your Perfect Fit
          </p>
          <div className="hero-btns reveal-up stagger-4">
            <a
              href="#collection"
              className="btn-outline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Shop the Collection</span>
            </a>
            <a
              href="#bespoke"
              className="btn-solid"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('bespoke')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Start Your Custom Build</span>
            </a>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ═══════════════════════════════════
          MARQUEE
          ═══════════════════════════════════ */}
      <MarqueeBanner />

      {/* ═══════════════════════════════════
          PHILOSOPHY
          ═══════════════════════════════════ */}
      <section className="section-pad" id="about" style={{ background: 'var(--charcoal)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '5vw',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {/* Left: text */}
          <div>
            <span className="label-text reveal-up">Philosophy</span>
            <div className="gold-line" style={{ margin: '1.2rem 0 2.5rem' }} />
            <h2
              className="headline-lg reveal-up stagger-1"
              style={{ color: 'var(--bone)', marginBottom: '2rem' }}
            >
              Where Raw Nature<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Becomes</em>
              <br />Refined Art.
            </h2>
            <p className="body-text reveal-up stagger-2" style={{ maxWidth: '480px', marginBottom: '1.5rem' }}>
              In a world of mass production, I choose the slow path. Every pair
              of AETH AN GRAEY shoes is hand-lasted, stitched, and finished by a
              single artisan — me. No assembly lines. No automation.
              No compromise.
            </p>
            <p className="body-text reveal-up stagger-3" style={{ maxWidth: '480px', marginBottom: '2.5rem' }}>
              I source pure goat leather selected for its unmatched fineness of
              grain, its breath, and the way it responds to the human foot.
              The result is not merely a shoe — it is a companion built to
              outlive fashion.
            </p>
            <a href="#bespoke" className="btn-outline reveal-up stagger-4">
              <span>Begin Your Journey</span>
            </a>
          </div>

          {/* Right: image */}
          <div
            className="reveal-fade stagger-2"
            style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '4/5',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1597983073493-88cd39a0e8d0?w=900&q=85&fit=crop&crop=center"
              alt="Artisan hand-stitching a leather shoe"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(30%) contrast(1.08)',
                transition: 'transform 0.8s var(--ease-luxury)',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = 'scale(1)')}
            />
            {/* Overlay accent */}
            <div
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '-1.5rem',
                width: '1px',
                height: '40%',
                background: 'var(--gold)',
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '2rem',
                left: '2rem',
                padding: '1rem 1.5rem',
                background: 'rgba(13,13,13,0.85)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--bone)' }}>
                "Sculpted by hand.<br />Worn with intention."
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #about > div { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════
          TRINITY
          ═══════════════════════════════════ */}
      <section
        className="section-pad"
        id="trinity"
        style={{ background: 'var(--dark-surface)' }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ marginBottom: '4rem' }}>
            <span className="label-text reveal-up">The Three Pillars</span>
            <div className="gold-line" style={{ margin: '1.2rem 0 0' }} />
          </div>
          <div
            style={{
              display: 'flex',
              gap: '2px',
              flexWrap: 'wrap',
            }}
          >
            {trinity.map((t, i) => (
              <div
                key={t.title}
                className={`trinity-block reveal-up stagger-${i + 2}`}
              >
                <span className="trinity-num">0{t.num}</span>
                <h3 className="trinity-title">{t.title}</h3>
                <p className="trinity-desc">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #trinity .trinity-block { min-height: auto; padding: 2rem; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════
          COLLECTION
          ═══════════════════════════════════ */}
      <section className="section-pad" id="collection" style={{ background: 'var(--charcoal)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '3rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="label-text reveal-up">SS 2025 Collection</span>
              <div className="gold-line" style={{ margin: '1.2rem 0 1rem' }} />
              <h2 className="headline-md reveal-up stagger-1" style={{ color: 'var(--bone)' }}>
                Sculpted Footwear
              </h2>
            </div>
            <p className="body-text reveal-up stagger-2" style={{ maxWidth: '320px', textAlign: 'right' }}>
              Each shoe is a sculpture. Viewed from every angle, it returns beauty.
            </p>
          </div>

          {/* Horizontal scroll or grid on mobile */}
          <div
            className="h-scroll-container"
            style={{ paddingBottom: '1rem' }}
            onMouseDown={() => { }} // handled by CSS grab
          >
            {products.map((p, i) => (
              <div
                key={p.id}
                className="h-scroll-item product-card reveal-up"
                style={{
                  width: 'clamp(260px, 28vw, 400px)',
                  transitionDelay: `${i * 0.1}s`,
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4' }}>
                  <img
                    src={p.img}
                    alt={p.name}
                    className="product-card-img"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="product-card-overlay" />
                  {/* Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      padding: '0.3rem 0.8rem',
                      background: 'var(--gold)',
                      color: 'var(--charcoal)',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.55rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {p.tag}
                  </span>
                </div>
                <div className="product-card-info">
                  <p className="product-card-name">{p.name}</p>
                  <p className="product-card-desc">{p.desc}</p>
                  <p className="product-card-price">{p.price}</p>
                  <div
                    style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <a
                      href="#bespoke"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '0.6rem',
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        color: 'var(--stone)',
                        textDecoration: 'none',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--gold)')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--stone)')}
                    >
                      Order Custom →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          BESPOKE
          ═══════════════════════════════════ */}
      <section
        className="section-pad"
        id="bespoke"
        style={{ background: 'var(--dark-surface)' }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '5rem' }}>
            <span className="label-text reveal-up">Bespoke Programme</span>
            <div className="gold-divider" style={{ margin: '1.2rem 0 2.5rem' }} />
            <h2 className="headline-md reveal-up stagger-1" style={{ color: 'var(--bone)', marginBottom: '1rem' }}>
              Your Vision.
              <br />
              <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>My Hands.</em>
            </h2>
            <p className="body-text reveal-up stagger-2" style={{ maxWidth: '500px' }}>
              A fully bespoke shoe is an intimate collaboration. You bring the
              vision — I bring fifteen years of atelier discipline.
            </p>
          </div>

          {/* Steps */}
          <div>
            {bespokeSteps.map((step, i) => (
              <div
                key={step.num}
                className={`timeline-item reveal-up stagger-${i + 1}`}
              >
                <div className="timeline-num">{step.num}</div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: '1.8rem',
                      fontWeight: 300,
                      color: 'var(--bone)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="body-text" style={{ maxWidth: '560px' }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                alignItems: 'center',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontStyle: 'italic',
                    fontSize: '1.2rem',
                    color: 'var(--stone)',
                    marginBottom: '1.5rem',
                  }}
                >
                  Starting from <span style={{ color: 'var(--gold)', fontStyle: 'normal', fontSize: '1.6rem' }}>€249</span>
                  <br />
                  <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>+ Free DDP shipping to Europe</span>
                </p>
                <a
                  href="mailto:hello@aethangraey.com?subject=Bespoke%20Enquiry"
                  className="btn-solid"
                >
                  <span>Begin Bespoke Enquiry →</span>
                </a>
              </div>
              <div
                style={{
                  padding: '2rem',
                  border: '1px solid rgba(201, 169, 110, 0.15)',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                <p className="label-text" style={{ color: 'var(--gold)', marginBottom: '1rem' }}>What you receive</p>
                {['Foot measurement guide', 'Leather swatches (digital)', 'Design sketch proof', '1:1 artisan communication', '7–14 day crafting window'].map((item) => (
                  <p
                    key={item}
                    style={{
                      fontSize: '0.65rem',
                      letterSpacing: '0.08em',
                      color: 'var(--stone)',
                      padding: '0.4rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                    }}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: '0.5rem' }}>✦</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <style>{`
              @media (max-width: 768px) {
                #bespoke > div > div:last-child > div { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          GOAT LEATHER
          ═══════════════════════════════════ */}
      <section
        className="section-pad"
        id="leather"
        style={{ background: 'var(--charcoal)' }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <span className="label-text reveal-up">Material Science</span>
          <div className="gold-line" style={{ margin: '1.2rem 0 3rem' }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '5vw',
              alignItems: 'start',
              marginBottom: '4rem',
            }}
          >
            <div>
              <h2
                className="headline-md reveal-up stagger-1"
                style={{ color: 'var(--bone)', marginBottom: '1.5rem' }}
              >
                Why Goat<br />
                <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Leather?</em>
              </h2>
              <p className="body-text reveal-up stagger-2" style={{ maxWidth: '420px' }}>
                Goat leather — specifically the full-grain hide of the Pashmina
                or Jharal goat — is among the most prized leathers in traditional
                European shoemaking. Its fine, tight grain means shoes that look
                immaculate after years of wear.
              </p>
            </div>
            <div
              className="reveal-fade stagger-2"
              style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}
            >
              <img
                src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85&fit=crop&crop=center"
                alt="Close-up fine grain goat leather texture"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.75) contrast(1.15)' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(122,92,62,0.15), transparent)',
                }}
              />
            </div>
          </div>

          {/* Comparison table */}
          <div className="reveal-up stagger-3">
            <table className="leather-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Goat Leather Advantage</th>
                </tr>
              </thead>
              <tbody>
                {leatherRows.map((row) => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #leather > div > div:first-of-type { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════
          SHIPPING
          ═══════════════════════════════════ */}
      <section
        className="section-pad"
        id="shipping"
        style={{ background: 'var(--dark-surface)' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <span className="label-text reveal-up">Logistics & Trust</span>
          <div className="gold-line" style={{ margin: '1.2rem 0 3rem' }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.6fr',
              gap: '6vw',
              alignItems: 'start',
              marginBottom: '4rem',
            }}
          >
            <div>
              <h2
                className="headline-md reveal-up stagger-1"
                style={{ color: 'var(--bone)', marginBottom: '1rem' }}
              >
                Crafted India.
                <br />
                <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>Delivered Europe.</em>
              </h2>
              <p className="body-text reveal-up stagger-2" style={{ maxWidth: '380px' }}>
                Every shipment is Delivered Duty Paid — meaning you pay nothing
                extra at customs. Your shoes arrive like a letter from a friend,
                not a package from a bureaucracy.
              </p>
            </div>

            {/* Animated map / route visual */}
            <div className="reveal-fade stagger-3">
              <ShippingMap />
            </div>
          </div>

          <div className="gold-divider" style={{ marginBottom: '3rem' }} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2px',
            }}
          >
            {shippingFeatures.map((f, i) => (
              <div key={f.title} className={`shipping-card reveal-up stagger-${i + 1}`}>
                {f.icon}
                <h3
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: '1.3rem',
                    fontWeight: 400,
                    color: 'var(--bone)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {f.title}
                </h3>
                <p className="body-text">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #shipping > div > div:first-of-type { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════
          QUOTE SECTION
          ═══════════════════════════════════ */}
      <section
        style={{
          background: 'var(--charcoal)',
          padding: '8rem 4vw',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60vmax',
            height: '60vmax',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,169,110,0.03) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <span
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              color: 'rgba(201,169,110,0.1)',
              lineHeight: 1,
              display: 'block',
              marginBottom: '-2rem',
            }}
          >
            "
          </span>
          <blockquote
            className="headline-sm reveal-up"
            style={{
              color: 'var(--bone)',
              fontStyle: 'italic',
              marginBottom: '2rem',
              lineHeight: 1.5,
            }}
          >
            A great shoe doesn't scream for attention.<br />
            It whispers authority.
          </blockquote>
          <cite
            className="label-text reveal-up stagger-1"
            style={{ color: 'var(--gold)', fontStyle: 'normal' }}
          >
            — The Artisan
          </cite>
        </div>
      </section>

      {/* ═══════════════════════════════════
          FOOTER
          ═══════════════════════════════════ */}
      <footer
        style={{
          background: 'var(--dark-surface)',
          padding: '4rem 4vw',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Left */}
          <div>
            <div
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.8rem',
                fontWeight: 300,
                letterSpacing: '0.1em',
                color: 'var(--bone)',
                marginBottom: '0.5rem',
              }}
            >
              AETH AN GRAEY
            </div>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                color: 'var(--stone)',
                fontStyle: 'italic',
                marginBottom: '1.5rem',
              }}
            >
              Walk with Intent. Lead with Authority.
            </p>
            <div className="gold-line" />
          </div>

          {/* Center */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
              }}
            >
              ✦
            </div>
          </div>

          {/* Right */}
          <div style={{ textAlign: 'right' }}>
            <p className="label-text" style={{ marginBottom: '1.2rem', color: 'var(--stone)' }}>Navigate</p>
            {[
              ['#collection', 'Shop'],
              ['#bespoke', 'Custom'],
              ['#about', 'About'],
              ['#leather', 'Leather'],
              ['#shipping', 'Shipping'],
              ['mailto:hello@aethangraey.com', 'Contact'],
            ].map(([href, label]) => (
              <div key={label} style={{ marginBottom: '0.6rem' }}>
                <a
                  href={href}
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    color: 'var(--stone)',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--gold)')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--stone)')}
                >
                  {label}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: '1400px',
            margin: '3rem auto 0',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(184,181,175,0.4)' }}>
            © 2025 AETH AN GRAEY. All rights reserved. Handcrafted in India. Shipped to Europe.
          </p>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(184,181,175,0.4)' }}>
            Pure Goat Leather · Artisan Footwear · DDP Europe
          </p>
        </div>

        <style>{`
          @media (max-width: 768px) {
            footer > div:first-child { grid-template-columns: 1fr !important; text-align: center; }
            footer > div:first-child > div:last-child { text-align: center !important; }
          }
        `}</style>
      </footer>

      {/* ═══════════════════════════════════
          STICKY MOBILE CTA
          ═══════════════════════════════════ */}
      <div className="sticky-cta">
        <a
          href="mailto:hello@aethangraey.com?subject=Bespoke%20Enquiry"
          className="btn-solid sticky-cta-btn"
          style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
        >
          <span>✦ &nbsp; Begin Bespoke Enquiry</span>
        </a>
      </div>
    </>
  );
}

// ── Shipping Map Component ────────────────────────────────────────────────────
function ShippingMap() {
  return (
    <div
      style={{
        background: 'var(--mid-surface)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Simplified world route visual */}
      <svg
        viewBox="0 0 600 280"
        style={{ width: '100%', height: 'auto' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* World silhouette - simplified continents */}
        <g opacity="0.06" fill="var(--bone)">
          {/* Europe */}
          <ellipse cx="290" cy="100" rx="55" ry="50" />
          {/* India */}
          <ellipse cx="420" cy="155" rx="30" ry="40" />
          {/* Africa */}
          <ellipse cx="280" cy="175" rx="40" ry="55" />
        </g>

        {/* Longitude/Latitude grid lines */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.5">
          {[60, 120, 180, 240, 300, 360, 420, 480, 540].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="280" />
          ))}
          {[50, 100, 140, 180, 220].map((y) => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} />
          ))}
        </g>

        {/* Route path: India → Europe (curved) */}
        <path
          d="M 415 158 C 380 130 330 110 285 105"
          stroke="var(--gold)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4 3"
          opacity="0.7"
        />

        {/* India dot */}
        <circle cx="415" cy="158" r="5" fill="var(--leather)" />
        <circle cx="415" cy="158" r="10" fill="none" stroke="var(--leather)" strokeWidth="1" opacity="0.4">
          <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="430" y="163" fontFamily="Montserrat" fontSize="7" fill="var(--stone)" letterSpacing="1">
          INDIA
        </text>

        {/* Europe dot */}
        <circle cx="285" cy="105" r="5" fill="var(--gold)" />
        <circle cx="285" cy="105" r="10" fill="none" stroke="var(--gold)" strokeWidth="1" opacity="0.4">
          <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite" begin="1s" />
          <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>
        <text x="255" y="95" fontFamily="Montserrat" fontSize="7" fill="var(--stone)" letterSpacing="1">
          EUROPE
        </text>

        {/* DDP Label */}
        <text x="330" y="128" fontFamily="Montserrat" fontSize="6" fill="var(--gold)" letterSpacing="2" textAnchor="middle">
          DDP · DUTY FREE
        </text>
      </svg>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {[
          ['7–14 Days', 'Crafting time'],
          ['DDP', 'Duty free delivery'],
          ['30+', 'EU countries'],
        ].map(([val, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.5rem',
                fontWeight: 300,
                color: 'var(--gold)',
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                color: 'var(--stone)',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
