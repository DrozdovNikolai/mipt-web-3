export type Product = {
  id: string;
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

export type OrderSnapshot = {
  orderNumber: string;
  createdAt: string;
  form: CheckoutForm;
  items: Array<{
    product: Product;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  delivery: number;
  total: number;
  status: "new";
};

