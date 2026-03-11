import { shopifyFetch } from './client';
import { GET_ALL_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY, GET_CART_QUERY } from './queries';
import { CREATE_CART_MUTATION, ADD_CART_LINES_MUTATION, UPDATE_CART_LINES_MUTATION, REMOVE_CART_LINES_MUTATION } from './mutations';
import type { ShopifyCart, ShopifyProduct, ShopifyCartLineAttributes } from './types';

export * from './types';

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAllProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>({ query: GET_ALL_PRODUCTS_QUERY, variables: { first }, cache: 'force-cache' });
  return data.products.edges.map((e) => e.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    cache: 'force-cache',
  });
  return data.productByHandle;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export async function createCart(
  lines: { merchandiseId: string; quantity: number; attributes?: ShopifyCartLineAttributes[] }[] = []
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({ query: CREATE_CART_MUTATION, variables: { input: { lines } } });

  if (data.cartCreate.userErrors.length) throw new Error(data.cartCreate.userErrors[0].message);
  return data.cartCreate.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query: GET_CART_QUERY,
    variables: { cartId },
  });
  return data.cart;
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number; attributes?: ShopifyCartLineAttributes[] }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({ query: ADD_CART_LINES_MUTATION, variables: { cartId, lines } });

  if (data.cartLinesAdd.userErrors.length) throw new Error(data.cartLinesAdd.userErrors[0].message);
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({ query: UPDATE_CART_LINES_MUTATION, variables: { cartId, lines } });

  if (data.cartLinesUpdate.userErrors.length) throw new Error(data.cartLinesUpdate.userErrors[0].message);
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: { field: string; message: string }[] };
  }>({ query: REMOVE_CART_LINES_MUTATION, variables: { cartId, lineIds } });

  if (data.cartLinesRemove.userErrors.length) throw new Error(data.cartLinesRemove.userErrors[0].message);
  return data.cartLinesRemove.cart;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}
