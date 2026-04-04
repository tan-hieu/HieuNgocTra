import { Search, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate("/profile");
  };

  const handleLogoutClick = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Logout failed", e);
    }
    localStorage.removeItem("user");
    setIsProfileOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-72 right-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 h-20 shadow-sm border-b-2 border-primary-container/30">
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ width: 0, opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-0.5 bg-primary z-50"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40"
            size={18}
          />
          <input
            className="w-full pl-12 pr-4 py-2.5 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm transition-all outline-none"
            placeholder="Tìm kiếm dữ liệu, đơn hàng..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>

        <div className="h-8 w-[1px] bg-surface-container-high"></div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-surface-container-high transition-all group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold font-serif group-hover:text-primary transition-colors">
                Admin Profile
              </p>
              <p className="text-[10px] text-on-surface-variant/60">
                Đang trực tuyến
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold border-2 border-surface shadow-sm">
              TM
            </div>

            <ChevronDown
              size={14}
              className={`text-on-surface-variant transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-surface-container-high py-2 z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-surface-container-high mb-1">
                  <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest">
                    Tài khoản
                  </p>
                  <p className="text-sm font-bold mt-1">Trần Hoàng Minh</p>
                  <p className="text-[10px] text-on-surface-variant/60">
                    minh.tran@artisanal.vn
                  </p>
                </div>

                {/* Xem hồ sơ */}
                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-2.5 text-sm text-on-surface hover:bg-primary/5 hover:text-primary flex items-center gap-3 transition-colors"
                >
                  <User size={16} className="text-on-surface-variant" />
                  Xem hồ sơ
                </button>

                <div className="h-px bg-surface-container-high my-1 mx-2"></div>

                {/* Đăng xuất – chữ đỏ, hover nền đỏ nhạt */}
                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut size={16} className="text-red-600" />
                  Đăng xuất
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
