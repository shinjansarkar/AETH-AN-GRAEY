'use client';

import { useEffect, useState } from 'react';
import Preloader from '@/components/Preloader';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import MarqueeBanner from '@/components/MarqueeBanner';

/* ────────────────────────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────────────────────────── */
const products = [
  {
    id: 'signature-oxford',
    name: 'Signature Oxford',
    material: 'Full-Grain Goat Leather',
    desc: 'Cap-Toe · Welt Stitched · Single Sole',
    best: 'Executives · Lawyers · Boardrooms',
    price: '€ 299',
    tag: 'Signature',
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=90&fit=crop&crop=center',
  },
  {
    id: 'signature-monk',
    name: 'Signature Monk Strap',
    material: 'Burnished Goat Leather',
    desc: 'Double Buckle · Hand-lasted · Storm Welt',
    best: 'Style-conscious professionals',
    price: '€ 319',
    tag: 'Statement',
    img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800&q=90&fit=crop&crop=center',
  },
  {
    id: 'signature-chelsea',
    name: 'Signature Chelsea Boot',
    material: 'Smooth Goat Leather',
    desc: 'Elastic Gusset · Single Sole · Pull Tab',
    best: 'Paris · Berlin aesthetic · Smart casual',
    price: '€ 329',
    tag: 'New',
    img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=90&fit=crop&crop=center',
  },
];

const shoeTypes = [
  {
    title: 'Oxford',
    sub: 'Authority in its purest form',
    tag: 'Most Formal',
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=700&q=85&fit=crop&crop=center',
  },
  {
    title: 'Monk Strap',
    sub: 'Confidence with character',
    tag: 'Statement',
    img: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=700&q=85&fit=crop&crop=center',
  },
  {
    title: 'Chelsea Boot',
    sub: 'Minimal. Sharp. Eternal.',
    tag: 'European Icon',
    img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=700&q=85&fit=crop&crop=center',
  },
];

const customParams = [
  { label: 'Toe Shape', options: 'Round · Chisel · Pointed' },
  { label: 'Leather Tone', options: 'Noir · Cognac · Bone · Burgundy · Tan' },
  { label: 'Sole Thickness', options: 'Ultra-thin · Classic · Storm Welt' },
  { label: 'Stitch Density', options: 'Invisible · Standard · Accent' },
  { label: 'Patina Finish', options: 'Natural · Hand-burnished · Antique' },
];

const leatherRows = [
  { feature: 'Weight', value: 'Ultra-light — 30% lighter than cowhide' },
  { feature: 'Breathability', value: 'Natural micro-pores allow air circulation' },
  { feature: 'Durability', value: 'Tensile strength surpasses most bovine leathers' },
  { feature: 'Texture', value: 'Fine, tight grain — elegantly uniform' },
  { feature: 'Flexibility', value: 'Conforms to foot instantly, zero break-in' },
  { feature: 'Aging', value: 'Develops rich patina over years of wear' },
];

const bespokeSteps = [
  { num: '01', title: 'Consultation', desc: 'Digital measurement session. Share dimensions, style references, and functional needs.' },
  { num: '02', title: 'Selection', desc: 'Choose leather, colour, sole and construction. Every decision is yours.' },
  { num: '03', title: 'Creation', desc: 'Hand-lasted and stitched by a single artisan over 15–20 hours. No shortcuts.' },
];

const shippingFeatures = [
  {
    title: 'DDP — No Surprises',
    desc: 'Delivered Duty Paid. No customs fees. No border invoices. The price you see is what you pay.',
    icon: (
      <svg className="ship-icon" viewBox="0 0 40 40" fill="none" strokeWidth="1.2" stroke="currentColor">
        <rect x="3" y="10" width="34" height="22" rx="1" />
        <path d="M3 16h34M13 22h4" />
      </svg>
    ),
  },
  {
    title: '7–14 Day Crafting',
    desc: 'Each pair made individually — not from a factory line. Time is part of the quality.',
    icon: (
      <svg className="ship-icon" viewBox="0 0 40 40" fill="none" strokeWidth="1.2" stroke="currentColor">
        <circle cx="20" cy="20" r="16" /><path d="M20 10v10l6 4" />
      </svg>
    ),
  },
  {
    title: 'Fully Tracked',
    desc: 'Real-time tracking from atelier to your address across Europe. Always in the loop.',
    icon: (
      <svg className="ship-icon" viewBox="0 0 40 40" fill="none" strokeWidth="1.2" stroke="currentColor">
        <path d="M20 4l2.5 7.5H30l-6.3 4.5 2.4 7.5L20 19l-6.1 4.5 2.4-7.5L10 11.5h7.5z" />
      </svg>
    ),
  },
  {
    title: 'Ships to All EU',
    desc: 'Germany, France, Italy, Spain, Netherlands, Scandinavia — every EU destination.',
    icon: (
      <svg className="ship-icon" viewBox="0 0 40 40" fill="none" strokeWidth="1.2" stroke="currentColor">
        <circle cx="20" cy="20" r="16" />
        <path d="M20 4C20 4 12 13 12 20s8 16 8 16 8-9 8-16-8-16-8-16z" />
        <path d="M4 20h32" />
      </svg>
    ),
  },
];

