'use client';

import React, { useState } from 'react';
import { type AdminOrder } from '@/lib/order-service';
import InvoiceModal from '@/components/InvoiceModal';
import styles from './admin.module.css';

interface AdminTableClientProps {
  initialOrders: AdminOrder[];
}

export default function AdminTableClient({ initialOrders }: AdminTableClientProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<AdminOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<AdminOrder | null>(null);

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
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const handleDelete = async () => {
    if (!orderToDelete) return;
    const orderId = orderToDelete.order_id;

    try {
      const res = await fetch('/api/orders/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete order');
      }

      // Remove from local list state instantly
      setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
      setOrderToDelete(null);
    } catch (err: any) {
      alert(`Error deleting order: ${err.message}`);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("No orders available to export.");
      return;
    }

    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Phone Number',
      'Delivery Address',
      'Product Name',
      'Shoe Size',
      'Amount',
      'Currency',
      'Payment Status',
      'Order Status',
      'Transaction ID',
      'Created At',
      'Paid At'
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '';
      const stringVal = String(val);
      if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
        return `"${stringVal.replace(/"/g, '""')}"`;
      }
      return stringVal;
    };

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const order of orders) {
      const row = [
        escapeCSV(order.order_id),
        escapeCSV(order.customer_name),
        escapeCSV(order.customer_email),
        escapeCSV(order.phone_number),
        escapeCSV(order.delivery_address),
        escapeCSV(order.product_name),
        escapeCSV(order.shoe_size),
        escapeCSV(order.amount_minor),
        escapeCSV(order.currency),
        escapeCSV(order.payment_status),
        escapeCSV(order.order_status),
        escapeCSV(order.transaction_id),
        escapeCSV(order.created_at),
        escapeCSV(order.paid_at)
      ];
      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aethangraey_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--stone)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500 }}>
          Showing {orders.length} order{orders.length === 1 ? '' : 's'}
        </span>
        <button
          onClick={handleExportCSV}
          className="action-btn-export"
          title="Export these orders as CSV for Excel/Google Sheets"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className={styles.tableContainer}>
        <style>{`
          .action-btn-invoice {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: transparent;
            border: 1px solid var(--mid-gray, #d8d5d0);
            color: var(--black, #1a1916);
            padding: 0.45rem 1rem;
            font-family: var(--font-sans, sans-serif);
            font-size: 0.6rem;
            font-weight: 500;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 4px;
            white-space: nowrap;
          }

          .action-btn-invoice:hover {
            background: var(--black, #1a1916);
            color: var(--white, #ffffff);
            border-color: var(--black, #1a1916);
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          }

          .action-btn-invoice svg {
            width: 11px;
            height: 11px;
            stroke-width: 2;
          }

          .action-btn-delete {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: transparent;
            border: 1px solid #ffcdd2;
            color: #c62828;
            padding: 0.45rem 1rem;
            font-family: var(--font-sans, sans-serif);
            font-size: 0.6rem;
            font-weight: 500;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 4px;
            white-space: nowrap;
          }

          .action-btn-delete:hover {
            background: #c62828;
            color: #ffffff;
            border-color: #c62828;
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(198, 40, 40, 0.15);
          }

          .action-btn-delete svg {
            width: 11px;
            height: 11px;
            stroke-width: 2;
          }

          .action-btn-export {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: #ffffff;
            border: 1px solid var(--mid-gray, #d8d5d0);
            color: var(--black, #1a1916);
            padding: 0.55rem 1.25rem;
            font-family: var(--font-sans, sans-serif);
            font-size: 0.65rem;
            font-weight: 500;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 6px;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          }

          .action-btn-export:hover {
            border-color: var(--black, #1a1916);
            background: var(--black, #1a1916);
            color: var(--white, #ffffff);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }

          .action-btn-export svg {
            width: 13px;
            height: 13px;
            stroke-width: 2;
          }
        `}</style>

        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Payment</th>
              <th>Imported Data</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  No orders found for this period.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className={styles.cellTitle}>{order.order_id}</div>
                    <div className={styles.cellMeta}>{formatDate(order.created_at)}</div>
                  </td>
                  <td>
                    <span className={styles.customerName}>{order.customer_name}</span>
                    <span className={styles.customerEmail}>{order.customer_email}</span>
                    <div className={styles.cellMeta}>{order.phone_number ?? 'No phone saved'}</div>
                  </td>
                  <td>
                    <span className={styles.productName}>{order.product_name}</span>
                    <span className={styles.productSize}>Size: {order.shoe_size}</span>
                    <div className={styles.cellMeta}>{order.delivery_address ?? 'No delivery address saved'}</div>
                  </td>
                  <td>
                    <div className={styles.paymentAmount}>{formatAmount(order.amount_minor, order.currency)}</div>
                    <span
                      className={`${styles.badge} ${
                        order.payment_status === 'paid'
                          ? styles.badgePaid
                          : order.payment_status === 'failed'
                            ? styles.badgeFailed
                            : styles.badgePending
                      }`}
                    >
                      {order.payment_status}
                    </span>
                    <div className={styles.cellMeta}>Stripe session: {order.stripe_checkout_session_id ?? '—'}</div>
                    <div className={styles.cellMeta}>Transaction ID: {order.transaction_id ?? '—'}</div>
                    <div className={styles.cellMeta}>Paid at: {order.paid_at ? formatDate(order.paid_at) : '—'}</div>
                  </td>
                  <td>
                    <details className={styles.payloadDetails}>
                      <summary>View imported payload</summary>
                      <pre>{JSON.stringify(order.payload ?? {}, null, 2)}</pre>
                    </details>
                  </td>
                  <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => setSelectedOrderForInvoice(order)}
                        className="action-btn-invoice"
                        title="View & Generate Invoice PDF"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoice
                      </button>
                      <button
                        onClick={() => setOrderToDelete(order)}
                        className="action-btn-delete"
                        title="Delete Order"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedOrderForInvoice ? (
        <InvoiceModal
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      ) : null}

      {/* Premium Custom Delete Confirmation Modal */}
      {orderToDelete ? (
        <div className="delete-modal-overlay" onClick={() => setOrderToDelete(null)}>
          <style>{`
            .delete-modal-overlay {
              position: fixed;
              inset: 0;
              z-index: 6000;
              background: rgba(20, 18, 14, 0.72);
              backdrop-filter: blur(10px);
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            .delete-modal-card {
              background: #ffffff;
              border-radius: 24px;
              border: 1px solid #ffcdcd;
              box-shadow: 0 35px 80px rgba(198, 40, 40, 0.08), 0 15px 45px rgba(0, 0, 0, 0.04);
              width: 100%;
              max-width: 480px;
              padding: 2.5rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
              animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            .delete-icon-container {
              width: 58px;
              height: 58px;
              border-radius: 50%;
              background: #ffebee;
              color: #c62828;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 1.5rem;
            }

            .delete-icon-container svg {
              width: 26px;
              height: 26px;
            }

            .delete-modal-title {
              font-family: 'Cormorant Garamond', Georgia, serif;
              font-size: 1.8rem;
              font-weight: 500;
              color: #1a1916;
              margin: 0 0 0.8rem 0;
              letter-spacing: 0.02em;
            }

            .delete-modal-desc {
              font-family: 'Jost', sans-serif;
              font-size: 0.82rem;
              color: #7a7570;
              line-height: 1.6;
              margin: 0 0 2.2rem 0;
            }

            .delete-modal-desc strong {
              color: #1a1916;
              font-weight: 500;
            }

            .delete-modal-buttons {
              display: flex;
              gap: 1rem;
              width: 100%;
            }

            .btn-delete-cancel {
              flex: 1;
              padding: 0.9rem 1.5rem;
              border-radius: 10px;
              border: 1px solid #d8d5d0;
              background: #ffffff;
              color: #2a2925;
              font-size: 0.68rem;
              font-weight: 500;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .btn-delete-cancel:hover {
              border-color: #1a1916;
              color: #1a1916;
            }

            .btn-delete-confirm {
              flex: 1;
              padding: 0.9rem 1.5rem;
              border-radius: 10px;
              border: none;
              background: #c62828;
              color: #ffffff;
              font-size: 0.68rem;
              font-weight: 500;
              letter-spacing: 0.12em;
              text-transform: uppercase;
              cursor: pointer;
              transition: all 0.3s ease;
            }

            .btn-delete-confirm:hover {
              background: #b71c1c;
              box-shadow: 0 8px 20px rgba(198, 40, 40, 0.2);
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
          `}</style>
          <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-icon-container">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="delete-modal-title">Delete Order</h3>
            <p className="delete-modal-desc">
              Are you sure you want to permanently delete order <strong>{orderToDelete.order_id}</strong>? <br />
              This action will remove the record from Supabase and cannot be undone.
            </p>
            <div className="delete-modal-buttons">
              <button className="btn-delete-cancel" onClick={() => setOrderToDelete(null)}>
                Cancel
              </button>
              <button className="btn-delete-confirm" onClick={handleDelete}>
                Delete Order
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
