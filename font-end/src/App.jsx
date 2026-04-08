import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

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
import DashboardMain from "./components/page/admin/DashboardMain";
import { ProductsPage } from "./components/page/admin/ProductsPage";
import { AddProductPage } from "./components/page/admin/AddProductPage";
import { OrdersPage } from "./components/page/admin/OrdersPage";
import { CustomersPage } from "./components/page/admin/CustomersPage";
import { AddCustomerPage } from "./components/page/admin/AddCustomerPage";
import { CategoriesPage } from "./components/page/admin/CategoriesPage";
import { AddCategoryPage } from "./components/page/admin/AddCategoryPage";
import { OriginsPage } from "./components/page/admin/OriginsPage";
import { AddOriginPage } from "./components/page/admin/AddOriginPage";
import { AddOrderPage } from "./components/page/admin/AddOrderPage";

function RequireAuth({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Component dùng để auto-logout rồi chuyển sang /login
function ForceLogoutToLogin({ onForceLogout }) {
  useEffect(() => {
    if (onForceLogout) {
      onForceLogout();
    }
  }, [onForceLogout]);

  return <Navigate to="/login" replace />;
}

// Chặn ADMIN truy cập các route dành cho user
function BlockAdminRoute({ isAdmin, onForceLogout, children }) {
  if (isAdmin) {
    return <ForceLogoutToLogin onForceLogout={onForceLogout} />;
  }
  return children;
}

// Chặn USER thường truy cập các route admin
function AdminRoute({ isAdmin, isLoggedIn, onForceLogout, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <ForceLogoutToLogin onForceLogout={onForceLogout} />;
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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

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

    // Nếu quay về từ Google và có token trên URL thì lưu lại
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      console.log("✓ Saved token from Google redirect");
    }

    const hasLocalUser = !!localStorage.getItem("user");
    const hasToken = !!localStorage.getItem("token");

    // Nếu không có token và cũng không có local user thì không cần gọi /me
    if (!cameFromGoogle && !hasLocalUser && !hasToken) {
      return;
    }

    async function fetchMe() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("✗ No token, skip /me");
        setCurrentUser(null);
        localStorage.removeItem("user");
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // GỬI JWT
          },
        });

        if (res.status === 401) {
          setCurrentUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          return;
        }

        if (!res.ok) {
          console.log("✗ /me returned", res.status);
          setCurrentUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          return;
        }

        const data = await res.json();
        console.log("✓ /me response:", data);

        const userData = data?.user ?? data;
        if (userData && userData.id) {
          setCurrentUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✓ User set from /me:", userData.email);

          // Nếu là admin và vừa quay về từ Google thì đẩy sang /admin
          if (userData.roleName === "ADMIN" && cameFromGoogle) {
            navigate("/admin");
          }
        } else {
          setCurrentUser(null);
          localStorage.removeItem("user");
        }

        if (cameFromGoogle || tokenFromUrl) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } catch (err) {
        console.error("✗ fetchMe error:", err);
        setCurrentUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
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

  // Logout khi bấm nút trong header user
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
      });
    } catch (e) {
      console.warn("logout request failed", e);
    }
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Logout dùng cho cả 2 guard (admin→user, user→admin)
  const forceLogoutForGuard = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
      });
    } catch (e) {
      console.warn("logout request failed", e);
    }
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      {/* Header/Footer user chỉ hiện khi không phải admin */}
      {!isAdminRoute && (
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
          {/* PUBLIC: không cần đăng nhập, nhưng ADMIN vào sẽ bị logout + đưa sang /login */}
          <Route
            path="/"
            element={
              <BlockAdminRoute
                isAdmin={isAdmin}
                onForceLogout={forceLogoutForGuard}
              >
                <Home />
              </BlockAdminRoute>
            }
          />
          <Route
            path="/products/:productId"
            element={
              <BlockAdminRoute
                isAdmin={isAdmin}
                onForceLogout={forceLogoutForGuard}
              >
                <ProductDetailPage />
              </BlockAdminRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <BlockAdminRoute
                isAdmin={isAdmin}
                onForceLogout={forceLogoutForGuard}
              >
                <Cart />
              </BlockAdminRoute>
            }
          />
          <Route
            path="/products"
            element={
              <BlockAdminRoute
                isAdmin={isAdmin}
                onForceLogout={forceLogoutForGuard}
              >
                <AllProductsPage />
              </BlockAdminRoute>
            }
          />

          {/* AUTH PAGES – luôn hiện form login, không tự redirect */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* USER PROTECTED: ADMIN cũng bị chặn qua BlockAdminRoute */}
          <Route
            path="/checkout"
            element={
              <BlockAdminRoute
                isAdmin={isAdmin}
                onForceLogout={forceLogoutForGuard}
              >
                <RequireAuth isLoggedIn={isLoggedIn}>
                  <CheckoutPage />
                </RequireAuth>
              </BlockAdminRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <BlockAdminRoute
                isAdmin={isAdmin}
                onForceLogout={forceLogoutForGuard}
              >
                <RequireAuth isLoggedIn={isLoggedIn}>
                  <PaymentSuccess />
                </RequireAuth>
              </BlockAdminRoute>
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

          {/* ADMIN: nested routes, dùng AdminLayout + Outlet, user thường vào sẽ bị logout + login */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute
                isAdmin={isAdmin}
                isLoggedIn={isLoggedIn}
                onForceLogout={forceLogoutForGuard}
              >
                <AdminLayout />
              </AdminRoute>
            }
          >
            {/* /admin -> DashboardMain */}
            <Route index element={<DashboardMain />} />

            {/* /admin/products -> ProductsPage */}
            <Route path="products" element={<ProductsPage />} />

            {/* /admin/products/add */}
            <Route path="products/add" element={<AddProductPage />} />

            {/* /admin/orders -> OrdersPage */}
            <Route path="orders" element={<OrdersPage />} />

            {/* /admin/orders/add */}
            <Route path="orders/add" element={<AddOrderPage />} />

            {/* /admin/customers -> CustomersPage */}
            <Route path="customers" element={<CustomersPage />} />

            {/* /admin/customers/add */}
            <Route path="customers/add" element={<AddCustomerPage />} />

            {/* /admin/categories -> CategoriesPage */}
            <Route path="categories" element={<CategoriesPage />} />

            {/* /admin/categories/add */}
            <Route path="categories/add" element={<AddCategoryPage />} />

            {/* /admin/origins -> OriginsPage */}
            <Route path="origins" element={<OriginsPage />} />

            {/* /admin/origins/add */}
            <Route path="origins/add" element={<AddOriginPage />} />

            <Route
              path="profile"
              element={
                <RequireAuth isLoggedIn={isLoggedIn}>
                  <Profile />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </main>

      {!isAdmin && <Footer />}
    </div>
  );
}

export default App;
