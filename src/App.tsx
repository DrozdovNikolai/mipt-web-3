import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { getProductById } from "./data/catalog";
import { Layout } from "./components/Layout";
import { loadCart, saveCart } from "./cart";
import type { CartItem, Product } from "./types";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ProductPage } from "./pages/ProductPage";
import { SuccessPage } from "./pages/SuccessPage";

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(product.stockQty, item.quantity + quantity) }
            : item,
        );
      }
      return [...current, { productId: product.id, quantity: Math.min(product.stockQty, quantity) }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const product = getProductById(productId);
    if (!product) return;
    setCartItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(product.stockQty, quantity) } : item,
      ),
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((current) => current.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setCartItems([]);

  return (
    <Layout cartCount={cartCount}>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<CatalogPage onAddToCart={addToCart} />} />
        <Route path="/product/:slug" element={<ProductPage onAddToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <CartPage items={cartItems} onQuantityChange={updateQuantity} onRemove={removeFromCart} />
          }
        />
        <Route path="/checkout" element={<CheckoutPage items={cartItems} onClearCart={clearCart} />} />
        <Route path="/checkout/success/:orderNumber" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </Layout>
  );
}

