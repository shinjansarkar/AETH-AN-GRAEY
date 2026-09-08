/**
 * Supabase Edge Function — Stripe webhook handler
 * - Verifies Stripe webhook signature (HMAC SHA256)
 * - Updates the `orders` table using the Supabase service role key
 * - Sends transactional emails using SendGrid
 *
 * Environment variables (set via `supabase secrets set` or your platform):
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - SUPABASE_ORDERS_TABLE (optional, default: "orders")
 * - STRIPE_WEBHOOK_SECRET
 * - SENDGRID_API_KEY
 * - ADMIN_EMAIL
 * - SITE_URL (optional) used in emails
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const ORDERS_TABLE = Deno.env.get('SUPABASE_ORDERS_TABLE') ?? 'orders';
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY') ?? '';
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? '';
const SITE_URL = Deno.env.get('SITE_URL') ?? Deno.env.get('NEXT_PUBLIC_SITE_URL') ?? '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Missing Supabase configuration — function may fail at runtime');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

function hexEncode(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function computeHmacSha256(key: string, data: string) {
  const enc = new TextEncoder();
  const keyData = enc.encode(key);
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data));
  return hexEncode(sig);
}

function safeCompare(a: string, b: string) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) {
    res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return res === 0;
}

async function verifyStripeSignature(payload: string, header: string, secret: string, toleranceSeconds = 300) {
  // header looks like: t=timestamp,v1=signature[,v0=...]
  const parts = header.split(',').map(p => p.split('='));
  const map = Object.fromEntries(parts.map(([k, v]) => [k, v]));
  const t = map.t;
  const v1 = map.v1;
  if (!t || !v1) return false;
  const signed = `${t}.${payload}`;
  const expected = await computeHmacSha256(secret, signed);
  const valid = safeCompare(expected, v1);
  if (!valid) return false;
  const timestamp = Number(t);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > toleranceSeconds) return false;
  return true;
}

function buildCustomerHtml(order: any) {
  const amount = (Number(order.amount_minor) / 100).toFixed(2);
  return `
    <p>Hello ${order.customer_name}, your payment has been received.</p>
    <p>Order ID: <strong>${order.order_id}</strong></p>
    <p>Product: <strong>${order.product_name}</strong></p>
    <p>Amount: <strong>${amount} ${order.currency}</strong></p>
  `;
}

function buildAdminHtml(order: any) {
  const amount = (Number(order.amount_minor) / 100).toFixed(2);
  return `
    <p>New paid order received.</p>
    <p>Order ID: <strong>${order.order_id}</strong></p>
    <p>Customer: <strong>${order.customer_name}</strong> — ${order.customer_email}</p>
    <p>Product: <strong>${order.product_name}</strong></p>
    <p>Amount: <strong>${amount} ${order.currency}</strong></p>
    <pre>${order.delivery_address ?? ''}</pre>
  `;
}

async function sendEmailSendGrid(to: string, subject: string, html: string) {
  if (!SENDGRID_API_KEY) throw new Error('Missing SENDGRID_API_KEY');
  const body = {
    personalizations: [{ to: [{ email: to }] }],
    from: { email: ADMIN_EMAIL || 'no-reply@' + new URL(SITE_URL || 'http://localhost').hostname },
    subject,
    content: [{ type: 'text/html', value: html }],
  };

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`SendGrid error: ${res.status} ${txt}`);
  }
  return true;
}

export default async function handler(req: Request) {
  try {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature') ?? '';
    if (!STRIPE_WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ error: 'Stripe webhook secret not configured' }), { status: 500 });
    }
    const ok = await verifyStripeSignature(payload, sig, STRIPE_WEBHOOK_SECRET);
    if (!ok) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
    }

    const event = JSON.parse(payload);
    const type = event.type;

    if (type !== 'checkout.session.completed' && type !== 'payment_intent.succeeded') {
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const session = event.data?.object;
    const orderId = session?.metadata?.orderId ?? session?.client_reference_id;
    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Missing order id in session' }), { status: 400 });
    }

    const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null;
    const paidAt = new Date().toISOString();

    // Update order row
    const { data: updatedOrder, error: updateError } = await supabase
      .from(ORDERS_TABLE)
      .update({
        order_status: 'confirmed',
        payment_status: 'paid',
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntentId,
        paid_at: paidAt,
      })
      .eq('order_id', orderId)
      .eq('payment_status', 'pending')
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    // Send emails (customer + admin) via SendGrid
    try {
      const customerHtml = buildCustomerHtml(updatedOrder);
      const adminHtml = buildAdminHtml(updatedOrder);

      const promises = [];
      if (updatedOrder.customer_email) {
        promises.push(sendEmailSendGrid(updatedOrder.customer_email, `Your order ${updatedOrder.order_id} is confirmed`, customerHtml));
      }
      if (ADMIN_EMAIL) {
        promises.push(sendEmailSendGrid(ADMIN_EMAIL, `New paid order ${updatedOrder.order_id}`, adminHtml));
      }
      await Promise.allSettled(promises);
    } catch (emailErr) {
      console.warn('Email send failed', String(emailErr));
    }

    return new Response(JSON.stringify({ ok: true, orderId }), { status: 200 });
  } catch (err) {
    console.error('Webhook handler error', err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), { status: 500 });
  }
}
