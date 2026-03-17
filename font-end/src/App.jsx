import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import ScrollToTop from "./ScrollToTop";

import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import Home from "./components/page/user/Home";
import Login from "./components/page/user/Login";
import Register from "./components/page/user/Register";
import OTP from "./components/page/user/OTP";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background-light">
      <Header
        isScrolled={isScrolled}
        handleLogoClick={handleLogoClick}
        handleLoginClick={handleLoginClick}
      />

      <ScrollToTop />
      {/* phần nội dung giữa, đẩy xuống dưới header */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OTP />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
