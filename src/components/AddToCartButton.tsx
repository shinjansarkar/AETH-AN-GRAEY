'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './AddToCartButton.module.css';

type Props = {
  productHandle: string;
  productName: string;
  productAmount: number;
  productImage?: string;
  currency?: string;
  bespoke?: boolean;
};

type OrderFormState = {
  fullName: string;
  email: string;
  deliveryAddress: string;
  phoneNumber: string;
  shoeSize: string;
};

type FormErrors = Partial<Record<keyof OrderFormState, string>>;

const DEFAULT_FORM: OrderFormState = {
  fullName: '',
  email: '',
  deliveryAddress: '',
  phoneNumber: '',
  shoeSize: '',
};

const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45', '46'];

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function AddToCartButton({
  productHandle,
  productName,
  productAmount,
  productImage,
  currency = 'EUR',
}: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OrderFormState>(DEFAULT_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'creating' | 'processing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [mounted, setMounted] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const totalLabel = useMemo(() => formatPrice(productAmount, currency), [productAmount, currency]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.setTimeout(() => firstFieldRef.current?.focus(), 80);
  }, [open]);

  const resetAndClose = () => {
    setOpen(false);
    setStatus('idle');
    setMessage('');
    setOrderId('');
    setErrors({});
    setForm(DEFAULT_FORM);
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = 'Enter the customer name';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) nextErrors.email = 'Enter a valid email address';
    if (!form.deliveryAddress.trim()) nextErrors.deliveryAddress = 'Enter a full delivery address';
    if (!/^\+?[0-9 ()-]{7,}$/.test(form.phoneNumber.trim())) nextErrors.phoneNumber = 'Enter a valid phone number';
    if (!form.shoeSize.trim()) nextErrors.shoeSize = 'Select a shoe size';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    setMessage('');
    if (!validate()) return;

    try {
      setStatus('creating');
      const createResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          productName,
          productHandle,
          productAmount,
          currency,
        }),
      });

      const createData = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(createData?.message ?? 'Unable to create the order');
      }

      setOrderId(createData.orderId);
      setStatus('processing');
      if (!createData.checkoutUrl) {
        throw new Error('Stripe checkout URL was not returned');
      }

      window.location.assign(createData.checkoutUrl);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to start payment');
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.orderButton}
        onClick={() => setOpen(true)}
        aria-label={`Order now for ${productName}`}
      >
        Order Now
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {open && (
          <>
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              onClick={resetAndClose}
            />

            <motion.div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.mediaPanel} style={{ backgroundImage: `url(${productImage || '/oxford-stand.webp'})` }}>
                <div className={styles.mediaOverlay} />
                <div className={styles.orderSummaryOverlay}>
                  <div className={styles.orderSummaryLabel}>ORDER SUMMARY</div>
                  <h2 className={styles.orderSummaryTitle}>{productName}</h2>
                  
                  <div className={styles.priceRow}>
                    <span>Retail Price</span>
                    <span>{totalLabel}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Shipping (Express)</span>
                    <span>€0.00</span>
                  </div>
                  
                  <div className={styles.totalRow}>
                    <span>TOTAL</span>
                    <span>{totalLabel}</span>
                  </div>

                  <div className={styles.madeToOrderBox}>
                    <div className={styles.mtoHeader}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"/></svg>
                      <span>MADE TO ORDER</span>
                    </div>
                    <p className={styles.mtoText}>
                      Each pair is handcrafted upon request. Please allow 4–6 weeks for meticulous construction and quality assurance before delivery.
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.formPanel}>
                <button className={styles.closeButtonTopRight} type="button" onClick={resetAndClose} aria-label="Close form">
                  ✕
                </button>
                
                <div className={styles.formContainer}>
                  <div className={styles.stepsHeader}>
                    <div className={`${styles.step} ${status === 'success' ? styles.stepInactive : styles.stepActive}`}>
                      <span className={styles.stepNum}>01</span>
                      <span className={styles.stepText}>INFORMATION</span>
                    </div>
                    <div className={styles.stepDivider} />
                    <div className={`${styles.step} ${status === 'success' ? styles.stepActive : styles.stepInactive}`}>
                      <span className={styles.stepNum}>02</span>
                      <span className={styles.stepText}>STRIPE CHECKOUT</span>
                    </div>
                  </div>

                  {status === 'success' ? (
                    <div className={styles.successState}>
                      <div className={styles.successBadge}>Payment successful</div>
                      <h4 className={styles.successTitle}>Thank You.</h4>
                      <p className={styles.successText}>
                        Your order has been confirmed and our team has been notified.
                      </p>
                      <div className={styles.successMeta}>
                        <span>Order ID</span>
                        <strong>{orderId || 'Pending'}</strong>
                      </div>
                      <button type="button" className={styles.submitBtn} onClick={resetAndClose}>
                        RETURN TO BOUTIQUE
                      </button>
                    </div>
                  ) : (
                    <form className={styles.formGrid} onSubmit={(event) => { event.preventDefault(); void handleProceedToPayment(); }}>
                      {message && status === 'error' && <div className={styles.errorBanner}>{message}</div>}

                      <div className={styles.sectionTitle}>PERSONAL INFORMATION</div>
                      
                      <label className={`${styles.field} ${styles.fullWidth}`}>
                        <span>FULL NAME</span>
                        <input
                          ref={firstFieldRef}
                          value={form.fullName}
                          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                          aria-invalid={!!errors.fullName}
                          placeholder="ALEXANDER VANCE"
                        />
                        {errors.fullName && <em>{errors.fullName}</em>}
                      </label>
                      
                      <label className={styles.field}>
                        <span>EMAIL ADDRESS</span>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                          aria-invalid={!!errors.email}
                          placeholder="vance@heritage.com"
                        />
                        {errors.email && <em>{errors.email}</em>}
                      </label>
                      
                      <label className={styles.field}>
                        <span>PHONE NUMBER</span>
                        <input
                          type="tel"
                          value={form.phoneNumber}
                          onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                          aria-invalid={!!errors.phoneNumber}
                          placeholder="+33 (0) 1 23 45 67 89"
                        />
                        {errors.phoneNumber && <em>{errors.phoneNumber}</em>}
                      </label>

                      <div className={styles.sectionTitle}>DELIVERY DETAILS</div>
                      
                      <label className={`${styles.field} ${styles.fullWidth}`}>
                        <span>SHIPPING ADDRESS</span>
                        <textarea
                          rows={3}
                          value={form.deliveryAddress}
                          onChange={(event) => setForm((prev) => ({ ...prev, deliveryAddress: event.target.value }))}
                          aria-invalid={!!errors.deliveryAddress}
                          placeholder="12 AVENUE MONTAIGNE, PARIS 75008"
                        />
                        {errors.deliveryAddress && <em>{errors.deliveryAddress}</em>}
                      </label>

                      <div className={styles.sectionTitle}>SHOE SELECTION</div>

                      <label className={`${styles.field} ${styles.fullWidth}`}>
                        <span>SIZE (EU)</span>
                        <select
                          value={form.shoeSize}
                          onChange={(event) => setForm((prev) => ({ ...prev, shoeSize: event.target.value }))}
                          aria-invalid={!!errors.shoeSize}
                        >
                          <option value="">Select size</option>
                          {SHOE_SIZES.map((size) => (
                            <option key={size} value={size}>EU {size}</option>
                          ))}
                        </select>
                        {errors.shoeSize && <em>{errors.shoeSize}</em>}
                      </label>

                      <button className={styles.submitBtn} type="submit" disabled={status === 'creating' || status === 'processing'}>
                        {status === 'creating' ? 'CREATING ORDER…' : status === 'processing' ? 'OPENING PAYMENT…' : 'PROCEED TO PAYMENT'}
                      </button>
                      
                      <div className={styles.secureText}>
                        SECURE ENCRYPTED TRANSACTION
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}