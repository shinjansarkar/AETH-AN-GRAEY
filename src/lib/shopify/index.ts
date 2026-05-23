// ─── Types (inlined) ─────────────────────────────────────────────────────────
export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ShopifyPrice = {
  amount: string;
  currencyCode: string;
};

export type ShopifySelectedOption = {
  name: string;
  value: string;
};

export type ShopifyProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyPrice;
  compareAtPrice: ShopifyPrice | null;
  selectedOptions: ShopifySelectedOption[];
};

export type ShopifyProductOption = {
  name: string;
  values: string[];
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopifyImage | null;
  images: { edges: { node: ShopifyImage }[] };
  priceRange: {
    minVariantPrice: ShopifyPrice;
    maxVariantPrice: ShopifyPrice;
  };
  variants: { edges: { node: ShopifyProductVariant }[] };
  options: ShopifyProductOption[];
};

export type ShopifyCartLineAttributes = {
  key: string;
  value: string;
};

export type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyPrice;
    product: {
      title: string;
      handle: string;
      featuredImage: ShopifyImage | null;
    };
    selectedOptions: ShopifySelectedOption[];
  };
  attributes: ShopifyCartLineAttributes[];
  cost: {
    totalAmount: ShopifyPrice;
  };
};

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { edges: { node: ShopifyCartLine }[] };
  cost: {
    subtotalAmount: ShopifyPrice;
    totalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice | null;
  };
};

export type AddToCartInput = {
  variantId: string;
  quantity: number;
  attributes?: ShopifyCartLineAttributes[];
};

export type CartContextType = {
  cart: ShopifyCart | null;
  cartOpen: boolean;
  loading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (input: AddToCartInput) => Promise<void>;
  updateCartLine: (lineId: string, quantity: number) => Promise<void>;
  removeCartLine: (lineId: string) => Promise<void>;
  cartCount: number;
};

// Lightweight local implementation to replace Shopify storefront usage.
// Stores a simple cart in localStorage and returns shapes compatible with the rest of the app.

const STORAGE_KEY = 'aag_local_cart_v1';

function nowIso() {
  return new Date().toISOString();
}

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 10000)}`;
}

function toPriceObject(amount: number, currency = 'EUR'): ShopifyPrice {
  return { amount: String(amount), currencyCode: currency };
}

function buildLine(merchandiseId: string, quantity: number, attributes?: ShopifyCartLineAttributes[]): ShopifyCartLine {
  const id = generateId('line');
  const priceNum = 0; // unknown in local mode; callers often render product info from props
  return {
    id,
    quantity,
    merchandise: {
      id: merchandiseId,
      title: merchandiseId,
      price: toPriceObject(priceNum),
      product: {
        title: merchandiseId,
        handle: merchandiseId,
        featuredImage: null,
      },
      selectedOptions: [],
    },
    attributes: attributes ?? [],
    cost: { totalAmount: toPriceObject(priceNum) },
  } as ShopifyCartLine;
}

function computeCost(lines: ShopifyCartLine[]) {
  let subtotal = 0;
  for (const l of lines) {
    const amt = Number(l.cost?.totalAmount?.amount ?? '0');
    subtotal += amt * l.quantity;
  }
  return {
    subtotalAmount: toPriceObject(subtotal),
    totalAmount: toPriceObject(subtotal),
    totalTaxAmount: null,
  };
}

function readStoredCart(): ShopifyCart | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ShopifyCart;
  } catch {
    return null;
  }
}

function writeStoredCart(cart: ShopifyCart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number; attributes?: ShopifyCartLineAttributes[] }[] = []
): Promise<ShopifyCart> {
  const cartLines = lines.map((l) => buildLine(l.merchandiseId, l.quantity, l.attributes));
  const cart: ShopifyCart = {
    id: generateId('cart'),
    checkoutUrl: '#',
    totalQuantity: cartLines.reduce((s, l) => s + l.quantity, 0),
    lines: { edges: cartLines.map((line) => ({ node: line })) },
    cost: computeCost(cartLines),
  } as ShopifyCart;

  try {
    writeStoredCart(cart);
  } catch {}

  return cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const cart = readStoredCart();
  if (!cart) return null;
  return cart.id === cartId ? cart : null;
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number; attributes?: ShopifyCartLineAttributes[] }[]
): Promise<ShopifyCart> {
  const stored = readStoredCart();
  if (!stored || stored.id !== cartId) {
    return createCart(lines);
  }

  const newLines = lines.map((l) => buildLine(l.merchandiseId, l.quantity, l.attributes));
  const all = [...stored.lines.edges.map((e) => e.node), ...newLines];
  const cart: ShopifyCart = {
    ...stored,
    totalQuantity: all.reduce((s, l) => s + l.quantity, 0),
    lines: { edges: all.map((node) => ({ node })) },
    cost: computeCost(all),
  } as ShopifyCart;

  try {
    writeStoredCart(cart);
  } catch {}

  return cart;
}

export async function updateCartLines(cartId: string, lines: { id: string; quantity: number }[]): Promise<ShopifyCart> {
  const stored = readStoredCart();
  if (!stored || stored.id !== cartId) throw new Error('Cart not found');

  const nodes = stored.lines.edges.map((e) => e.node);
  for (const upd of lines) {
    const node = nodes.find((n) => n.id === upd.id);
    if (node) node.quantity = upd.quantity;
  }

  const cart: ShopifyCart = {
    ...stored,
    totalQuantity: nodes.reduce((s, l) => s + l.quantity, 0),
    lines: { edges: nodes.map((node) => ({ node })) },
    cost: computeCost(nodes),
  } as ShopifyCart;

  writeStoredCart(cart);
  return cart;
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<ShopifyCart> {
  const stored = readStoredCart();
  if (!stored || stored.id !== cartId) throw new Error('Cart not found');

  const nodes = stored.lines.edges.map((e) => e.node).filter((n) => !lineIds.includes(n.id));
  const cart: ShopifyCart = {
    ...stored,
    totalQuantity: nodes.reduce((s, l) => s + l.quantity, 0),
    lines: { edges: nodes.map((node) => ({ node })) },
    cost: computeCost(nodes),
  } as ShopifyCart;

  writeStoredCart(cart);
  return cart;
}

export function formatPrice(amount: string | number, currencyCode = 'EUR'): string {
  const num = typeof amount === 'string' ? parseFloat(amount || '0') : Number(amount || 0);
  try {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    return `${currencyCode} ${num.toFixed(2)}`;
  }
}
