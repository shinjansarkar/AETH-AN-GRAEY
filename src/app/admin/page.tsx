import { getAdminOrders, hasSupabaseAdminConfig, TimeFilter, type AdminOrder } from '@/lib/order-service';
import Link from 'next/link';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

function isWithinFilter(dateString: string, filter: TimeFilter) {
  if (filter === 'all') {
    return true;
  }

  const now = new Date();
  const threshold = new Date(now);

  if (filter === 'day') {
    threshold.setDate(now.getDate() - 1);
  }

  if (filter === 'week') {
    threshold.setDate(now.getDate() - 7);
  }

  if (filter === 'month') {
    threshold.setMonth(now.getMonth() - 1);
  }

  return new Date(dateString) >= threshold;
}

function formatAmount(amountMinor: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString));
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filter = (resolvedSearchParams.filter as TimeFilter) || 'all';
  const isSupabaseReady = hasSupabaseAdminConfig();
  const orders = isSupabaseReady ? await getAdminOrders(filter) : [];
  const allOrders = isSupabaseReady && filter !== 'all' ? await getAdminOrders('all') : orders;

  const firstOrdersByCustomer = new Map<string, AdminOrder>();

  for (const order of allOrders) {
    const currentFirstOrder = firstOrdersByCustomer.get(order.customer_email);

    if (!currentFirstOrder || new Date(order.created_at) < new Date(currentFirstOrder.created_at)) {
      firstOrdersByCustomer.set(order.customer_email, order);
    }
  }

  const totalOrders = orders.length;
  const paidOrders = orders.filter((order) => order.payment_status === 'paid').length;
  const pendingOrders = orders.filter((order) => order.payment_status === 'pending').length;
  const totalRevenue = orders.reduce((acc, order) => {
    if (order.payment_status === 'paid') {
      return acc + order.amount_minor / 100;
    }
    return acc;
  }, 0);
  const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

  const newCustomerOrders = Array.from(firstOrdersByCustomer.values())
    .filter((order) => isWithinFilter(order.created_at, filter))
    .sort((left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime());

  const newCustomers = newCustomerOrders.length;
  const recentNewCustomers = newCustomerOrders.slice(0, 5);

  return (
    <div className={styles.adminContainer}>
      <div className={styles.pageBackdrop} aria-hidden="true" />
      <header className={styles.adminHeader}>
        <div>
          <h1 className={styles.adminTitle}>Admin Dashboard</h1>
          <span className={styles.adminSubtitle}>Aeth An Graey — Supabase orders, customers, and Stripe payments</span>
        </div>
        <div className={styles.filterGroup}>
          <Link
            href="/admin?filter=all"
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          >
            All Time
          </Link>
          <Link
            href="/admin?filter=month"
            className={`${styles.filterBtn} ${filter === 'month' ? styles.active : ''}`}
          >
            This Month
          </Link>
          <Link
            href="/admin?filter=week"
            className={`${styles.filterBtn} ${filter === 'week' ? styles.active : ''}`}
          >
            This Week
          </Link>
          <Link
            href="/admin?filter=day"
            className={`${styles.filterBtn} ${filter === 'day' ? styles.active : ''}`}
          >
            Today
          </Link>
        </div>
      </header>

      {!isSupabaseReady ? (
        <section className={styles.setupNotice}>
          <h2 className={styles.sectionTitle}>Supabase environment missing</h2>
          <p className={styles.sectionSubtitle}>
            Add <span className={styles.inlineCode}>SUPABASE_URL</span> and{' '}
            <span className={styles.inlineCode}>SUPABASE_SERVICE_ROLE_KEY</span> to load live orders in the admin panel.
          </p>
        </section>
      ) : null}

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Orders in range</span>
          <div className={styles.statValue}>{totalOrders}</div>
          <p className={styles.statMeta}>All imported rows for the selected period.</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Revenue from paid orders</span>
          <div className={styles.statValue}>{formatAmount(totalRevenue * 100, 'EUR')}</div>
          <p className={styles.statMeta}>Confirmed payments only.</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>New customers</span>
          <div className={styles.statValue}>{newCustomers}</div>
          <p className={styles.statMeta}>First order created in the selected period.</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Average order value</span>
          <div className={styles.statValue}>{formatAmount(averageOrderValue * 100, 'EUR')}</div>
          <p className={styles.statMeta}>{paidOrders} paid orders / {pendingOrders} pending.</p>
        </div>
      </section>

      <section className={styles.twoColumnGrid}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>New customers</h2>
              <p className={styles.sectionSubtitle}>Customers whose first purchase happened inside the active date filter.</p>
            </div>
            <span className={styles.sectionPill}>{newCustomers} total</span>
          </div>

          <div className={styles.customerList}>
            {recentNewCustomers.length === 0 ? (
              <div className={styles.emptyState}>No new customers for this period.</div>
            ) : (
              recentNewCustomers.map((order) => (
                <article key={order.order_id} className={styles.customerRow}>
                  <div>
                    <div className={styles.customerName}>{order.customer_name}</div>
                    <div className={styles.customerEmail}>{order.customer_email}</div>
                  </div>
                  <div className={styles.customerMeta}>
                    <span>{order.product_name}</span>
                    <span>Size {order.shoe_size}</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Payment snapshot</h2>
              <p className={styles.sectionSubtitle}>Payment status and Stripe references for the selected rows.</p>
            </div>
            <span className={styles.sectionPill}>Supabase</span>
          </div>

          <div className={styles.paymentStack}>
            {orders.slice(0, 4).map((order) => (
              <article key={order.order_id} className={styles.paymentCard}>
                <div className={styles.paymentTopRow}>
                  <div>
                    <div className={styles.paymentLabel}>{order.order_id}</div>
                    <div className={styles.customerEmail}>{order.customer_name}</div>
                  </div>
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
                </div>
                <div className={styles.paymentMeta}>
                  <span>{formatAmount(order.amount_minor, order.currency)}</span>
                  <span>{order.stripe_payment_intent_id ? 'Stripe payment saved' : 'Awaiting payment reference'}</span>
                </div>
                <div className={styles.monoRow}>
                  <span>Checkout: {order.stripe_checkout_session_id ?? '—'}</span>
                  <span>Payment: {order.stripe_payment_intent_id ?? '—'}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.tableContainer}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Payment</th>
              <th>Imported Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
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
                    <div className={styles.cellMeta}>Paid at: {order.paid_at ? formatDate(order.paid_at) : '—'}</div>
                  </td>
                  <td>
                    <details className={styles.payloadDetails}>
                      <summary>View imported payload</summary>
                      <pre>{JSON.stringify(order.payload ?? {}, null, 2)}</pre>
                    </details>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
