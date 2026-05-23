# Order Flow Setup

Create the `public.orders` table with `supabase/order_schema.sql`, then set these environment variables:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ORDERS_TABLE=orders
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ADMIN_EMAIL=
```

The flow is:
1. Customer fills the order modal.
2. `/api/orders/create` saves the pending order in Supabase and creates a Stripe Checkout session.
3. The browser redirects to Stripe Checkout.
4. Stripe sends the `checkout.session.completed` webhook to the app.
5. The webhook verifies the Stripe signature, updates Supabase, and sends emails.
