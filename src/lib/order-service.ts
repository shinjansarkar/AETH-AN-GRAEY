import crypto from 'node:crypto';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export type OrderRequestInput = {
  fullName: string;
  email: string;
  deliveryAddress: string;
  phoneNumber: string;
  shoeSize: string;
  productName: string;
  productHandle: string;
  productAmount: number;
  currency: string;
};

type StoredOrder = OrderRequestInput & {
  orderId: string;
  amountMinor: number;
  orderStatus: 'pending' | 'confirmed' | 'failed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
  paidAt: string | null;
};

const ORDERS_TABLE = process.env.SUPABASE_ORDERS_TABLE ?? 'orders';

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function hasSupabaseAdminConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseAdmin() {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  });
}

function getStripeClient() {
  return new Stripe(requireEnv('STRIPE_SECRET_KEY'));
}

function resolveSiteUrl(origin?: string) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? process.env.VERCEL_URL;

  if (configured) {
    return configured.startsWith('http') ? configured : `https://${configured}`;
  }

  if (origin) {
    return origin;
  }

  throw new Error('Missing site URL. Set NEXT_PUBLIC_SITE_URL or pass the request origin.');
}

function getMailTransport() {
  const port = Number(process.env.SMTP_PORT ?? 587);

  return nodemailer.createTransport({
    host: requireEnv('SMTP_HOST'),
    port,
    secure: port === 465,
    auth: {
      user: requireEnv('SMTP_USER'),
      pass: requireEnv('SMTP_PASS'),
    },
  });
}

