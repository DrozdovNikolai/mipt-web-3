export type Product = {
  id: string;
  categoryId: string;
  sku: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  oldPrice?: number;
  stockQty: number;
  powerWatts: number;
  socketType: string;
  colorTemperature: string;
  luminousFlux: number;
  voltage: string;
  lifetimeHours: number;
  isDimmable: boolean;
  description: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type CheckoutForm = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryMethod: "courier" | "pickup";
  paymentMethod: "card_online" | "cash_on_delivery";
  customerComment: string;
  personalDataAccepted: boolean;
};

export type OrderItemSnapshot = {
  id: string;
  productId: string;
  skuSnapshot: string;
  productNameSnapshot: string;
  productSlugSnapshot: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  attributesSnapshot?: Record<string, unknown> | null;
};

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryMethod: "courier" | "pickup";
  paymentMethod: "card_online" | "cash_on_delivery";
  orderStatus: "new" | "confirmed" | "assembling" | "shipped" | "delivered" | "canceled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  customerComment?: string | null;
  subtotalAmount: number;
  deliveryAmount: number;
  totalAmount: number;
  currencyCode: string;
  publicToken?: string;
  items: OrderItemSnapshot[];
};

export type ProductsQuery = {
  category?: string;
  socket?: string;
  colorTemperature?: string;
  inStock?: boolean;
  search?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc";
  page?: number;
  pageSize?: number;
};

