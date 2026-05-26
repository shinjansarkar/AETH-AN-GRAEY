'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Preloader from '@/components/Preloader';
import CursorGlow from '@/components/CursorGlow';
import Navbar from '@/components/Navbar';
import AddToCartButton from '@/components/AddToCartButton';
import Footer from '@/components/Footer';

const apparelProducts = [
  {
    id: 'ag-01-jacket',
    shopifyHandle: 'ag-01-moto-jacket',
    name: 'AG-01 MOTO JACKET',
    material: 'Vegetable-Tanned Calfskin Leather',
    desc: 'Asymmetric zipper closure · Heavy hardware · Handcrafted paneling · Grayscale washed finish',
    price: '€ 1,250',
    tag: 'New Drop',
    category: 'New Arrivals',
    img: 'https://images.unsplash.com/photo-1599568723850-14196ee0f991?q=80&w=1196&auto=format&fit=crop',
  },
  {
    id: 'ag-02-trench',
    shopifyHandle: 'ag-02-oversized-trench',
    name: 'AG-02 OVERSIZED TRENCH',
    material: 'Italian Virgin Wool Blend',
    desc: 'Double-breasted silhouette · Drop shoulders · Architectural shoulder framing · Deep pockets',
    price: '€ 890',
    tag: 'Essential',
    category: 'Essentials',
    img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=687&auto=format&fit=crop',
  },
  {
    id: 'ag-03-tee',
    shopifyHandle: 'ag-03-architectural-tee',
    name: 'AG-03 ARCHITECTURAL TEE',
    material: '380GSM Heavy Organic Cotton',
    desc: 'Structured high rib neck · Boxy drape silhouette · Split side hem detailing · Grayscale tones',
    price: '€ 150',
    tag: 'Oversized',
    category: 'Oversized Tees',
    img: 'https://images.unsplash.com/photo-1764636695674-2c4fde2381d6?q=80&w=1332&auto=format&fit=crop',
  },
  {
    id: 'ag-04-hoodie',
    shopifyHandle: 'ag-04-draped-hoodie',
    name: 'AG-04 DRAPED HOODIE',
    material: '480GSM Heavy French Terry',
    desc: 'Seamless integrated side pockets · Deep architectural hood · Custom dropped sleeves',
    price: '€ 290',
    tag: 'Essential',
    category: 'Essentials',
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1920&q=90&fit=crop',
  },
  {
    id: 'ag-05-sneaker',
    shopifyHandle: 'ag-05-aeth-sneaker',
    name: 'AETH SNEAKER 01',
    material: 'Goat & Sheep Leather Blend',
    desc: 'Signature Oxford Sneaker styling · Fine brogue detailing · Minimalist cupsole · Cloud cushion',
    price: '€ 345',
    tag: 'Limited',
    category: 'Limited Drops',
    img: '/signature-oxford-sneakers.webp',
  },
  {
    id: 'ag-06-duffel',
    shopifyHandle: 'ag-06-leather-duffel',
    name: 'AG-06 LEATHER DUFFEL',
    material: 'Full-Grain Calfskin Leather',
    desc: 'Brushed steel hardware accents · Removable shoulder strap · Suede luxury lining',
    price: '€ 590',
    tag: 'Accessory',
    category: 'Accessories',
    img: 'https://images.unsplash.com/photo-1650154281741-498255ad3513?q=80&w=735&auto=format&fit=crop',
  },
];

const categories = ['All', 'New Arrivals', 'Essentials', 'Oversized Tees', 'Limited Drops', 'Accessories'];

