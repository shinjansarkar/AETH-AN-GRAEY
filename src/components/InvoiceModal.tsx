'use client';

import React, { useRef, useState } from 'react';
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

  const generatePdfBlob = async (): Promise<{ blob: Blob; filename: string } | null> => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const element = invoiceRef.current;
      if (!element) return null;

      const originalStyle = element.style.cssText;
      element.style.position = 'relative';
      element.style.left = '0';
      element.style.top = '0';
      element.style.margin = '0';
      element.style.boxShadow = 'none';
      element.style.transform = 'none';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const fitWidth = canvas.width * ratio;
      const fitHeight = canvas.height * ratio;
      const x = (pdfWidth - fitWidth) / 2;

      pdf.addImage(imgData, 'JPEG', x, 0, fitWidth, fitHeight);

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
      if (!result) {
        throw new Error('PDF generation failed');
      }

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
      if (!result) {
        throw new Error('PDF generation failed');
      }

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
    <div className="invoice-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <style>{`
        .invoice-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          background: rgba(20, 18, 14, 0.72);
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
          border-radius: 28px;
          border: 1px solid var(--light-gray, #ebebeb);
          width: 100%;
          max-width: 1180px;
          box-shadow: 0 36px 110px rgba(0, 0, 0, 0.26);
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          overflow: hidden;
          max-height: 90vh;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .invoice-preview-area {
          padding: 2rem;
          overflow-y: auto;
          background:
            radial-gradient(circle at top left, rgba(168, 146, 90, 0.08), transparent 25%),
            linear-gradient(180deg, #fbfaf7 0%, #f6f3ee 100%);
          border-right: 1px solid var(--light-gray, #ebebeb);
        }

        .invoice-controls-area {
          padding: 2.75rem 2.25rem;
          background: linear-gradient(180deg, #f8f5ef 0%, #f4efe7 100%);
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

        .invoice-container {
          background: #ffffff;
          padding: 3.15rem 3.2rem 2.7rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
          border: 1px solid #e9e2d7;
          font-family: 'Jost', sans-serif;
          color: #1a1916;
          width: 100%;
          max-width: 780px;
          min-height: 1040px;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
          position: relative;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1.25rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #b79b5d;
        }

        .invoice-logo-group {
          display: flex;
          flex-direction: column;
        }

        .invoice-logo {
          font-family: 'Bodoni Moda', 'Cormorant Garamond', Georgia, serif;
          font-size: 1.75rem;
          font-weight: 400;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #1a1916;
          line-height: 1.08;
        }

        .invoice-logo-sub {
          font-size: 0.56rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a8925a;
          margin-top: 0.45rem;
        }

        .invoice-meta {
          text-align: right;
          font-family: 'Jost', sans-serif;
          padding-top: 0.15rem;
        }

        .invoice-title {
          font-family: 'Bodoni Moda', 'Cormorant Garamond', Georgia, serif;
          font-size: 2.45rem;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: #1a1916;
          margin: 0 0 0.45rem 0;
        }

        .invoice-meta-row {
          font-size: 0.86rem;
          color: #8e8881;
          margin-bottom: 0.28rem;
        }

        .invoice-meta-row strong {
          color: #1a1916;
          font-weight: 600;
        }

        .invoice-address-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.3rem;
          margin-bottom: 2rem;
        }

        .address-col-title {
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #a8925a;
          border-bottom: 1px solid #ebebeb;
          padding-bottom: 0.65rem;
          margin-bottom: 0.8rem;
          text-align: left;
        }

        .address-text {
          font-size: 0.88rem;
          line-height: 1.7;
          color: #2a2925;
          white-space: pre-wrap;
          text-align: left;
        }

        .address-text strong {
          color: #1a1916;
          display: block;
          margin-bottom: 0.22rem;
          font-weight: 600;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0.25rem;
          margin-bottom: 2.4rem;
        }

        .invoice-table th {
          background: #f8f6f1;
          border-bottom: 1px solid #a8925a;
          padding: 0.95rem 1rem;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7d786f;
          text-align: left;
        }

        .invoice-table td {
          padding: 1.35rem 1rem 1.2rem;
          border-bottom: 1px solid #ebebeb;
          font-size: 0.92rem;
          color: #1a1916;
          text-align: left;
        }

        .invoice-item-desc {
          font-family: 'Bodoni Moda', 'Cormorant Garamond', Georgia, serif;
          font-size: 1.32rem;
          font-weight: 500;
          color: #1a1916;
        }

        .invoice-item-meta {
          font-family: 'Jost', sans-serif;
          font-size: 0.67rem;
          color: #a39c95;
          margin-top: 0.28rem;
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
          margin-bottom: 2.6rem;
        }

        .invoice-summary-table {
          width: 330px;
          border-collapse: collapse;
        }

        .invoice-summary-table td {
          padding: 0.55rem 0.5rem;
          font-size: 0.86rem;
          color: #7a7570;
        }

        .invoice-summary-table td.price-cell {
          text-align: right;
          color: #1a1916;
          font-weight: 600;
        }

        .invoice-summary-table tr.total-row td {
          border-top: 1px solid #b79b5d;
          border-bottom: 2px double #b79b5d;
          padding: 1rem 0.5rem;
          font-family: 'Bodoni Moda', 'Cormorant Garamond', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 500;
          color: #1a1916;
        }

        .invoice-summary-table tr.total-row td.price-cell {
          color: #b79b5d;
        }

        .invoice-footer {
          border-top: 1px solid #e8e2d9;
          padding-top: 1.65rem;
          margin-top: auto;
          text-align: center;
          font-family: 'Bodoni Moda', 'Cormorant Garamond', Georgia, serif;
          font-size: 1.08rem;
          font-style: italic;
          color: #7a7570;
          letter-spacing: 0.01em;
        }

        .invoice-footer-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9a9590;
          margin-top: 0.5rem;
        }

        .controls-header {
          margin-bottom: 2rem;
        }

        .controls-title {
          font-family: 'Bodoni Moda', 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem;
          font-weight: 400;
          margin: 0 0 0.5rem 0;
          color: #1a1916;
        }

        .controls-desc {
          font-size: 0.9rem;
          color: #8a847d;
          line-height: 1.7;
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
          border-radius: 14px;
          font-weight: 500;
          font-size: 0.7rem;
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
          box-shadow: 0 10px 24px rgba(168, 146, 90, 0.22);
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

        @media (max-width: 640px) {
          .invoice-overlay {
            padding: 0.75rem;
          }

          .invoice-preview-area,
          .invoice-controls-area {
            padding: 1.25rem;
          }

          .invoice-container {
            padding: 2rem 1.4rem 1.8rem;
          }

          .invoice-header,
          .invoice-address-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .invoice-meta {
            text-align: left;
          }

          .invoice-title {
            font-size: 2rem;
          }

          .controls-title {
            font-size: 1.65rem;
          }
        }
      `}</style>

      <div className="invoice-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="invoice-preview-area">
          <div className="invoice-container" ref={invoiceRef} id={`invoice-container-${order.order_id}`}>
            <div className="invoice-header">
              <div className="invoice-logo-group">
                <span className="invoice-logo">Aeth An Graey</span>
                <span className="invoice-logo-sub">Luxury Footwear</span>
              </div>
              <div className="invoice-meta">
                <h2 className="invoice-title">Invoice</h2>
                <div className="invoice-meta-row">Invoice No: <strong>INV-{order.order_id}</strong></div>
                <div className="invoice-meta-row">Date: <strong>{formatDate(order.created_at)}</strong></div>
                <div className="invoice-meta-row">
                  Status: <strong style={{ color: order.payment_status === 'paid' ? '#2e7d32' : '#f57f17' }}>{order.payment_status.toUpperCase()}</strong>
                </div>
              </div>
            </div>

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
                  {order.delivery_address || '—'}
                </div>
              </div>
            </div>

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

            <div className="invoice-footer">
              "Crafting luxury, one step at a time."
              <div className="invoice-footer-sub">
                Thank you for selecting AETH AN GRAEY. Your footwear is handcrafted to order.
              </div>
            </div>
          </div>
        </div>

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
                Generate a high-fidelity HTML-to-PDF copy of the bill for Order <strong>{order.order_id}</strong>.
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
