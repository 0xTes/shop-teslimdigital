import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderSuccess from './pages/OrderSuccess';

export default function App() {
  return (
    <Routes>
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
      </Route>
    </Routes>
  );
}