export default function CollectionPage() {
  const [activeCategory, setActiveCategory] = useState('All');

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
  }, [activeCategory]);

  const filteredProducts = activeCategory === 'All'
    ? apparelProducts
    : apparelProducts.filter((p) => p.category === activeCategory);

  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navbar />

      <main style={{ background: '#FAF9F6', color: '#000', paddingTop: '62px' }}>
        {/* ══════════════════════════════════════════
            COLLECTION SECTION
            ══════════════════════════════════════════ */}
        <section className="section-pad" id="collection" style={{ minHeight: '90vh' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            
            {/* High-Fashion Grid Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '5rem' }}>
              <span className="section-label reveal-up" style={{ color: '#777', letterSpacing: '0.45em' }}>
                AETHANGRAEY STUDIO
              </span>
              <div className="gold-rule reveal-up stagger-1" style={{ background: '#000', margin: '1rem auto 2.5rem', width: '30px' }} />
              <h1 className="reveal-up stagger-1" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2.5rem, 5vw, 5rem)', fontWeight: 500, letterSpacing: '0.22em', lineHeight: 1, textTransform: 'uppercase' }}>
                CAPSULE COLLECTION
              </h1>
              <p className="reveal-up stagger-2" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', fontWeight: 300, letterSpacing: '0.15em', color: '#777', textTransform: 'uppercase', marginTop: '1.2rem' }}>
                Hand-assembled drops · Limited quantities · Worldwide shipping
              </p>
            </div>

            {/* SECONDARY CATEGORY NAVBAR / TABS */}
            <div className="reveal-up" style={{
              display: 'flex',
              justifyContent: 'center',
              borderTop: '1px solid #eee',
              borderBottom: '1px solid #eee',
              padding: '1.2rem 0',
              marginBottom: '4rem',
              gap: '2vw',
              flexWrap: 'wrap'
            }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.58rem',
                    fontWeight: activeCategory === cat ? 500 : 300,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: activeCategory === cat ? '#000' : '#888',
                    cursor: 'pointer',
                    padding: '0.4rem 1.2rem',
                    transition: 'all 0.3s ease',
                    borderBottom: activeCategory === cat ? '1px solid #000' : '1px solid transparent'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Monochromatic Product Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '3rem 2rem'
            }}>
              {filteredProducts.map((p, i) => (
                <div
                  key={p.id}
                  className="product-card reveal-up"
                  style={{
                    transitionDelay: `${i * 0.05}s`,
                    background: '#fff',
                    border: '1px solid #eee',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Visual card cover */}
                  <div className="product-card-img-wrap" style={{ aspectRatio: '3/4', position: 'relative', overflow: 'hidden' }}>
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      sizes="(max-width: 500px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      style={{ objectFit: 'cover', objectPosition: 'center', filter: 'grayscale(1) contrast(1.1)' }}
                      loading="lazy"
                    />
                    <span className="product-card-tag" style={{ background: '#000', color: '#fff', fontSize: '0.4rem', letterSpacing: '0.15em' }}>
                      {p.tag}
                    </span>
                  </div>

                  {/* Body contents */}
                  <div className="product-card-body" style={{ padding: '1.8rem', borderTop: '1px solid #eee', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                      <h3 className="product-card-name" style={{ fontSize: '0.78rem', letterSpacing: '0.08em', fontWeight: 500 }}>
                        {p.name}
                      </h3>
                      <span className="product-card-price" style={{ fontSize: '0.78rem', fontWeight: 400, color: '#000' }}>
                        {p.price}
                      </span>
                    </div>

                    <div className="product-card-material" style={{ fontFamily: 'var(--font-serif)', fontSize: '0.8rem', color: '#777', fontStyle: 'italic', marginBottom: '1.2rem' }}>
                      {p.material}
                    </div>

                    <p style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.62rem',
                      fontWeight: 300,
                      color: '#555',
                      lineHeight: 1.8,
                      marginBottom: '2rem',
                      flex: 1
                    }}>
                      {p.desc}
                    </p>

                    {/* Shoe Size Selection Simulator */}
                    <div className="product-card-size-section" style={{ borderTop: '1px solid #f5f5f5', paddingTop: '1.2rem', marginBottom: '1.8rem' }}>
                      <span className="product-card-size-label" style={{ fontSize: '0.44rem', letterSpacing: '0.2em', color: '#777' }}>
                        SELECT SIZE (BESPOKE)
                      </span>
                      <div className="product-card-size-row" style={{ marginTop: '0.6rem' }}>
                        <select style={{
                          width: '100%',
                          background: 'transparent',
                          border: '1px solid #eee',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.6rem',
                          padding: '0.6rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          outline: 'none',
                          cursor: 'pointer'
                        }}>
                          <option value="">Choose size (EU 38-46 / S-XXL)</option>
                          <option value="s">Size S / EU 39</option>
                          <option value="m">Size M / EU 41</option>
                          <option value="l">Size L / EU 43</option>
                          <option value="xl">Size XL / EU 45</option>
                        </select>
                      </div>
                    </div>

                    {/* Purchasing checkout CTAs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <AddToCartButton
                        productHandle={p.shopifyHandle}
                        productName={p.name}
                        productAmount={Number.parseFloat(p.price.replace(/[^0-9.]/g, ''))}
                        productImage={p.img}
                      />
                      <button
                        onClick={() => {}}
                        style={{
                          background: '#000',
                          color: '#fff',
                          border: '1px solid #000',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.52rem',
                          fontWeight: 500,
                          letterSpacing: '0.25em',
                          textTransform: 'uppercase',
                          padding: '0.78rem 1.2rem',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                          (e.currentTarget as HTMLButtonElement).style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#000';
                          (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                        }}
                      >
                        BUY NOW
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
