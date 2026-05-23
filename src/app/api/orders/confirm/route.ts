import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  return NextResponse.json({ message: 'Legacy endpoint disabled. Stripe webhook handles payment confirmation now.' }, { status: 410 });
}