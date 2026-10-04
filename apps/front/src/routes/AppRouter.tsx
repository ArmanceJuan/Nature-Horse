import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../shared/components/layout/Layout.js";
import { AuthProvider } from "../features/auth/context/AuthContext.js";
import { RequireAuth } from "../features/auth/components/RequireAuth.js";
import { LoginPage } from "../features/auth/pages/LoginPage.js";
import { RegisterPage } from "../features/auth/pages/RegisterPage.js";
import { AccountPage } from "../features/account/pages/AccountPage.js";
import { HomePage } from "../features/catalog/pages/HomePage.js";
import { CatalogPage } from "../features/catalog/pages/CatalogPage.js";
import { ProductDetailPage } from "../features/catalog/pages/ProductDetailPage.js";
import { CartPage } from "../features/cart/pages/CartPage.js";
import { CheckoutPage } from "../features/orders/pages/CheckoutPage.js";
import { OrderConfirmationPage } from "../features/orders/pages/OrderConfirmationPage.js";
import { OrderCancelledPage } from "../features/orders/pages/OrderCancelledPage.js";
import { StoresPage } from "../features/stores/pages/StoresPage.js";
import { AdminPage } from "../features/admin/pages/AdminPage.js";
import { ProductFormPage } from "../features/admin/pages/ProductFormPage.js";
import { OrderTrackingPage } from "../features/orders/pages/OrderTrackingPage.js";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<CatalogPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/order/confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="/order/cancelled" element={<OrderCancelledPage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route
              path="/otp-setup"
              element={<Navigate to="/account" replace />}
            />
            <Route
              path="/account"
              element={
                <RequireAuth>
                  <AccountPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth role="ADMIN">
                  <AdminPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <RequireAuth role="ADMIN">
                  <ProductFormPage />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="/track/:token" element={<OrderTrackingPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
