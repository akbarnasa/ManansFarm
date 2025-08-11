import React from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Verify from './pages/Verify';
import { UserData } from './context/UserContext';
import RedirectIfAuth from './components/RedirectIsAuth';
import Loading from './components/Loading';
import NotFound from './pages/NotFound';
import ProductPage from './pages/ProductPage';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Orders from './pages/Orders';
import OrderPage from './pages/OrderPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtect from "./components/protected/AdminProtect";
import UserProtect from './components/protected/UseProtect';
import AuthProtect from './components/protected/AuthProtect';
import AdminOrderDetail from './components/Admin/AdminOrderDetail';
import TentangKami from './pages/TentangKami';
import HubungiKami from './pages/HubungiKami';
import KebijakanPrivasi from './pages/KebijakanPrivasi';
import SyaratKetentuan from './pages/SyaratKetentuan';

const AppContent = () => {
  const { isAuth, loading } = UserData();
  const location = useLocation();

  const path = location.pathname.toLowerCase();
  const isAuthPage = path === "/login" || path === "/verify";

  const showLayout = isAuth || !isAuthPage;
  
  if (loading) return <Loading />;
  
  return (
    <>
      {showLayout && <Navbar />}

      <Routes>
  {/* Home hanya untuk USER */}
  <Route path="/" element={
    <UserProtect>
      <Home />
    </UserProtect>
  } />

  {/* Halaman login & verifikasi */}
  <Route path="/login" element={
    <RedirectIfAuth>
      <Login />
    </RedirectIfAuth>
  } />
  <Route path="/verify" element={
    <RedirectIfAuth>
      <Verify />
    </RedirectIfAuth>
  } />

  {/* Halaman produk hanya untuk USER */}
  <Route path="/products" element={
    <AuthProtect>
      <Products />
    </AuthProtect>
  } />
  <Route path="/product/:id" element={
    <AuthProtect>
      <ProductPage />
    </AuthProtect>
  } />

  {/* Cart, Checkout, Payment hanya untuk USER */}
  <Route path="/cart" element={
    <UserProtect>
      <Cart />
    </UserProtect>
  } />
  <Route path="/checkout" element={
    <UserProtect>
      <Checkout />
    </UserProtect>
  } />
  <Route path="/payment/:id" element={
    <UserProtect>
      <Payment />
    </UserProtect>
  } />
  <Route path="/success" element={
    <UserProtect>
      <Success />
    </UserProtect>
  } />
  <Route path="/order" element={
    <UserProtect>
      <Orders />
    </UserProtect>
  } />
  <Route path="/order/:id" element={
    <UserProtect>
      <OrderPage />
    </UserProtect>
  } />

  {/* ADMIN DASHBOARD hanya untuk admin */}
  <Route path="/admin/dashboard" element={
    <AdminProtect>
      <AdminDashboard />
    </AdminProtect>
  } />

  
    <Route path="/admin/order/:id" element={
      <AdminProtect>
        <AdminOrderDetail />
      </AdminProtect>
    } />

    {/* Halaman informasi umum (akses publik) */}
      <Route path="/tentang-kami" element={<TentangKami />} />
      <Route path="/hubungi-kami" element={<HubungiKami />} />
      <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
      <Route path="/syarat-dan-ketentuan" element={<SyaratKetentuan />} />


  {/* Not Found */}
  <Route path="*" element={<NotFound />} />
</Routes>


      {showLayout && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