/* ────────────────────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setImgLoaded(true), 200);

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

    return () => { clearTimeout(t); observer.disconnect(); };
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navbar />

      {/* ══════════════════════════════════════════
          HERO — C&J editorial, full-bleed
          ══════════════════════════════════════════ */}
      <section
        className="hero"
        id="hero"
        style={{ marginTop: 'calc(62px + 36px)' }}
      >
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1920&q=90&fit=crop&crop=center"
            alt="Signature Oxford — AETH AN GRAEY handcrafted goat leather"
            className={imgLoaded ? 'loaded' : ''}
            onLoad={() => setImgLoaded(true)}
          />
        </div>
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-season-label reveal-up">
            The Signature Collection · Pure Goat Leather
          </span>

          <h1 className="hero-title reveal-up stagger-1">
            AETH<br />AN<br />GRAEY
          </h1>

          <p className="hero-subtitle reveal-up stagger-2">
            The Architecture of Elegance.
          </p>

          <div className="hero-actions reveal-up stagger-3">
            <button className="btn-primary" onClick={() => scrollTo('collection')}>
              The Collection
            </button>
            <button className="btn-secondary" onClick={() => scrollTo('custom-lab')}>
              Custom Lab
            </button>
          </div>
        </div>

        <div className="hero-scroll">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-outer" style={{ padding: '0.9rem 0' }}>
        <MarqueeBanner />
      </div>

      {/* ══════════════════════════════════════════
          STATS
          ══════════════════════════════════════════ */}
      <div className="stats-row">
        {[
          { num: '3', label: 'Signature Models' },
          { num: '15+', label: 'Hours per Pair' },
          { num: '100%', label: 'Pure Goat Leather' },
          { num: '1', label: 'Artisan. Always.' },
        ].map((s) => (
          <div key={s.label} className="stat-cell reveal-fade">
            <span className="stat-num">{s.num}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          PHILOSOPHY — C&J article-style two panel
          ══════════════════════════════════════════ */}
      <section className="philosophy-grid" id="about">
        <div className="philosophy-img reveal-fade">
          <img
            src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1000&q=90&fit=crop&crop=center"
            alt="Artisan crafting leather dress shoe"
          />
        </div>

        <div className="philosophy-text">
          <span className="section-label reveal-up">Philosophy</span>
          <div className="gold-rule reveal-up stagger-1" />
          <h2 className="philosophy-headline reveal-up stagger-1">
            Three Models.<br /><em>One Standard.</em><br />No Compromise.
          </h2>
          <p className="philosophy-body reveal-up stagger-2">
            Luxury brands grow through curation, not volume. That is why AETH AN GRAEY
            offers exactly three Signature Models — each one perfected over hundreds of
            iterations. No filler. No compromise. Just the Oxford, the Monk Strap,
            and the Chelsea Boot.
          </p>
          <p className="philosophy-body reveal-up stagger-3">
            Every pair is hand-lasted, stitched, and finished by a single artisan.
            I source pure goat leather for its unmatched grain fineness and the way
            it responds to the human foot over decades of wear.
          </p>
          <button
            className="btn-dark reveal-up stagger-4"
            onClick={() => scrollTo('collection')}
            style={{ alignSelf: 'flex-start' }}
          >
            Explore Models
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COLLECTION — C&J 3-column product grid
          ══════════════════════════════════════════ */}
      <section
        className="section-pad"
        id="collection"
        style={{ background: '#F8F7F5' }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

          {/* C&J-style collection header with nav tabs */}
          <div className="collection-header">
            <div>
              <span className="section-label" style={{ marginBottom: '0.4rem' }}>
                Aeth An Graey
              </span>
              <h2 className="collection-headline reveal-up">
                The Three Signatures
              </h2>
            </div>
            <div className="collection-nav reveal-up stagger-1">
              <span className="collection-nav-item active">All</span>
              <span className="collection-nav-item">Oxford</span>
              <span className="collection-nav-item">Monk Strap</span>
              <span className="collection-nav-item">Chelsea Boot</span>
            </div>
          </div>

          {/* Product cards */}
          <div className="product-grid product-grid-3">
            {products.map((p, i) => (
              <div
                key={p.id}
                className="product-card reveal-up"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="product-card-img-wrap">
                  <img src={p.img} alt={p.name} loading="lazy" />
                  <span className="product-card-tag">{p.tag}</span>
                  <div className="product-card-overlay">
                    <button
                      className="product-card-overlay-btn"
                      onClick={() => scrollTo('custom-lab')}
                    >
                      Order Bespoke
                    </button>
                  </div>
                </div>
                <div className="product-card-body">
                  <div className="product-card-name">{p.name}</div>
                  <div className="product-card-material">{p.material}</div>
                  <div
                    style={{
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.58rem',
                      fontWeight: 300,
                      letterSpacing: '0.04em',
                      color: '#9A9590',
                      marginBottom: '0.6rem',
                      lineHeight: 1.7,
                    }}
                  >
                    {p.desc}
                  </div>
                  <div className="product-card-footer">
                    <span className="product-card-price">{p.price}</span>
                    <button
                      className="product-card-cta"
                      onClick={() => scrollTo('custom-lab')}
                    >
                      Order Bespoke →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p
            className="reveal-up"
            style={{
              marginTop: '2.5rem',
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.5rem',
              letterSpacing: '0.22em',
              color: '#9A9590',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            All shoes are made-to-order · Every pair individually crafted · DDP shipping to Europe
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EDITORIAL BANNER — C&J full-width story
          ══════════════════════════════════════════ */}
      <div
        className="editorial-banner"
        style={{ cursor: 'pointer' }}
        onClick={() => scrollTo('about')}
      >
        <img
          src="https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1920&q=88&fit=crop&crop=center"
          alt="The Crockett & Jones Way — 100% Made in England"
          loading="lazy"
        />
        <div className="editorial-banner-overlay">
          <div className="editorial-banner-content">
            <span className="editorial-eyebrow">100% Handcrafted</span>
            <h2 className="editorial-title">
              The AETH AN GRAEY<br />Way
            </h2>
            <p className="editorial-body">
              In a world of mass production and hollow promises, every pair carries
              the fingerprints of a single artisan. This is what craftsmanship means.
            </p>
            <button className="btn-primary" onClick={(e) => { e.stopPropagation(); scrollTo('about'); }}>
              Read the Story
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          CATEGORY STRIP — C&J style image tiles
          ══════════════════════════════════════════ */}
      <div className="category-strip">
        {shoeTypes.map((cat) => (
          <div
            key={cat.title}
            className="category-card"
            onClick={() => scrollTo('collection')}
          >
            <img src={cat.img} alt={cat.title} loading="lazy" />
            <div className="category-card-overlay" />
            <div className="category-card-tag-top">{cat.tag}</div>
            <div className="category-card-label">
              <span className="category-card-title">{cat.title}</span>
              <span className="category-card-sub">{cat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          CUSTOM LAB
          ══════════════════════════════════════════ */}
      <section id="custom-lab" className="custom-lab-section">
        <div className="custom-lab-inner">
          <div className="custom-lab-grid">
            <div>
              <span
                className="section-label reveal-up"
                style={{ color: '#A8925A' }}
              >
                AETH AN GRAEY
              </span>
              <div className="gold-rule reveal-up stagger-1" />
              <h2 className="custom-lab-headline reveal-up stagger-1">
                Custom<br /><em>Lab.</em>
              </h2>
              <p className="custom-lab-body reveal-up stagger-2">
                Begin with any of the three Signature Models. Then customise
                every detail — from toe shape to patina finish. The result is
                uniquely, irreversibly yours.
              </p>
            </div>

            {/* Parameters */}
            <div className="reveal-up stagger-2">
              {customParams.map((p) => (
                <div key={p.label} className="param-row">
                  <span className="param-label">{p.label}</span>
                  <span className="param-options">{p.options}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.2rem' }} />
            </div>
          </div>

          {/* Three base models */}
          <div className="model-grid-dark reveal-up">
            {[
              { model: 'Oxford', price: '€ 299', note: 'From the boardroom outward.' },
              { model: 'Monk Strap', price: '€ 319', note: 'The European signature.' },
              { model: 'Chelsea Boot', price: '€ 329', note: 'Built for every season.' },
            ].map((m, i) => (
              <div
                key={m.model}
                className="model-card-dark"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="model-num">0{i + 1}</div>
                <div className="model-name">{m.model}</div>
                <div className="model-note">{m.note}</div>
                <div className="model-price">{m.price}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="reveal-up" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href="mailto:hello@aethangraey.com?subject=Custom%20Lab%20Enquiry"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.88rem 2.4rem',
                background: '#A8925A',
                color: '#141210',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.55rem',
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: '1px solid #A8925A',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                (e.currentTarget as HTMLAnchorElement).style.color = '#A8925A';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#A8925A';
                (e.currentTarget as HTMLAnchorElement).style.color = '#141210';
              }}
            >
              Begin Custom Enquiry
            </a>
            <button
              onClick={() => scrollTo('bespoke')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.88rem 2.4rem',
                background: 'transparent',
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.55rem',
                fontWeight: 400,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)';
              }}
            >
              How It Works →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECOND EDITORIAL BANNER — Bespoke process
          ══════════════════════════════════════════ */}
      <div
        className="editorial-banner right-align"
        style={{ cursor: 'pointer' }}
        onClick={() => scrollTo('bespoke')}
      >
        <img
          src="https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1920&q=88&fit=crop&crop=center"
          alt="AETH AN GRAEY Winter collection"
          loading="lazy"
        />
        <div className="editorial-banner-overlay">
          <div className="editorial-banner-content" style={{ textAlign: 'right' }}>
            <span className="editorial-eyebrow">The Bespoke Process</span>
            <h2 className="editorial-title">
              Your Vision.<br />My Hands.
            </h2>
            <p className="editorial-body">
              A bespoke shoe is an intimate collaboration. You bring the vision —
              I bring fifteen years of atelier discipline and pure goat leather.
            </p>
            <button className="btn-primary" onClick={(e) => { e.stopPropagation(); scrollTo('bespoke'); }}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BESPOKE PROCESS
          ══════════════════════════════════════════ */}
      <section className="bespoke-grid" id="bespoke">
        <div className="bespoke-img reveal-fade">
          <img
            src="https://images.unsplash.com/photo-1603487742131-4160ec999306?w=1000&q=90&fit=crop&crop=center"
            alt="Monk Strap — AETH AN GRAEY bespoke detail"
          />
        </div>

        <div className="bespoke-text">
          <span className="section-label reveal-up">The Process</span>
          <div className="gold-rule reveal-up stagger-1" />
          <h2 className="bespoke-headline reveal-up stagger-1">
            Your Vision.<br /><em>My Hands.</em>
          </h2>
          <p className="process-body reveal-up stagger-2" style={{ maxWidth: '380px', marginBottom: '2rem' }}>
            A bespoke shoe is an intimate collaboration. You bring the vision — I bring
            fifteen years of atelier discipline and pure goat leather.
          </p>

          <div className="reveal-up stagger-3">
            {bespokeSteps.map((step) => (
              <div key={step.num} className="process-step">
                <div className="process-num">{step.num}</div>
                <div>
                  <div className="process-title">{step.title}</div>
                  <p className="process-body">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="price-callout reveal-up stagger-4">
            <div className="price-callout-label">Starting from</div>
            <div className="price-callout-amount">€ 299</div>
            <div className="price-callout-note">Free DDP shipping to Europe included</div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="reveal-up stagger-5">
            <a href="mailto:hello@aethangraey.com?subject=Bespoke%20Enquiry" className="btn-dark">
              Begin Enquiry
            </a>
            <button className="btn-ghost-dark" onClick={() => scrollTo('leather')}>
              Learn About Leather
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LEATHER SCIENCE
          ══════════════════════════════════════════ */}
      <section id="leather" style={{ background: '#fff' }}>
        <div className="section-pad" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="leather-split">
            <div>
              <span className="section-label reveal-up">Material Science</span>
              <div className="gold-rule reveal-up stagger-1" />
              <h2 className="leather-headline reveal-up stagger-1">
                Why Goat<br /><em>Leather?</em>
              </h2>
              <p className="process-body reveal-up stagger-2" style={{ maxWidth: '360px', marginBottom: '2.5rem' }}>
                Goat leather — specifically the full-grain hide of the Pashmina or Jharal goat —
                is among the most prized materials in traditional European shoemaking. Its fine,
                tight grain produces shoes that look immaculate after years of wear.
              </p>

              <div className="reveal-up stagger-3">
                <table className="info-table">
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

            <div
              className="reveal-fade stagger-2"
              style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/5' }}
            >
              <img
                src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=900&q=90&fit=crop&crop=center"
                alt="Fine grain goat leather Oxford close-up"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.75) contrast(1.1)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          QUOTE
          ══════════════════════════════════════════ */}
      <section className="quote-section">
        <div className="quote-bg-text">AETH</div>
        <div className="quote-gold-line reveal-fade" />
        <blockquote className="quote-text reveal-up stagger-1">
          A great shoe doesn&apos;t scream for attention.<br />
          It whispers authority.
        </blockquote>
        <cite className="quote-cite reveal-up stagger-2">— The Artisan</cite>
      </section>

      {/* ══════════════════════════════════════════
          SHIPPING
          ══════════════════════════════════════════ */}
      <section className="section-pad" id="shipping" style={{ background: '#F8F7F5' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6vw', alignItems: 'center', marginBottom: '4rem' }}>
            <div>
              <span className="section-label reveal-up">Logistics &amp; Trust</span>
              <div className="gold-rule reveal-up stagger-1" />
              <h2
                className="reveal-up stagger-1"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(2rem, 4vw, 4rem)',
                  fontWeight: 300,
                  lineHeight: 0.95,
                  color: '#1A1916',
                  letterSpacing: '-0.01em',
                }}
              >
                Crafted India.<br />
                <em style={{ color: '#7A6B48', fontStyle: 'italic' }}>Delivered Europe.</em>
              </h2>
            </div>
            <div className="reveal-up stagger-2">
              <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', fontWeight: 300, color: '#5A5651', lineHeight: 2, marginBottom: '2rem' }}>
                Every shipment is Delivered Duty Paid — you pay nothing extra at customs.
                Your shoes arrive like a letter from a friend, not a package from a bureaucracy.
              </p>
              <div style={{ border: '1px solid #D8D5D0', padding: '1.4rem 1.8rem', display: 'inline-block' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 300, color: '#1A1916', marginBottom: '0.2rem' }}>
                  All Duties Paid.
                </div>
                <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.46rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9A9590' }}>
                  No Hidden Fees. No Surprises.
                </div>
              </div>
            </div>
          </div>

          <div className="ship-grid">
            {shippingFeatures.map((f, i) => (
              <div key={f.title} className={`ship-card reveal-up stagger-${i + 1}`}>
                {f.icon}
                <div className="ship-card-title">{f.title}</div>
                <p className="ship-body">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="map-wrap reveal-up" style={{ marginTop: '3rem' }}>
            <ShippingMap />
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #shipping > div > div:first-child { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER
          ══════════════════════════════════════════ */}
      <div className="newsletter-strip">
        <div className="reveal-left">
          <h3 className="newsletter-heading">Join the<br />Inner Circle.</h3>
          <p className="newsletter-sub">New launches, craft stories, and exclusive early access.</p>
        </div>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            className="newsletter-input"
            aria-label="Email address"
          />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
      </div>

      {/* ══════════════════════════════════════════
          FOOTER — C&J style with top bar
          ══════════════════════════════════════════ */}
      <footer className="site-footer">
        {/* Top row: brand + socials */}
        <div className="footer-top-bar">
          <div>
            <span className="footer-brand-name">AETH AN GRAEY</span>
            <span className="footer-brand-tagline">The Architecture of Elegance</span>
          </div>
          <div className="footer-socials">
            <a href="mailto:hello@aethangraey.com" className="footer-social-link">Email</a>
            <a href="#" className="footer-social-link">Instagram</a>
            <a href="#" className="footer-social-link">Pinterest</a>
          </div>
        </div>

        {/* Column grid */}
        <div className="footer-grid">
          <div>
            <p className="footer-desc">
              Three Signature Models. Pure goat leather. One artisan.
              Zero assembly lines. Delivered DDP to Europe. Starting from € 299.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Collection</div>
            {['Signature Oxford', 'Signature Monk Strap', 'Signature Chelsea Boot', 'Custom Lab'].map((l) => (
              <a key={l} href="#collection" className="footer-link"
                onClick={(e) => { e.preventDefault(); scrollTo(l === 'Custom Lab' ? 'custom-lab' : 'collection'); }}>
                {l}
              </a>
            ))}
          </div>

          <div>
            <div className="footer-col-title">Information</div>
            {[
              ['about', 'About'],
              ['leather', 'Leather Science'],
              ['shipping', 'Shipping & DDP'],
              ['bespoke', 'Bespoke Process'],
              ['custom-lab', 'Custom Lab'],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="footer-link"
                onClick={(e) => { e.preventDefault(); scrollTo(id); }}>
                {label}
              </a>
            ))}
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            <a href="mailto:hello@aethangraey.com" className="footer-link">hello@aethangraey.com</a>
            <a href="#custom-lab" className="footer-link"
              onClick={(e) => { e.preventDefault(); scrollTo('custom-lab'); }}>
              Start Custom Enquiry
            </a>
            <div style={{ marginTop: '1.8rem', borderTop: '1px solid #EBEBEB', paddingTop: '1.4rem' }}>
              <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.44rem', fontWeight: 500, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#9A9590', marginBottom: '0.4rem' }}>
                Starting from
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 300, color: '#1A1916' }}>€ 299</div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© 2025 AETH AN GRAEY. All rights reserved. Handcrafted in India.</span>
          <span className="footer-copy">Oxford · Monk Strap · Chelsea Boot · DDP Europe</span>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="sticky-cta">
        <a href="mailto:hello@aethangraey.com?subject=Custom%20Lab%20Enquiry" className="sticky-cta-btn">
          ✦ &nbsp; Begin Custom Enquiry
        </a>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Shipping Map
   ──────────────────────────────────────────────────────────────────── */
function ShippingMap() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.48rem', fontWeight: 500, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#9A9590', marginBottom: '0.4rem' }}>
            Atelier to Door
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.7rem', fontWeight: 300, color: '#1A1916' }}>
            India → Europe
          </div>
        </div>
        <div style={{ display: 'flex', gap: '3rem' }}>
          {[['7–14', 'Crafting Days'], ['DDP', 'Duty Free'], ['30+', 'EU Countries']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '1rem', fontWeight: 400, color: '#1A1916', letterSpacing: '-0.01em' }}>{val}</div>
              <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.42rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#9A9590', marginTop: '0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 600 220" style={{ width: '100%', height: 'auto' }} xmlns="http://www.w3.org/2000/svg">
        <g stroke="#EBEBEB" strokeWidth="0.5">
          {[80, 160, 240, 320, 400, 480, 560].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="220" />)}
          {[44, 88, 132, 176].map((y) => <line key={y} x1="0" y1={y} x2="600" y2={y} />)}
        </g>
        <g fill="#E8E6E2">
          <ellipse cx="270" cy="95" rx="55" ry="42" opacity="0.7" />
          <ellipse cx="400" cy="140" rx="28" ry="35" opacity="0.7" />
          <ellipse cx="250" cy="160" rx="38" ry="48" opacity="0.5" />
        </g>
        <path d="M 396 138 C 360 114 320 102 272 98" stroke="#A8925A" strokeWidth="1.5" fill="none" strokeDasharray="5 4" opacity="0.8" />
        <circle cx="396" cy="138" r="5" fill="#1A1916" />
        <circle cx="396" cy="138" r="12" fill="none" stroke="#1A1916" strokeWidth="0.8" opacity="0.2">
          <animate attributeName="r" from="7" to="20" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.3" to="0" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text x="407" y="142" fontFamily="Jost, sans-serif" fontSize="7" fill="#2A2925" fontWeight="500" letterSpacing="1.5">INDIA</text>
        <circle cx="272" cy="98" r="5" fill="#A8925A" />
        <circle cx="272" cy="98" r="12" fill="none" stroke="#A8925A" strokeWidth="0.8" opacity="0.2">
          <animate attributeName="r" from="7" to="20" dur="2.5s" repeatCount="indefinite" begin="1.2s" />
          <animate attributeName="opacity" from="0.3" to="0" dur="2.5s" repeatCount="indefinite" begin="1.2s" />
        </circle>
        <text x="240" y="88" fontFamily="Jost, sans-serif" fontSize="7" fill="#2A2925" fontWeight="500" letterSpacing="1.5">EUROPE</text>
        <rect x="312" y="103" width="52" height="18" fill="#1A1916" rx="0" />
        <text x="338" y="115" fontFamily="Jost, sans-serif" fontSize="5.5" fill="#A8925A" letterSpacing="1.5" textAnchor="middle" fontWeight="500">DDP FREE</text>
      </svg>
    </div>
  );
}
