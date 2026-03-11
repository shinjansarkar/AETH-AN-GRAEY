# Shopify Backend Setup — AETH AN GRAEY

Complete step-by-step guide to connecting the Next.js storefront to a Shopify backend.

---

## 1. Create Your Shopify Store

1. Go to [shopify.com](https://www.shopify.com) → **Start free trial**
2. Store name: `aeth-an-graey` (or your preferred name)
3. Store URL will be: `aeth-an-graey.myshopify.com`
4. Country: **Ireland** (for EU VAT compliance)
5. Currency: **EUR (€)**

---

## 2. Configure Store Settings

### General
- **Store name:** AETH AN GRAEY
- **Store email:** contact@aethangraey.com
- **Default currency:** EUR
- **Weight unit:** Grams
- **Timezone:** Dublin (GMT+0)

### Shipping & Delivery
- Create a shipping zone: **European Union**
  - Include all 27 EU countries
  - Shipping rate: **Free** (DDP — your prices already include shipping)
  - Rate name: *"Free DDP Shipping"*
- Under **Duties and import taxes**, enable **Delivered Duty Paid (DDP)**

### Taxes
- Enable EU VAT collection
- Configure your VAT ID (Irish VAT number)
- Enable tax-inclusive pricing if prices shown (€299, etc.) already include VAT

### Checkout
- **Customer accounts:** Optional
- **Require first and last name**
- Add a custom field: **"Foot notes / special requests"**
- **Thank you page message:** "Your bespoke pair is now in the hands of our artisan. Please allow 7–14 business days for crafting. You will receive a tracking number when your shoes leave the atelier."

---

## 3. Create the Four Products

Create each product manually in **Products → Add product** in the Shopify admin.

### Product 1: Signature Oxford
- **Title:** Signature Oxford
- **Handle:** `signature-oxford` ← MUST match exactly
- **Description:** Cap-Toe · Welt Stitched · Single Sole. Full-grain goat leather, hand-lasted by a single artisan. Best for executives, lawyers, and boardrooms.
- **Price:** 299.00 EUR
- **Requires shipping:** ✅
- **Weight:** 800g
- **Variant option — Size (EU):**
  38 / 39 / 40 / 41 / 42 / 43 / 44 / 45 / 46
- **Images:** Upload your `/public/oxford-stand.png` and other angles
- **Tags:** oxford, signature, formal

### Product 2: Signature Monk Strap
- **Title:** Signature Monk Strap
- **Handle:** `signature-monk-strap` ← MUST match exactly
- **Description:** Double Buckle · Hand-lasted · Storm Welt. Burnished goat leather for style-conscious professionals.
- **Price:** 319.00 EUR
- **Variant option — Size (EU):** 38–46
- **Tags:** monk-strap, signature, statement

### Product 3: Signature Chelsea Boot
- **Title:** Signature Chelsea Boot
- **Handle:** `signature-chelsea-boot` ← MUST match exactly
- **Description:** Elastic Gusset · Single Sole · Pull Tab. Smooth goat leather. Paris–Berlin aesthetic for smart casual.
- **Price:** 329.00 EUR
- **Variant option — Size (EU):** 38–46
- **Tags:** chelsea-boot, signature, new

### Product 4: Signature Balmoral Boot
- **Title:** Signature Balmoral Boot
- **Handle:** `signature-balmoral-boot` ← MUST match exactly
- **Description:** Lace-up · Ankle Height · Classic Profile. Full-grain goat leather for sharp dressers and winter elegance.
- **Price:** 349.00 EUR
- **Variant option — Size (EU):** 38–46
- **Tags:** balmoral-boot, signature, classic

> ⚠️ **The handles above are critical.** They must match exactly, including hyphens and lowercase.

---

## 4. Enable the Storefront API

1. In Shopify Admin → **Settings → Apps and sales channels**
2. Click **Develop apps** → **Create an app**
3. Name: `AETH Storefront API`
4. Under **API credentials** → **Configure Storefront API scopes**, enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
   - `unauthenticated_write_customers`
   - `unauthenticated_read_customer_tags`
5. Click **Save** → **Install app**
6. Copy the **Storefront API access token** shown

---

## 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your credentials:
   ```
   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=aeth-an-graey.myshopify.com
   NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_token_here
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

---

## 6. Test the Integration

After setting up, verify each flow:

### Product Fetch
- Click **"Order Bespoke →"** on any product card
- The size selector modal should open and display EU sizes 38–46

### Add to Cart
- Select a size → Click **"Add to Cart →"**
- Cart drawer should slide in from the right with the item

### Checkout
- Click **"Proceed to Checkout →"** in the cart
- Should redirect to your Shopify checkout page with the items pre-populated

### Cart Persistence
- Add items, close browser, reopen — items should still be in cart

---

## 7. Custom Bespoke Orders (Optional — Admin API)

For the Custom Lab, where customers specify Toe Shape, Leather Tone, etc., the customizations are stored as **line item attributes** in the Shopify order. You can view them in:

**Shopify Admin → Orders → [Order] → Line Items → Notes**

Each customization appears as:
```
Toe Shape: Chisel
Leather Tone: Cognac
Sole Thickness: Storm Welt
Patina Finish: Hand-burnished
```

---

## 8. Payment Providers

Recommended for EU:
- **Shopify Payments** (supports EUR, available in IE)
- **PayPal** — add as alternative
- **Klarna** — Buy Now, Pay Later (popular in EU)
- **Stripe** — if Shopify Payments isn't available in your region

---

## 9. Email Notifications

Customize transactional emails in **Settings → Notifications**:

| Email | Customisation needed |
|-------|---------------------|
| Order confirmation | Add bespoke crafting timeline (7–14 days) |
| Shipping confirmation | Add DHL/DPD tracking info |
| Order cancelled | Add rebooking info |

---

## 10. Custom Domain (Optional)

In **Settings → Domains** → **Connect existing domain**:
- Point `aethangraey.com` to Shopify checkout
- Or keep Next.js on the main domain and proxy checkout via `shop.aethangraey.com`

---

## Architecture Summary

```
Next.js Frontend (aethangraey.com)
│
├── src/lib/shopify/          ← Storefront API client
│   ├── client.ts             ← fetch wrapper
│   ├── queries.ts            ← GraphQL queries
│   ├── mutations.ts          ← GraphQL mutations
│   ├── types.ts              ← TypeScript types
│   └── index.ts              ← exported API functions
│
├── src/context/CartContext.tsx  ← React cart state
├── src/components/
│   ├── CartDrawer.tsx           ← Slide-out cart UI
│   └── AddToCartButton.tsx      ← Size selector + add to cart
│
└── .env.local                   ← Shopify credentials
         │
         ▼
Shopify Storefront API (GraphQL)
         │
         ▼
Shopify Checkout (/checkouts/...)
         │
         ▼
Shopify Admin (Orders, Fulfillment, Payments)
```
