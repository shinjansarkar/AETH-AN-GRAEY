'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { getProductByHandle } from '@/lib/shopify';
import type { ShopifyProductVariant } from '@/lib/shopify/types';

const EU_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45', '46'];

// Customization options (used as cart line attributes for bespoke orders)
const CUSTOMIZATION_OPTIONS = {
  'Toe Shape': ['Round', 'Chisel', 'Pointed'],
  'Leather Tone': ['Noir', 'Cognac', 'Bone', 'Burgundy', 'Tan'],
  'Sole Thickness': ['Ultra-thin', 'Classic', 'Storm Welt'],
  'Patina Finish': ['Natural', 'Hand-burnished', 'Antique'],
};

type Props = {
  productHandle: string;
  productName: string;
  bespoke?: boolean; // show customization panel
};

export default function AddToCartButton({ productHandle, productName, bespoke = false }: Props) {
  const { addToCart, loading } = useCart();
  const [open, setOpen] = useState(false);
  const [variants, setVariants] = useState<ShopifyProductVariant[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [fetchError, setFetchError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch variants when modal opens
  useEffect(() => {
    if (!open) return;
    setFetchError(false);
    getProductByHandle(productHandle)
      .then((product) => {
        if (product) {
          setVariants(product.variants.edges.map((e) => e.node));
        } else {
          setFetchError(true);
        }
      })
      .catch(() => setFetchError(true));
  }, [open, productHandle]);

  // Find matching variant for selected size
  const matchedVariant = variants.find((v) =>
    v.selectedOptions.some((o) => o.name.toLowerCase() === 'size' && o.value === selectedSize)
  ) ?? variants[0]; // fallback to first variant if only one

  const canAdd = selectedSize !== '' || variants.length === 1;

  const handleAdd = async () => {
    if (!matchedVariant) return;
    setAdding(true);

    const attributes = Object.entries(customizations)
      .filter(([, val]) => val)
      .map(([key, value]) => ({ key, value }));

    await addToCart({ variantId: matchedVariant.id, quantity: 1, attributes });
    setAdding(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setOpen(false);
      setSelectedSize('');
      setCustomizations({});
    }, 1200);
  };

  // WhatsApp pre-filled message with product name
  const waMessage = encodeURIComponent(
    `Hello, I'm interested in ordering the ${productName}. Please guide me through the bespoke process.`
  );
  const waUrl = `https://wa.me/917501220032?text=${waMessage}`;

  // Fallback — if Shopify not configured, show WhatsApp link
  const shopifyConfigured =
    !!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN && !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

  if (!shopifyConfigured || fetchError) {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="product-card-cta"
      >
        Order Bespoke →
      </a>
    );
  }

  return (
    <>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="product-card-cta"
      >
        Order Bespoke →
      </a>

      {/* Size + Customisation Modal */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(20,18,14,0.65)',
              zIndex: 10000,
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'min(520px, 92vw)',
              maxHeight: '90dvh',
              overflowY: 'auto',
              background: '#FAF9F7',
              zIndex: 10001,
              padding: '2.2rem',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.8rem' }}>
              <div>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.5rem', letterSpacing: '0.22em', color: '#9A9590', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  AETH AN GRAEY
                </p>
                <h3 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '1.4rem', fontWeight: 500, color: '#1A1916', margin: 0 }}>
                  {productName}
                </h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem', color: '#9A9590' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 2l14 14M16 2L2 16" />
                </svg>
              </button>
            </div>

            {/* Size selection — only show if product has size variants */}
            {variants.length > 1 && (
              <div style={{ marginBottom: '1.8rem' }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.52rem', letterSpacing: '0.18em', color: '#6B6760', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                  EU Size
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {variants.map((v) => {
                    const sizeVal = v.selectedOptions.find((o) => o.name.toLowerCase() === 'size')?.value ?? v.title;
                    const isSelected = selectedSize === sizeVal;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedSize(sizeVal)}
                        disabled={!v.availableForSale}
                        style={{
                          width: '48px',
                          height: '44px',
                          border: isSelected ? '1px solid #1A1916' : '1px solid #E8E6E1',
                          background: isSelected ? '#1A1916' : '#fff',
                          color: isSelected ? '#FAF9F7' : v.availableForSale ? '#1A1916' : '#D0CEC9',
                          fontFamily: 'Jost, sans-serif',
                          fontSize: '0.7rem',
                          cursor: v.availableForSale ? 'pointer' : 'not-allowed',
                          textDecoration: !v.availableForSale ? 'line-through' : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        {sizeVal}
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.5rem', color: '#9A9590', marginTop: '0.5rem' }}>
                  Not sure of your size? <a href="mailto:contact@aethangraey.com?subject=Size Guide" style={{ color: '#A8925A', textDecoration: 'none' }}>Contact us</a> for a fitting guide.
                </p>
              </div>
            )}

            {/* Bespoke customisations */}
            {bespoke && (
              <div style={{ marginBottom: '1.8rem' }}>
                <div style={{ borderTop: '1px solid #E8E6E1', paddingTop: '1.4rem' }}>
                  <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.52rem', letterSpacing: '0.18em', color: '#A8925A', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Custom Lab — Optional
                  </p>
                  {Object.entries(CUSTOMIZATION_OPTIONS).map(([label, options]) => (
                    <div key={label} style={{ marginBottom: '1rem' }}>
                      <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.5rem', letterSpacing: '0.14em', color: '#6B6760', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        {label}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {options.map((opt) => {
                          const isSelected = customizations[label] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() =>
                                setCustomizations((prev) =>
                                  isSelected ? { ...prev, [label]: '' } : { ...prev, [label]: opt }
                                )
                              }
                              style={{
                                padding: '0.4rem 0.9rem',
                                border: isSelected ? '1px solid #A8925A' : '1px solid #E8E6E1',
                                background: isSelected ? 'rgba(168,146,90,0.08)' : '#fff',
                                color: isSelected ? '#A8925A' : '#6B6760',
                                fontFamily: 'Jost, sans-serif',
                                fontSize: '0.55rem',
                                letterSpacing: '0.06em',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={handleAdd}
              disabled={!canAdd || adding || loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: success ? '#2D6A4F' : '#1A1916',
                color: '#FAF9F7',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.55rem',
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: !canAdd || adding ? 'not-allowed' : 'pointer',
                opacity: !canAdd ? 0.5 : 1,
                transition: 'background 0.3s',
              }}
            >
              {success ? '✓ Added to Cart' : adding ? 'Adding…' : !canAdd ? 'Select Your Size' : 'Add to Cart →'}
            </button>

            {/* Assurance note */}
            <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '0.48rem', color: '#9A9590', textAlign: 'center', marginTop: '0.8rem', letterSpacing: '0.08em' }}>
              Made to order · 4–6 weeks crafting period · DDP shipping · Free returns
            </p>
          </div>
        </>
      )}
    </>
  );
}
