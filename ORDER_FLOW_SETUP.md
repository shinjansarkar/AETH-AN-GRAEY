# Order Flow Setup

Create the `public.orders` table with `supabase/order_schema.sql`, then set these environment variables:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ORDERS_TABLE=orders
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
ADMIN_EMAIL=
```

The flow is:
1. Customer fills the order modal.
2. `/api/orders/create` saves the order in Supabase and creates a Razorpay order.
3. Razorpay checkout opens in the browser.
4. `/api/orders/confirm` verifies the payment signature, updates Supabase, and sends emails.
