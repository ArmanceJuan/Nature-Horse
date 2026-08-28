import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { OtpSetupPage } from "../features/auth/pages/OtpSetupPage";
import { Layout } from "../shared/components/layout/Layout";
import { HomePage } from "../features/catalog/pages/HomePage";
import { CatalogPage } from "../features/catalog/pages/CatalogPage";
import { ProductDetailPage } from "../features/catalog/pages/ProductDetailPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />{" "}
          <Route path="/shop" element={<CatalogPage />} />{" "}
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<div>Panier (à construire)</div>} />
          <Route path="/stores" element={<div>Boutiques (à construire)</div>} />
          <Route path="/admin" element={<div>Admin (à construire)</div>} />
          <Route path="/otp-setup" element={<OtpSetupPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
