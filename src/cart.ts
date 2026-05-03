import type { CartItem, OrderSnapshot } from "./types";

export const CART_STORAGE_KEY = "lampfactory.cart";
export const LAST_ORDER_STORAGE_KEY = "lampfactory.lastOrder";
export const DELIVERY_PRICE = 300;

export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        typeof item?.productId === "string" &&
        Number.isInteger(item?.quantity) &&
        item.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function saveLastOrder(order: OrderSnapshot) {
  localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function loadLastOrder(): OrderSnapshot | null {
  try {
    const raw = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrderSnapshot) : null;
  } catch {
    return null;
  }
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function createOrderNumber() {
  const date = new Date();
  const datePart = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .split(".")
    .reverse()
    .join("");
  const suffix = String(Math.floor(Math.random() * 9000) + 1000);
  return `LF-${datePart}-${suffix}`;
}

