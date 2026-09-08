'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from './Navbar';
import Footer from './Footer'; // Assuming there's a footer

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_status: string;
  count: number;
  description: string;
  image_url: string;
  created_at: string;
};

export default function CollectionClient({ products, dbCategories = [] }: { products: Product[], dbCategories?: string[] }) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Use dbCategories if provided, otherwise extract from products
  const uniqueCategories = dbCategories.length > 0 
    ? dbCategories 
    : Array.from(new Set(products.map(p => p.category)));

  const categories = ['All', ...uniqueCategories];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F7F5' }}>
      <Navbar />

      <main style={{ flex: 1, paddingTop: '120px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 5%' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ 
              fontFamily: '"Bodoni Moda", Georgia, serif', 
              fontSize: '3rem', 
              color: '#1A1916',
              marginBottom: '1rem'
            }}>
              The Collection
            </h1>
            <p style={{ 
              fontFamily: 'Jost, sans-serif',
              fontSize: '0.8rem',
              color: '#7A6B48',
              letterSpacing: '0.2em',
              textTransform: 'uppercase'
            }}>
              Masterpieces crafted by hand
            </p>
          </div>

          {/* Category Pills */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem', 
            flexWrap: 'wrap',
            marginBottom: '4rem' 
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.6rem 1.5rem',
                  borderRadius: '50px',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: activeCategory === cat ? '1px solid #141210' : '1px solid rgba(0,0,0,0.1)',
                  backgroundColor: activeCategory === cat ? '#141210' : '#FFF',
                  color: activeCategory === cat ? '#FFF' : '#141210',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1C7B7" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <h2 style={{ fontFamily: '"Bodoni Moda", serif', fontSize: '1.8rem', color: '#1A1916', marginBottom: '1rem' }}>
                No pieces found
              </h2>
              <p style={{ fontFamily: 'Jost, sans-serif', color: '#7A6B48' }}>
                We are currently crafting new masterpieces for this collection.
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '2rem' 
            }}>
              {filteredProducts.map(product => (
                <div key={product.id} style={{ backgroundColor: '#FFF', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/5', marginBottom: '1.5rem', overflow: 'hidden' }}>
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name} 
                        fill 
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: '#F0EFEB' }} />
                    )}
                    {product.stock_status && (
                      <span style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        backgroundColor: '#141210',
                        color: '#FFF',
                        fontSize: '0.6rem',
                        padding: '0.3rem 0.6rem',
                        fontFamily: 'Jost, sans-serif',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase'
                      }}>
                        {product.stock_status}
                      </span>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.6rem', color: '#9A9590', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                      {product.category}
                    </div>
                    <h3 style={{ fontFamily: '"Bodoni Moda", serif', fontSize: '1.2rem', color: '#1A1916', marginBottom: '0.5rem' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.8rem', color: '#5F5A55', marginBottom: '1rem', lineHeight: 1.5 }}>
                      {product.description}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', borderTop: '1px solid #EFEBE6', paddingTop: '1rem' }}>
                    <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 500 }}>
                      € {product.price}
                    </span>
                    <button style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #141210',
                      padding: '0.5rem 1rem',
                      fontFamily: 'Jost, sans-serif',
                      fontSize: '0.65rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
