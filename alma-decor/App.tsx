import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import { CartProvider } from './contexts/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminImport from './pages/admin/AdminImport';
import AdminOrders from './pages/admin/AdminOrders';
import AdminBlog from './pages/admin/AdminBlog';
import AdminSEO from './pages/admin/AdminSEO';
import AdminPixels from './pages/admin/AdminPixels';
import AdminEmailTemplates from './pages/admin/AdminEmailTemplates';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminScraper from './pages/admin/AdminScraper';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/Dashboard';
import About from './pages/About';
import { NotificationProvider } from './contexts/NotificationContext';
import ScrollToTop from './components/layout/ScrollToTop';

const App: React.FC = () => {
  const [activeLegalPage, setActiveLegalPage] = useState<string | null>(null);
  const pathname = window.location.pathname;
  const basename = pathname.includes('/Alma%20Decor%20Website') ? '/Alma%20Decor%20Website' : 
                   pathname.includes('/Alma Decor Website') ? '/Alma Decor Website' : '';

  return (
    <ThemeProvider>
      <NotificationProvider>
        <CartProvider>
          <Router basename={basename}>
            <ScrollToTop />
            <Routes>
              <Route element={<Layout activeLegalPage={activeLegalPage} setActiveLegalPage={setActiveLegalPage} />}>
                <Route path="/" element={<Home onLegalLinkClick={setActiveLegalPage} />} />
                <Route path="/magazin" element={<Shop />} />
                <Route path="/magazin/:categorySlug" element={<Shop />} />
                <Route path="/produs/:slug" element={<ProductDetails />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/despre-noi" element={<About />} />
                <Route path="/cos" element={<Cart />} />
                <Route path="/comanda" element={<Checkout />} />
                <Route path="/comanda/confirmare/:orderId" element={<OrderConfirmation />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/categorii" element={<AdminCategories />} />
              <Route path="/admin/produse" element={<AdminProducts />} />
              <Route path="/admin/import" element={<AdminImport />} />
              <Route path="/admin/comenzi" element={<AdminOrders />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/seo" element={<AdminSEO />} />
              <Route path="/admin/pixeli" element={<AdminPixels />} />
              <Route path="/admin/emailuri" element={<AdminEmailTemplates />} />
              <Route path="/admin/setari" element={<AdminSettings />} />
              <Route path="/admin/recenzii" element={<AdminReviews />} />
              <Route path="/admin/scraper" element={<AdminScraper />} />
              
              {/* User Routes */}
              <Route path="/cont/login" element={<Login />} />
              <Route path="/cont/register" element={<Register />} />
              <Route path="/cont/dashboard" element={<UserDashboard />} />

              {/* Redirects */}
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
