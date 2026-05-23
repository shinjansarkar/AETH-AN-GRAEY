import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { confirmStripePaymentAndNotify } from '@/lib/order-service';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeSecret || !webhookSecret) {
      return NextResponse.json({ message: 'Stripe webhook is not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecret);

    const payload = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ message: 'Missing Stripe signature header' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      await confirmStripePaymentAndNotify(event.data.object as Stripe.Checkout.Session);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to process Stripe webhook';
    return NextResponse.json({ message }, { status: 400 });
  }
}