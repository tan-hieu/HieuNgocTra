import { Search, ShoppingBag, Leaf, User } from "lucide-react";
import "./Header.css";
import logo from "../../../assets/logo/android-icon-144x144.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Header({
  isScrolled,
  handleLogoClick,
  handleLoginClick,
  handleCartClick,
  currentUser,
  onLogout,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isScrolled) {
      document.body.classList.add("scrolled");
    } else {
      document.body.classList.remove("scrolled");
    }
  }, [isScrolled]);

  // đóng menu khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current || menuRef.current.contains(e.target)) return;
      setOpenMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navItems = [
    { label: "Sản phẩm", to: "/products" },
    { label: "Câu chuyện", to: "/story" },
    { label: "Nguồn gốc", to: "/origin" },
    { label: "Liên hệ", to: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "px-6 lg:px-16 py-3 bg-background-light/95 backdrop-blur-md shadow-md border-b border-primary/5"
          : "px-6 lg:px-16 py-4 bg-gradient-to-b from-black/40 via-black/20 to-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-8">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none p-0"
          >
            <img
              src={logo}
              alt="Hiếu Ngọc Trà"
              className="w-9 h-9 rounded-full object-cover"
            />
            <h2
              className={`text-xl font-bold tracking-tight font-display transition-colors ${
                isScrolled
                  ? "text-primary"
                  : "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
              }`}
            >
              Trà Việt Cao Cấp
            </h2>
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="nav-link inline-flex items-center h-10 text-sm font-bold"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <div
            className={`hidden lg:flex items-center rounded-full px-4 py-1.5 border text-sm transition-all ${
              isScrolled
                ? "bg-primary/5 border-primary/10"
                : "bg-white/10 border-white/20 backdrop-blur-sm"
            }`}
          >
            <Search
              className={`w-4 h-4 mr-2 ${
                isScrolled ? "text-primary/60" : "text-white/60"
              }`}
            />
            <input
              type="text"
              placeholder="Tìm kiếm trà..."
              className={`bg-transparent border-none focus:ring-0 outline-none focus:outline-none text-sm w-44 lg:w-56 placeholder:transition-colors ${
                isScrolled
                  ? "text-primary placeholder:text-primary/50"
                  : "text-white placeholder:text-white/50"
              }`}
            />
          </div>

          <button
            onClick={handleCartClick}
            className={`p-2.5 rounded-full transition-colors relative ${
              isScrolled
                ? "hover:bg-primary/10 text-primary"
                : "hover:bg-white/10 text-white"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>

          {!currentUser && (
            <button
              onClick={handleLoginClick}
              className={`px-5 py-1.5 rounded-full font-bold text-sm transition-all border ${
                isScrolled
                  ? "border-primary text-primary hover:bg-primary hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-primary"
              }`}
            >
              Đăng nhập
            </button>
          )}

          {currentUser && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenMenu((v) => !v)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
                  isScrolled
                    ? "border-primary text-primary hover:bg-primary hover:text-white"
                    : "border-white text-white hover:bg-white hover:text-primary"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="max-w-[90px] truncate">
                  {currentUser.fullName || "Tài khoản"}
                </span>
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 text-sm z-50">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => {
                      setOpenMenu(false);
                      navigate("/profile");
                    }}
                  >
                    Hồ sơ
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
