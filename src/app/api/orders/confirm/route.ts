import { NextResponse } from 'next/server';
import { confirmPaymentAndNotify } from '@/lib/order-service';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const requiredFields = ['orderId', 'razorpayOrderId', 'razorpayPaymentId', 'razorpaySignature'];

    for (const field of requiredFields) {
      if (!body?.[field]) {
        return NextResponse.json({ message: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const result = await confirmPaymentAndNotify({
      orderId: String(body.orderId),
      razorpayOrderId: String(body.razorpayOrderId),
      razorpayPaymentId: String(body.razorpayPaymentId),
      razorpaySignature: String(body.razorpaySignature),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to confirm payment';
    return NextResponse.json({ message }, { status: 500 });
  }
}