function generateOrderId() {
  return `AG-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

function toMinorUnits(amount: number) {
  return Math.round(amount * 100);
}

function formatAmount(amountMinor: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountMinor / 100);
  } catch {
    return `${currency} ${(amountMinor / 100).toFixed(2)}`;
  }
}

function getOrderSelectColumns() {
  return 'id, order_id, customer_name, customer_email, phone_number, delivery_address, product_name, product_handle, shoe_size, amount_minor, currency, order_status, payment_status, stripe_checkout_session_id, stripe_payment_intent_id, created_at, paid_at, payload';
}

function emailShell(title: string, body: string) {
  return `
    <div style="margin:0;padding:0;background:#f6f3ee;font-family:Arial,sans-serif;color:#1a1916">
      <div style="max-width:640px;margin:0 auto;padding:32px 18px">
        <div style="background:#fff;border:1px solid #e8e2d9;border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(20,18,14,.08)">
          <div style="padding:28px 28px 18px;background:linear-gradient(135deg,#1a1916 0%,#2b271f 100%);color:#fff">
            <div style="font-size:11px;letter-spacing:.28em;text-transform:uppercase;opacity:.72;margin-bottom:12px">AETH AN GRAEY</div>
            <h1 style="margin:0;font-size:28px;line-height:1.15;font-family:Georgia,serif">${title}</h1>
          </div>
          <div style="padding:28px">${body}</div>
        </div>
      </div>
    </div>
  `;
}

function buildCustomerEmail(order: StoredOrder) {
  const amount = formatAmount(order.amountMinor, order.currency);

  return emailShell(
    'Payment Successful',
    `
      <p style="font-size:16px;line-height:1.7;margin:0 0 18px">Hello ${order.fullName}, your payment has been received successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
        <tr><td style="padding:10px 0;color:#6b6760">Order ID</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.orderId}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Product</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.productName}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Shoe Size</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.shoeSize}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Amount Paid</td><td style="padding:10px 0;text-align:right;font-weight:700">${amount}</td></tr>
      </table>
      <div style="padding:18px;background:#faf7f2;border:1px solid #ece2d5;border-radius:14px;margin-bottom:20px">
        <div style="font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#8b7d6a;margin-bottom:10px">Delivery Address</div>
        <div style="white-space:pre-line;line-height:1.7">${order.deliveryAddress}</div>
      </div>
      <p style="font-size:14px;line-height:1.7;margin:0">Order summary: your luxury footwear order is confirmed. We will prepare your pair and keep you updated about the next steps.</p>
    `,
  );
}

function buildAdminEmail(order: StoredOrder) {
  const amount = formatAmount(order.amountMinor, order.currency);

  return emailShell(
    'New Order Paid',
    `
      <p style="font-size:16px;line-height:1.7;margin:0 0 18px">A new order has been paid successfully.</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
        <tr><td style="padding:10px 0;color:#6b6760">Order ID</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.orderId}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Customer</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.fullName}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Email</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.email}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Phone</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.phoneNumber}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Product</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.productName}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Shoe Size</td><td style="padding:10px 0;text-align:right;font-weight:700">${order.shoeSize}</td></tr>
        <tr><td style="padding:10px 0;color:#6b6760">Amount Paid</td><td style="padding:10px 0;text-align:right;font-weight:700">${amount}</td></tr>
      </table>
      <div style="padding:18px;background:#faf7f2;border:1px solid #ece2d5;border-radius:14px">
        <div style="font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#8b7d6a;margin-bottom:10px">Delivery Address</div>
        <div style="white-space:pre-line;line-height:1.7">${order.deliveryAddress}</div>
      </div>
    `,
  );
}

async function sendOrderEmails(order: StoredOrder) {
  const transport = getMailTransport();
  const from = process.env.SMTP_FROM ?? requireEnv('SMTP_USER');
  const adminEmail = requireEnv('ADMIN_EMAIL');

  const customerEmailPromise = transport.sendMail({
    from,
    to: order.email,
    subject: `Your AETH AN GRAEY order ${order.orderId} is confirmed`,
    html: buildCustomerEmail(order),
  });

  const adminEmailPromise = transport.sendMail({
    from,
    to: adminEmail,
    subject: `New paid order ${order.orderId} - ${order.productName}`,
    html: buildAdminEmail(order),
  });

  return Promise.allSettled([customerEmailPromise, adminEmailPromise]);
}

export async function createPendingOrderAndPayment(input: OrderRequestInput, origin?: string) {
  const amountMinor = toMinorUnits(input.productAmount);
  const orderId = generateOrderId();
  const supabase = getSupabaseAdmin();
  const stripe = getStripeClient();
  const siteUrl = resolveSiteUrl(origin);

  const storedOrder: StoredOrder = {
    ...input,
    orderId,
    amountMinor,
    orderStatus: 'pending',
    paymentStatus: 'pending',
    stripeCheckoutSessionId: null,
    stripePaymentIntentId: null,
    paidAt: null,
  };

  const insertResult = await supabase.from(ORDERS_TABLE).insert({
    order_id: storedOrder.orderId,
    customer_name: storedOrder.fullName,
    customer_email: storedOrder.email,
    delivery_address: storedOrder.deliveryAddress,
    phone_number: storedOrder.phoneNumber,
    shoe_size: storedOrder.shoeSize,
    product_name: storedOrder.productName,
    product_handle: storedOrder.productHandle,
    amount_minor: storedOrder.amountMinor,
    currency: storedOrder.currency,
    order_status: storedOrder.orderStatus,
    payment_status: storedOrder.paymentStatus,
    stripe_checkout_session_id: null,
    stripe_payment_intent_id: null,
    paid_at: null,
    payload: storedOrder,
  });

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: input.email,
    client_reference_id: orderId,
    success_url: `${siteUrl}/success?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/?payment=cancelled`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency.toLowerCase(),
          unit_amount: amountMinor,
          product_data: {
            name: input.productName,
            description: `Shoe size ${input.shoeSize}`,
          },
        },
      },
    ],
    metadata: {
      orderId,
      fullName: input.fullName,
      email: input.email,
      phoneNumber: input.phoneNumber,
      deliveryAddress: input.deliveryAddress,
      shoeSize: input.shoeSize,
      productName: input.productName,
      productHandle: input.productHandle,
    },
  });

  const updateResult = await supabase
    .from(ORDERS_TABLE)
    .update({ stripe_checkout_session_id: checkoutSession.id })
    .eq('order_id', orderId);

  if (updateResult.error) {
    throw new Error(updateResult.error.message);
  }

  return {
    orderId,
    amount: amountMinor,
    currency: input.currency,
    checkoutSessionId: checkoutSession.id,
    checkoutUrl: checkoutSession.url,
  };
}

export async function confirmStripePaymentAndNotify(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin();
  const orderId = session.metadata?.orderId ?? session.client_reference_id;

  if (!orderId) {
    throw new Error('Missing order reference in Stripe session');
  }

  const { data: orderData, error: fetchError } = await supabase
    .from(ORDERS_TABLE)
    .select(getOrderSelectColumns())
    .eq('order_id', orderId)
    .single();
  const orderRow = orderData as AdminOrder | null;

  if (fetchError || !orderRow) {
    throw new Error(fetchError?.message ?? 'Order not found');
  }

  if (orderRow.payment_status === 'paid') {
    return {
      orderId: orderRow.order_id,
      paidAt: orderRow.paid_at,
      emailResults: ['already confirmed'],
    };
  }

  const paidAt = new Date().toISOString();
  const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null;

  const { data: updatedData, error: updateError } = await supabase
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
    .select(getOrderSelectColumns())
    .single();
  const updatedOrder = updatedData as AdminOrder | null;

  if (updateError || !updatedOrder) {
    throw new Error(updateError?.message ?? 'Unable to confirm payment');
  }

  const storedOrder: StoredOrder = {
    orderId: updatedOrder.order_id,
    fullName: updatedOrder.customer_name,
    email: updatedOrder.customer_email,
    deliveryAddress: updatedOrder.delivery_address ?? '',
    phoneNumber: updatedOrder.phone_number ?? '',
    shoeSize: updatedOrder.shoe_size,
    productName: updatedOrder.product_name,
    productHandle: updatedOrder.product_handle ?? '',
    productAmount: Number(updatedOrder.amount_minor) / 100,
    currency: updatedOrder.currency,
    amountMinor: Number(updatedOrder.amount_minor),
    orderStatus: 'confirmed',
    paymentStatus: 'paid',
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    paidAt,
  };

  const emailResults = await sendOrderEmails(storedOrder);

  return {
    orderId: storedOrder.orderId,
    paidAt,
    emailResults: emailResults.map((result) => (result.status === 'fulfilled' ? 'sent' : result.reason?.message ?? 'failed')),
  };
}

export type TimeFilter = 'all' | 'day' | 'week' | 'month';

export type AdminOrder = {
  id: string | number;
  order_id: string;
  customer_name: string;
  customer_email: string;
  phone_number: string | null;
  delivery_address: string | null;
  product_name: string;
  product_handle: string | null;
  shoe_size: string;
  amount_minor: number;
  currency: string;
  order_status: 'pending' | 'confirmed' | 'failed' | string;
  payment_status: 'pending' | 'paid' | 'failed' | string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: string;
  paid_at: string | null;
  payload: Record<string, unknown> | null;
};

export async function getAdminOrders(filter: TimeFilter = 'all') {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from(ORDERS_TABLE)
    .select(getOrderSelectColumns())
    .order('created_at', { ascending: false });

  if (filter !== 'all') {
    const now = new Date();
    const pastDate = new Date();

    if (filter === 'day') {
      pastDate.setDate(now.getDate() - 1);
    } else if (filter === 'week') {
      pastDate.setDate(now.getDate() - 7);
    } else if (filter === 'month') {
      pastDate.setMonth(now.getMonth() - 1);
    }

    query = query.gte('created_at', pastDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as AdminOrder[];
}