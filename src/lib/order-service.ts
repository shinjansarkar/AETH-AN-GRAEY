import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import Razorpay from 'razorpay';

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

export type ConfirmPaymentInput = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

type StoredOrder = OrderRequestInput & {
  orderId: string;
  amountMinor: number;
  status: 'pending' | 'paid' | 'failed';
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
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

function getSupabaseAdmin() {
  return createClient(requireEnv('SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false },
  });
}

function getRazorpayClient() {
  return new Razorpay({
    key_id: requireEnv('RAZORPAY_KEY_ID'),
    key_secret: requireEnv('RAZORPAY_KEY_SECRET'),
  });
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

export async function createPendingOrderAndPayment(input: OrderRequestInput) {
  const amountMinor = toMinorUnits(input.productAmount);
  const orderId = generateOrderId();
  const supabase = getSupabaseAdmin();
  const razorpay = getRazorpayClient();

  const storedOrder: StoredOrder = {
    ...input,
    orderId,
    amountMinor,
    status: 'pending',
    razorpayOrderId: null,
    razorpayPaymentId: null,
    razorpaySignature: null,
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
    status: storedOrder.status,
    payment_status: 'pending',
    razorpay_order_id: null,
    razorpay_payment_id: null,
    razorpay_signature: null,
    paid_at: null,
    payload: storedOrder,
  });

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: amountMinor,
    currency: input.currency,
    receipt: orderId,
    notes: {
      order_id: orderId,
      customer_name: input.fullName,
      customer_email: input.email,
      product_name: input.productName,
      shoe_size: input.shoeSize,
    },
  });

  const updateResult = await supabase
    .from(ORDERS_TABLE)
    .update({ razorpay_order_id: razorpayOrder.id })
    .eq('order_id', orderId);

  if (updateResult.error) {
    throw new Error(updateResult.error.message);
  }

  return {
    orderId,
    razorpayOrderId: razorpayOrder.id,
    amount: amountMinor,
    currency: input.currency,
    keyId: requireEnv('RAZORPAY_KEY_ID'),
  };
}

export async function confirmPaymentAndNotify(input: ConfirmPaymentInput) {
  const supabase = getSupabaseAdmin();
  const razorpaySecret = requireEnv('RAZORPAY_KEY_SECRET');

  const expectedSignature = crypto
    .createHmac('sha256', razorpaySecret)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== input.razorpaySignature) {
    throw new Error('Invalid payment signature');
  }

  const { data: orderRow, error: fetchError } = await supabase
    .from(ORDERS_TABLE)
    .select('*')
    .eq('order_id', input.orderId)
    .single();

  if (fetchError || !orderRow) {
    throw new Error(fetchError?.message ?? 'Order not found');
  }

  const paidAt = new Date().toISOString();
  const updateResult = await supabase
    .from(ORDERS_TABLE)
    .update({
      status: 'paid',
      payment_status: 'paid',
      razorpay_payment_id: input.razorpayPaymentId,
      razorpay_signature: input.razorpaySignature,
      paid_at: paidAt,
    })
    .eq('order_id', input.orderId);

  if (updateResult.error) {
    throw new Error(updateResult.error.message);
  }

  const storedOrder: StoredOrder = {
    orderId: orderRow.order_id,
    fullName: orderRow.customer_name,
    email: orderRow.customer_email,
    deliveryAddress: orderRow.delivery_address,
    phoneNumber: orderRow.phone_number,
    shoeSize: orderRow.shoe_size,
    productName: orderRow.product_name,
    productHandle: orderRow.product_handle,
    productAmount: Number(orderRow.amount_minor) / 100,
    currency: orderRow.currency,
    amountMinor: Number(orderRow.amount_minor),
    status: 'paid',
    razorpayOrderId: orderRow.razorpay_order_id ?? input.razorpayOrderId,
    razorpayPaymentId: input.razorpayPaymentId,
    razorpaySignature: input.razorpaySignature,
    paidAt,
  };

  const emailResults = await sendOrderEmails(storedOrder);

  return {
    orderId: storedOrder.orderId,
    paidAt,
    emailResults: emailResults.map((result) => (result.status === 'fulfilled' ? 'sent' : result.reason?.message ?? 'failed')),
  };
}
