'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';
import type { ShopifyCartLine } from '@/lib/shopify/types';

export default function CartDrawer() {
  const { cart, cartOpen, closeCart, updateCartLine, removeCartLine, loading } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen]);

  const lines: ShopifyCartLine[] = cart?.lines.edges.map((e) => e.node) ?? [];
  const isEmpty = lines.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(20,18,14,0.6)',
          zIndex: 9998,
          opacity: cartOpen ? 1 : 0,
          pointerEvents: cartOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: 'min(440px, 100vw)',
          height: '100dvh',
          background: '#FAF9F7',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          transform: cartOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: '-12px 0 60px rgba(20,18,14,0.18)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.6rem 1.8rem',
            borderBottom: '1px solid #E8E6E1',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: '"Bodoni Moda", Georgia, serif',
                fontSize: '1.15rem',
                fontWeight: 500,
                color: '#1A1916',
                letterSpacing: '0.02em',
              }}
            >
              Your Selection
            </span>
            {cart && cart.totalQuantity > 0 && (
              <span
                style={{
                  marginLeft: '0.6rem',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.55rem',
                  letterSpacing: '0.18em',
                  color: '#9A9590',
                  textTransform: 'uppercase',
                }}
              >
                {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem',
              color: '#6B6760',
              lineHeight: 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 2l14 14M16 2L2 16" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isEmpty ? '3rem 1.8rem' : '0' }}>
          {isEmpty ? (
            <div style={{ textAlign: 'center' }}>
              <svg
                width="52"
                height="52"
                viewBox="0 0 52 52"
                fill="none"
                stroke="#C8C4BC"
                strokeWidth="1.2"
                style={{ marginBottom: '1.2rem' }}
              >
                <path d="M10 14h32l-4 22H14L10 14z" />
                <path d="M6 8h6l4 22" />
                <circle cx="19" cy="42" r="2" />
                <circle cx="35" cy="42" r="2" />
              </svg>
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.55rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#9A9590',
                  marginBottom: '0.5rem',
                }}
              >
                Your cart is empty
              </p>
              <p
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.75rem',
                  color: '#B8B4AE',
                  marginBottom: '1.8rem',
                }}
              >
                Add a signature model to begin your order.
              </p>
              <button
                onClick={closeCart}
                style={{
                  padding: '0.78rem 2rem',
                  background: '#1A1916',
                  color: '#FAF9F7',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.52rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  onUpdate={updateCartLine}
                  onRemove={removeCartLine}
                  disabled={loading}
                />
              ))}
            </ul>
          )}
        </div>

        {/* Footer — totals + checkout */}
        {!isEmpty && cart && (
          <div
            style={{
              borderTop: '1px solid #E8E6E1',
              padding: '1.4rem 1.8rem 1.8rem',
              background: '#FAF9F7',
            }}
          >
            {/* Order note */}
            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.5rem',
                letterSpacing: '0.14em',
                color: '#9A9590',
                textTransform: 'uppercase',
                marginBottom: '1rem',
                lineHeight: 1.6,
              }}
            >
              Made to order · 4–6 weeks crafting period · DDP shipping to all EU
            </p>

            {/* Subtotal */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '0.5rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.6rem',
                  letterSpacing: '0.12em',
                  color: '#6B6760',
                  textTransform: 'uppercase',
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: '"Bodoni Moda", Georgia, serif',
                  fontSize: '1.1rem',
                  color: '#1A1916',
                }}
              >
                {formatPrice(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
              </span>
            </div>

            <p
              style={{
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.5rem',
                color: '#9A9590',
                marginBottom: '1.2rem',
              }}
            >
              Taxes and shipping calculated at checkout
            </p>

            {/* Checkout Button */}
            <a
              href={cart.checkoutUrl}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                background: '#1A1916',
                color: '#FAF9F7',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.55rem',
                fontWeight: 500,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textAlign: 'center',
                textDecoration: 'none',
                border: '1px solid #1A1916',
                transition: 'background 0.25s, color 0.25s',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginBottom: '0.75rem',
              }}
            >
              {loading ? 'Updating…' : 'Proceed to Checkout →'}
            </a>

            {/* Secure note */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                color: '#9A9590',
              }}
            >
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="1" y="5" width="8" height="7" rx="1" />
                <path d="M3 5V3.5a2 2 0 014 0V5" />
              </svg>
              <span
                style={{
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.48rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                Secure checkout via Shopify
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Cart Line Item ───────────────────────────────────────────────────────────

function CartLineItem({
  line,
  onUpdate,
  onRemove,
  disabled,
}: {
  line: ShopifyCartLine;
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  disabled: boolean;
}) {
  const { merchandise, quantity, attributes, cost } = line;
  const customAttrs = attributes.filter((a) => !a.key.startsWith('_'));

  return (
    <li
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1.2rem 1.8rem',
        borderBottom: '1px solid #E8E6E1',
      }}
    >
      {/* Product image */}
      <div
        style={{
          flexShrink: 0,
          width: '80px',
          height: '96px',
          background: '#F0EEE9',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {merchandise.product.featuredImage ? (
          <Image
            src={merchandise.product.featuredImage.url}
            alt={merchandise.product.featuredImage.altText ?? merchandise.product.title}
            fill
            sizes="80px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8C4BC" strokeWidth="1">
              <path d="M2 8h20M6 8V5a1 1 0 011-1h10a1 1 0 011 1v3M4 8l2 13h12l2-13" />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontFamily: '"Bodoni Moda", Georgia, serif',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: '#1A1916',
            margin: '0 0 0.2rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {merchandise.product.title}
        </p>
        <p
          style={{
            fontFamily: 'Jost, sans-serif',
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            color: '#9A9590',
            textTransform: 'uppercase',
            margin: '0 0 0.4rem',
          }}
        >
          {merchandise.selectedOptions.map((o) => o.value).join(' · ')}
        </p>

        {/* Custom attributes */}
        {customAttrs.length > 0 && (
          <div style={{ marginBottom: '0.5rem' }}>
            {customAttrs.map((a) => (
              <span
                key={a.key}
                style={{
                  display: 'inline-block',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '0.48rem',
                  letterSpacing: '0.08em',
                  color: '#A8925A',
                  textTransform: 'uppercase',
                  marginRight: '0.5rem',
                }}
              >
                {a.key}: {a.value}
              </span>
            ))}
          </div>
        )}

        {/* Qty + price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
            <button
              onClick={() => quantity > 1 ? onUpdate(line.id, quantity - 1) : onRemove(line.id)}
              disabled={disabled}
              aria-label="Decrease quantity"
              style={qtyBtnStyle}
            >
              −
            </button>
            <span
              style={{
                width: '28px',
                textAlign: 'center',
                fontFamily: 'Jost, sans-serif',
                fontSize: '0.75rem',
                color: '#1A1916',
              }}
            >
              {quantity}
            </span>
            <button
              onClick={() => onUpdate(line.id, quantity + 1)}
              disabled={disabled}
              aria-label="Increase quantity"
              style={qtyBtnStyle}
            >
              +
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span
              style={{
                fontFamily: '"Bodoni Moda", Georgia, serif',
                fontSize: '0.95rem',
                color: '#1A1916',
              }}
            >
              {formatPrice(cost.totalAmount.amount, cost.totalAmount.currencyCode)}
            </span>
            <button
              onClick={() => onRemove(line.id)}
              disabled={disabled}
              aria-label="Remove item"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.2rem',
                color: '#C8C4BC',
                lineHeight: 1,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: '26px',
  height: '26px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: '1px solid #E8E6E1',
  cursor: 'pointer',
  fontFamily: 'Jost, sans-serif',
  fontSize: '0.85rem',
  color: '#6B6760',
  lineHeight: 1,
};
