import { NextResponse } from 'next/server';
import { createPendingOrderAndPayment } from '@/lib/order-service';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const requiredFields = ['fullName', 'email', 'deliveryAddress', 'phoneNumber', 'shoeSize', 'productName', 'productHandle', 'productAmount', 'currency'];

    for (const field of requiredFields) {
      if (!body?.[field]) {
        return NextResponse.json({ message: `Missing field: ${field}` }, { status: 400 });
      }
    }

    const result = await createPendingOrderAndPayment({
      fullName: String(body.fullName),
      email: String(body.email),
      deliveryAddress: String(body.deliveryAddress),
      phoneNumber: String(body.phoneNumber),
      shoeSize: String(body.shoeSize),
      productName: String(body.productName),
      productHandle: String(body.productHandle),
      productAmount: Number(body.productAmount),
      currency: String(body.currency),
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create order';
    return NextResponse.json({ message }, { status: 500 });
  }
}
