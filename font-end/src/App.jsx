import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import ScrollToTop from "./ScrollToTop";

import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import Home from "./components/page/user/Home";
import AllProductsPage from "./components/page/user/AllProductsPage";
import ProductDetailPage from "./components/page/user/ProductDetailPage";
import Login from "./components/page/user/Login";
import Register from "./components/page/user/Register";
import Reset from "./components/page/user/Reset";
import OTP from "./components/page/user/OTP";
import ResetPassword from "./components/page/user/ResetPassword";
import Cart from "./components/page/user/Cart";
import CheckoutPage from "./components/page/user/CheckoutPage";
import PaymentSuccess from "./components/page/user/PaymentSuccess";
import Profile from "./components/page/user/Profile";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  // hiệu ứng header khi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
    window.scrollTo(0, 0);
  };

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  const handleCartClick = () => {
    navigate("/cart");
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (userInfo) => {
    setCurrentUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header
        isScrolled={isScrolled}
        handleLogoClick={handleLogoClick}
        handleLoginClick={handleLoginClick}
        handleCartClick={handleCartClick}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
