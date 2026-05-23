import Link from 'next/link';

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string | string[]; session_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const orderId = getSingleParam(params.order_id);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(180deg, #f6f3ee 0%, #ede6dc 100%)',
        color: '#1a1916',
        padding: '2rem',
      }}
    >
      <section
        style={{
          maxWidth: 680,
          width: '100%',
          background: '#fff',
          border: '1px solid #e6ddd1',
          borderRadius: 24,
          padding: '2.5rem',
          boxShadow: '0 18px 50px rgba(20, 18, 14, 0.08)',
        }}
      >
        <p style={{ margin: 0, letterSpacing: '0.22em', textTransform: 'uppercase', fontSize: 12, color: '#857869' }}>Payment complete</p>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', margin: '0.75rem 0 1rem', lineHeight: 1.05 }}>Your Stripe payment was successful.</h1>
        <p style={{ margin: '0 0 1.5rem', fontSize: '1.05rem', lineHeight: 1.7, color: '#4a443b' }}>
          {orderId ? `Order ${orderId} has been confirmed. ` : 'Your order has been confirmed. '}We have stored the payment in Supabase and sent the confirmation emails.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 48,
            padding: '0 1.25rem',
            borderRadius: 999,
            background: '#1a1916',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Return Home
        </Link>
      </section>
    </main>
  );
}