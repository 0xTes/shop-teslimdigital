import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import AdminDashboard from './pages/AdminDashboard';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ForgotPassword from './pages/ForgotPassword';
import GuestOrderLookup from './pages/GuestOrderLookup';
import Home from './pages/Home';
import Login from './pages/Login';
import Maintenance from './pages/Maintenance';
import NotFound from './pages/NotFound';
import OrderSuccess from './pages/OrderSuccess';
import ProductPage from './pages/ProductPage';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Shop from './pages/Shop';

export default function Storefront() {
  return (
    <Routes>
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="order-lookup" element={<GuestOrderLookup />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
