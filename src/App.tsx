import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import { Layout } from "./components/Layout";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ProductPage } from "./pages/ProductPage";
import { SuccessPage } from "./pages/SuccessPage";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { loadCategories } from "./store/productsSlice";

export default function App() {
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  return (
    <Layout cartCount={cartCount}>
      <Routes>
        <Route path="/" element={<Navigate to="/catalog" replace />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/success/:orderNumber" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </Layout>
  );
}
