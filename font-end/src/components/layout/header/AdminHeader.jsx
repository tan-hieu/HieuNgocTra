import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";

function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [user, setUser] = useState(() => getStoredUser());

  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 260);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    function syncUserFromStorage() {
      setUser(getStoredUser());
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", syncUserFromStorage);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", syncUserFromStorage);
    };
  }, []);

  const profile = useMemo(() => {
    const fullName = user?.fullName || user?.username || "Admin";
    return {
      fullName,
      email: user?.email || "admin@hieungoctra.local",
      role: user?.roleName || "ADMIN",
      avatarUrl: user?.avatarUrl || "",
      initials: getInitials(fullName),
    };
  }, [user]);

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate("/admin/profile");
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
    localStorage.removeItem("token");
    setIsProfileOpen(false);
    window.location.href = "/login";
  };

  return (
    <header className="fixed top-0 left-72 right-0 z-40 bg-[#fffdf8]/90 backdrop-blur-md flex justify-between items-center px-8 h-20 shadow-sm border-b border-[#ddd6c7]">
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ width: 0, opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-0.5 bg-primary z-50"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center flex-1 max-w-xl" />

      <div className="flex items-center gap-5">
        <button className="relative p-2 text-[#617066] hover:text-primary rounded-full hover:bg-[#f3efe6]">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#c2410c] rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-[#e5dfd1]"></div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pr-2 rounded-full hover:bg-[#f3efe6] transition-all group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-[#1c2a22] group-hover:text-primary">
                {profile.fullName}
              </p>
              <p className="text-[11px] text-[#617066]">
                {profile.role === "ADMIN" ? "Quản trị viên" : profile.role}
              </p>
            </div>

            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-11 h-11 rounded-full object-cover border border-[#ddd6c7] shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#e7efe9] text-primary flex items-center justify-center font-bold border border-[#d1e1d7] shadow-sm">
                {profile.initials}
              </div>
            )}

            <ChevronDown
              size={14}
              className={`text-[#617066] transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e8e2d6] py-2 z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-[#f0ebdf] mb-1">
                  <p className="text-xs font-bold text-[#7b877f] uppercase tracking-wider">
                    Tài khoản
                  </p>
                  <p className="text-sm font-semibold mt-1 text-[#1c2a22]">
                    {profile.fullName}
                  </p>
                  <p className="text-[11px] text-[#617066]">{profile.email}</p>
                </div>

                <button
                  onClick={handleProfileClick}
                  className="w-full px-4 py-2.5 text-sm text-[#1c2a22] hover:bg-[#f6f2ea] hover:text-primary flex items-center gap-3"
                >
                  <User size={16} className="text-[#617066]" />
                  Xem hồ sơ
                </button>

                <div className="h-px bg-[#f0ebdf] my-1 mx-2"></div>

                <button
                  onClick={handleLogoutClick}
                  className="w-full px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-3"
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
