'use client';

import React, { useState, useRef } from 'react';
import { type AdminOrder } from '@/lib/order-service';

interface InvoiceModalProps {
  order: AdminOrder;
  onClose: () => void;
}

export default function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  // Generate the PDF using client-side libraries
  const generatePdfBlob = async (): Promise<{ blob: Blob; filename: string } | null> => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = invoiceRef.current;
      if (!element) return null;

      // Temporary styles to force full visibility during capture
      const originalStyle = element.style.cssText;
      element.style.position = 'relative';
      element.style.left = '0';
      element.style.top = '0';
      element.style.margin = '0';
      element.style.boxShadow = 'none';
      element.style.transform = 'none';

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Restore original styling
      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate fit
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const fitWidth = imgWidth * ratio;
      const fitHeight = imgHeight * ratio;
      
      const x = (pdfWidth - fitWidth) / 2;
      const y = 0; // align at top

      pdf.addImage(imgData, 'JPEG', x, y, fitWidth, fitHeight);
      
      const blob = pdf.output('blob');
      const filename = `Invoice_${order.order_id}.pdf`;
      return { blob, filename };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setStatusMessage(null);
    try {
      const result = await generatePdfBlob();
      if (!result) throw new Error('PDF generation failed');

      // Create download link
      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatusMessage({ type: 'success', text: 'Invoice PDF downloaded successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to download PDF.' });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    setStatusMessage(null);
    try {
      const result = await generatePdfBlob();
      if (!result) throw new Error('PDF generation failed');

      // Build Multipart Form Data
      const formData = new FormData();
      formData.append('pdf', result.blob, result.filename);
      formData.append('orderId', order.order_id);
      formData.append('customerName', order.customer_name);
      formData.append('customerEmail', order.customer_email);
      formData.append('productName', order.product_name);
      formData.append('amountFormatted', formatAmount(order.amount_minor, order.currency));

      const res = await fetch('/api/invoices/send', {
        method: 'POST',
        body: formData,
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to send invoice via email');
      }

      setStatusMessage({
        type: 'success',
        text: `Invoice emailed successfully from shinjansarkar268@gmail.com to shinjansarkar7@gmail.com!`,
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to email invoice PDF.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="invoice-overlay" role="dialog" aria-modal="true">
      <style>{`
        .invoice-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          background: rgba(20, 18, 14, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow-y: auto;
          animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .invoice-modal-card {
          background: var(--white, #ffffff);
          border-radius: 24px;
          border: 1px solid var(--light-gray, #ebebeb);
          width: 100%;
          max-width: 900px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.25);
          display: grid;
          grid-template-columns: 1fr 340px;
          overflow: hidden;
          max-height: 90vh;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .invoice-preview-area {
          padding: 2.5rem;
          overflow-y: auto;
          background: #fcfcfc;
          border-right: 1px solid var(--light-gray, #ebebeb);
        }

        .invoice-controls-area {
          padding: 2.5rem 2rem;
          background: var(--off-white, #f8f7f5);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow-y: auto;
          max-height: 100%;
          gap: 2rem;
        }

        .controls-top-group {
          display: flex;
          flex-direction: column;
        }

        .controls-bottom-group {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Premium custom scrollbar for invoice preview and control areas */
        .invoice-preview-area::-webkit-scrollbar,
        .invoice-controls-area::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .invoice-preview-area::-webkit-scrollbar-track,
        .invoice-controls-area::-webkit-scrollbar-track {
          background: transparent;
        }

        .invoice-preview-area::-webkit-scrollbar-thumb,
        .invoice-controls-area::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.15);
          border-radius: 3px;
        }

        .invoice-preview-area::-webkit-scrollbar-thumb:hover,
        .invoice-controls-area::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }

        /* Pure Premium Branded Invoice styling */
        .invoice-container {
          background: #ffffff;
          padding: 3rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          border: 1px solid #e8e2d9;
          font-family: 'Jost', sans-serif;
          color: #1a1916;
          width: 100%;
          min-width: 500px;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #a8925a;
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
        }

        .invoice-logo-group {
          display: flex;
          flex-direction: column;
        }

        .invoice-logo {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #1a1916;
          line-height: 1.2;
        }

        .invoice-logo-sub {
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a8925a;
          margin-top: 0.3rem;
        }

        .invoice-meta {
          text-align: right;
          font-family: 'Jost', sans-serif;
        }

        .invoice-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2.2rem;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #1a1916;
          margin: 0 0 0.5rem 0;
        }

        .invoice-meta-row {
          font-size: 0.8rem;
          color: #7a7570;
          margin-bottom: 0.25rem;
        }

        .invoice-meta-row strong {
          color: #1a1916;
          font-weight: 500;
        }

        .invoice-address-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }

        .address-col-title {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a8925a;
          border-bottom: 1px solid #ebebeb;
          padding-bottom: 0.5rem;
          margin-bottom: 0.8rem;
          text-align: left;
        }

        .address-text {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #2a2925;
          white-space: pre-wrap;
          text-align: left;
        }

        .address-text strong {
          color: #1a1916;
          display: block;
          margin-bottom: 0.2rem;
          font-weight: 500;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2.5rem;
        }

        .invoice-table th {
          background: #fbfaf8;
          border-bottom: 1px solid #a8925a;
          padding: 0.9rem 1rem;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7a7570;
          text-align: left;
        }

        .invoice-table td {
          padding: 1.2rem 1rem;
          border-bottom: 1px solid #ebebeb;
          font-size: 0.9rem;
          color: #1a1916;
          text-align: left;
        }

        .invoice-item-desc {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 500;
          color: #1a1916;
        }

        .invoice-item-meta {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          color: #9a9590;
          margin-top: 0.2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .invoice-table th.num-col,
        .invoice-table td.num-col {
          text-align: right;
        }

        .invoice-summary-container {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 3rem;
        }

        .invoice-summary-table {
          width: 320px;
          border-collapse: collapse;
        }

        .invoice-summary-table td {
          padding: 0.6rem 0.5rem;
          font-size: 0.85rem;
          color: #7a7570;
        }

        .invoice-summary-table td.price-cell {
          text-align: right;
          color: #1a1916;
          font-weight: 500;
        }

        .invoice-summary-table tr.total-row td {
          border-top: 1px solid #a8925a;
          border-bottom: 2px double #a8925a;
          padding: 1rem 0.5rem;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: #1a1916;
        }

        .invoice-summary-table tr.total-row td.price-cell {
          color: #a8925a;
        }

        .invoice-footer {
          border-top: 1px solid #e8e2d9;
          padding-top: 1.5rem;
          text-align: center;
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          font-style: italic;
          color: #7a7570;
          letter-spacing: 0.02em;
        }

        .invoice-footer-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #9a9590;
          margin-top: 0.5rem;
        }

        /* Control Panel */
        .controls-header {
          margin-bottom: 2rem;
        }

        .controls-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          margin: 0 0 0.5rem 0;
          color: #1a1916;
        }

        .controls-desc {
          font-size: 0.78rem;
          color: #7a7570;
          line-height: 1.5;
        }

        .control-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .btn-action {
          width: 100%;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 500;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          border: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
        }

        .btn-action-primary {
          background: #1a1916;
          color: #ffffff;
        }

        .btn-action-primary:hover:not(:disabled) {
          background: #a8925a;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(168, 146, 90, 0.2);
        }

        .btn-action-secondary {
          background: #ffffff;
          border: 1px solid #d8d5d0;
          color: #2a2925;
        }

        .btn-action-secondary:hover:not(:disabled) {
          border-color: #1a1916;
          color: #1a1916;
          transform: translateY(-2px);
        }

        .btn-action-close {
          background: transparent;
          color: #7a7570;
          border: 1px solid transparent;
        }

        .btn-action-close:hover {
          color: #1a1916;
          border-color: #d8d5d0;
        }

        .btn-action:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-alert {
          padding: 1rem 1.25rem;
          border-radius: 14px;
          font-size: 0.8rem;
          line-height: 1.5;
          animation: slideUp 0.3s ease forwards;
        }

        .status-success {
          background: #e8f5e9;
          border: 1px solid #c8e6c9;
          color: #2e7d32;
        }

        .status-error {
          background: #ffebee;
          border: 1px solid #ffcdd2;
          color: #c62828;
        }

        /* Spinner animation */
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 960px) {
          .invoice-modal-card {
            grid-template-columns: 1fr;
            max-height: 95vh;
          }

          .invoice-preview-area {
            border-right: none;
            border-bottom: 1px solid var(--light-gray, #ebebeb);
            max-height: 55vh;
          }

          .invoice-controls-area {
            padding: 2rem;
          }
        }
      `}</style>

      <div className="invoice-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Left Side: Invoice Preview */}
        <div className="invoice-preview-area">
          <div className="invoice-container" ref={invoiceRef} id={`invoice-container-${order.order_id}`}>
            {/* Header */}
            <div className="invoice-header">
              <div className="invoice-logo-group">
                <span className="invoice-logo">Aeth An Graey</span>
                <span className="invoice-logo-sub">Luxury Footwear</span>
              </div>
              <div className="invoice-meta">
                <h2 className="invoice-title">Invoice</h2>
                <div className="invoice-meta-row">Invoice No: <strong>INV-{order.order_id}</strong></div>
                <div className="invoice-meta-row">Date: <strong>{formatDate(order.created_at)}</strong></div>
                <div className="invoice-meta-row">Status: <strong style={{ color: order.payment_status === 'paid' ? '#2e7d32' : '#f57f17' }}>{order.payment_status.toUpperCase()}</strong></div>
              </div>
            </div>

            {/* Billing Address Details */}
            <div className="invoice-address-grid">
              <div>
                <div className="address-col-title">Company Info</div>
                <div className="address-text">
                  <strong>Aeth An Graey Ltd.</strong>
                  Luxury Footwear Workshop<br />
                  contact@aethangraey.com<br />
                  www.aethangraey.com
                </div>
              </div>
              <div>
                <div className="address-col-title">Billed To</div>
                <div className="address-text">
                  <strong>{order.customer_name}</strong>
                  {order.customer_email}<br />
                  {order.phone_number && <>Phone: {order.phone_number}<br /></>}
                  {order.delivery_address}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="num-col">Qty</th>
                  <th className="num-col">Unit Price</th>
                  <th className="num-col">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="invoice-item-desc">{order.product_name}</div>
                    <div className="invoice-item-meta">Shoe Size: {order.shoe_size}</div>
                  </td>
                  <td className="num-col">1</td>
                  <td className="num-col">{formatAmount(order.amount_minor, order.currency)}</td>
                  <td className="num-col">{formatAmount(order.amount_minor, order.currency)}</td>
                </tr>
              </tbody>
            </table>

            {/* Summary */}
            <div className="invoice-summary-container">
              <table className="invoice-summary-table">
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td className="price-cell">{formatAmount(order.amount_minor, order.currency)}</td>
                  </tr>
                  <tr>
                    <td>VAT / Duties (Incl.)</td>
                    <td className="price-cell">{formatAmount(0, order.currency)}</td>
                  </tr>
                  <tr className="total-row">
                    <td>Total Due</td>
                    <td className="price-cell">{formatAmount(order.amount_minor, order.currency)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="invoice-footer">
              "Crafting luxury, one step at a time."
              <div className="invoice-footer-sub">
                Thank you for selecting AETH AN GRAEY. Your footwear is handcrafted to order.
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Control Actions */}
        <div className="invoice-controls-area">
          <div className="controls-top-group">
            <button 
              onClick={onClose} 
              className="btn-back-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'none',
                border: 'none',
                color: '#7a7570',
                fontSize: '0.62rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '0',
                marginBottom: '1.5rem',
                alignSelf: 'flex-start',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#1a1916')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#7a7570')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '12px', height: '12px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Dashboard
            </button>

            <div className="controls-header">
              <h3 className="controls-title">Invoice Manager</h3>
              <p className="controls-desc">
                Generate a high-fidelity PDF copy of the bill for Order <strong>{order.order_id}</strong>.
              </p>
            </div>

            <div className="control-buttons">
              <button
                onClick={handleDownload}
                className="btn-action btn-action-secondary"
                disabled={isDownloading || isSending}
              >
                {isDownloading ? <span className="spinner" /> : null}
                {isDownloading ? 'Generating PDF...' : 'Download PDF'}
              </button>

              <button
                onClick={handleSendEmail}
                className="btn-action btn-action-primary"
                disabled={isDownloading || isSending}
              >
                {isSending ? <span className="spinner" /> : null}
                {isSending ? 'Sending Email...' : 'Email PDF Invoice'}
              </button>

              <div style={{ fontSize: '0.7rem', color: '#9a9590', lineHeight: 1.45, marginTop: '0.5rem' }}>
                <strong>Mailing Config:</strong><br />
                Source: <em>shinjansarkar268@gmail.com</em><br />
                Destination: <em>shinjansarkar7@gmail.com</em>
              </div>
            </div>
          </div>

          <div className="controls-bottom-group">
            {statusMessage ? (
              <div className={`status-alert ${statusMessage.type === 'success' ? 'status-success' : 'status-error'}`}>
                {statusMessage.text}
              </div>
            ) : null}

            <button onClick={onClose} className="btn-action btn-action-close" disabled={isDownloading || isSending}>
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
