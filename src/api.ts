import type { CartItem, Category, CheckoutForm, Order, Product, ProductsQuery } from "./types";

const PRODUCTS_API_URL = import.meta.env.VITE_PRODUCTS_API_URL ?? "http://127.0.0.1:8001";
const ORDERS_API_URL = import.meta.env.VITE_ORDERS_API_URL ?? "http://127.0.0.1:8002";

type ApiProduct = {
  id: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  };
  sku: string;
  slug: string;
  name: string;
  description?: string | null;
  basePrice: number;
  discountPrice?: number | null;
  currentPrice: number;
  stockQty: number;
  powerWatts: number;
  socketType: string;
  colorTemperature: string;
  luminousFlux: number;
  voltage?: string | null;
  lifetimeHours?: number | null;
  isDimmable: boolean;
};

type ProductsResponse = {
  items: ApiProduct[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

function toApiUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, baseUrl);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Network request failed");
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const payload = await response.json();
      detail = typeof payload.detail === "string" ? payload.detail : detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function mapProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    categoryId: product.categoryId,
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    category: product.category.name,
    categorySlug: product.category.slug,
    price: product.currentPrice,
    oldPrice: product.discountPrice ? product.basePrice : undefined,
    stockQty: product.stockQty,
    powerWatts: product.powerWatts,
    socketType: product.socketType,
    colorTemperature: product.colorTemperature,
    luminousFlux: product.luminousFlux,
    voltage: product.voltage ?? "220-240V",
    lifetimeHours: product.lifetimeHours ?? 30000,
    isDimmable: product.isDimmable,
    description: product.description ?? `${product.name} из линейки LampFactory.`,
  };
}

export async function fetchCategoriesApi(): Promise<Category[]> {
  return requestJson<Category[]>(toApiUrl(PRODUCTS_API_URL, "/api/v1/categories"));
}

export async function fetchProductsApi(query: ProductsQuery = {}) {
  const response = await requestJson<ProductsResponse>(
    toApiUrl(PRODUCTS_API_URL, "/api/v1/products", {
      category: query.category,
      socket: query.socket,
      colorTemperature: query.colorTemperature,
      inStock: query.inStock,
      search: query.search,
      sort: query.sort,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? 100,
    }),
  );

  return {
    ...response,
    items: response.items.map(mapProduct),
  };
}

export async function fetchProductBySlugApi(slug: string): Promise<Product> {
  const product = await requestJson<ApiProduct>(toApiUrl(PRODUCTS_API_URL, `/api/v1/products/slug/${slug}`));
  return mapProduct(product);
}

export async function createOrderApi(form: CheckoutForm, items: CartItem[]): Promise<Order> {
  return requestJson<Order>(toApiUrl(ORDERS_API_URL, "/api/v1/orders"), {
    method: "POST",
    body: JSON.stringify({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      customerEmail: form.customerEmail,
      deliveryCity: form.deliveryCity,
      deliveryAddress: form.deliveryAddress,
      deliveryMethod: form.deliveryMethod,
      paymentMethod: form.paymentMethod,
      customerComment: form.customerComment,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }),
  });
}

