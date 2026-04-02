import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

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

import AdminLayout from "./components/page/admin/AdminLayout";

function RequireAuth({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();

  const isAdmin = currentUser && currentUser.roleName === "ADMIN";
  const isLoggedIn = !!currentUser;

  // hiệu ứng header khi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GỌI /me khi:
  // 1) đã có localStorage user, hoặc
  // 2) vừa quay về từ Google login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cameFromGoogle = params.get("oauth2") === "success";
    const hasLocalUser = !!localStorage.getItem("user");

    if (!cameFromGoogle && !hasLocalUser) {
      return;
    }

    async function fetchMe() {
      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          setCurrentUser(null);
          localStorage.removeItem("user");
          return;
        }

        if (!res.ok) {
          console.log("✗ /me returned", res.status);
          setCurrentUser(null);
          localStorage.removeItem("user");
          return;
        }

        const data = await res.json();
        console.log("✓ /me response:", data);

        const userData = data?.user ?? data;
        if (userData && userData.id) {
          setCurrentUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✓ User set from /me:", userData.email);
          // Nếu là admin thì chuyển sang trang admin
          if (userData.roleName === "ADMIN") {
            navigate("/admin");
          }
        } else {
          setCurrentUser(null);
          localStorage.removeItem("user");
        }

        // Xóa query param sau khi xử lý xong
        if (cameFromGoogle) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (err) {
        console.error("✗ fetchMe error:", err);
        setCurrentUser(null);
        localStorage.removeItem("user");
      }
    }

    fetchMe();
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

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("logout request failed", e);
    }
    setCurrentUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      {!isAdmin && (
        <Header
          isScrolled={isScrolled}
          handleLogoClick={handleLogoClick}
          handleLoginClick={handleLoginClick}
          handleCartClick={handleCartClick}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      <ScrollToTop />
      <main>
        <Routes>
          {/* PUBLIC: không cần đăng nhập */}
          <Route path="/" element={<Home />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<AllProductsPage />} />

          {/* AUTH PAGES: luôn cho vào được khi chưa đăng nhập */}
          <Route
            path="/login"
            element={
              currentUser ? (
                currentUser.roleName === "ADMIN" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* USER PROTECTED: phải đăng nhập mới vào được */}
          {/* <Route
            path="/products"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <AllProductsPage />
              </RequireAuth>
            }
          /> */}
          <Route
            path="/checkout"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <CheckoutPage />
              </RequireAuth>
            }
          />
          <Route
            path="/payment-success"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <PaymentSuccess />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                <Profile />
              </RequireAuth>
            }
          />

          {/* ADMIN: phải đăng nhập, và là ADMIN */}
          <Route
            path="/admin"
            element={
              <RequireAuth isLoggedIn={isLoggedIn}>
                {isAdmin ? <AdminLayout /> : <Navigate to="/" replace />}
              </RequireAuth>
            }
          />
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
