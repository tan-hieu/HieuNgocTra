import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Layers,
  MapPin,
  Settings,
  Leaf,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

function NavItem({ icon, label, to = "#", active = false }) {
  return (
    <NavLink
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-stone-700 hover:bg-surface-container-high"
      }`}
      end
    >
      <span className="w-6 h-6 flex items-center justify-center text-stone-500">
        {icon}
      </span>
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goProfile() {
    setOpen(false);
    navigate("/profile");
  }

  async function handleLogout() {
    setOpen(false);
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.warn("logout request failed", e);
    }
    localStorage.removeItem("user");
    navigate("/");
    // reload to ensure App re-initializes and header visibility updates
    window.location.reload();
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low flex flex-col py-8 z-50">
      <div className="px-8 mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
          <LayoutDashboard className="text-on-primary-container w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold font-serif text-primary leading-none">
            Artisanal Ledger
          </h1>
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-stone-500 mt-1">
            Quản trị hệ thống
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active
        />
        <NavItem icon={<Package size={20} />} label="Sản phẩm" />
        <NavItem icon={<ShoppingCart size={20} />} label="Đơn hàng" />
        <NavItem icon={<Users size={20} />} label="Khách hàng" />
        <NavItem icon={<Layers size={20} />} label="Danh mục" />
        <NavItem icon={<MapPin size={20} />} label="Xuất xứ" />
        <NavItem icon={<Settings size={20} />} label="Cài đặt" />
      </nav>

      <div className="px-6 mt-auto">
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full p-4 bg-surface-container-high rounded-xl flex items-center gap-3"
          >
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://picsum.photos/seed/admin/100/100"
              alt="Admin"
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold font-serif truncate">
                Trần Hoàng Minh
              </p>
              <p className="text-xs text-stone-500">Quản trị viên</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-stone-500 transform transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute left-0 bottom-full mb-3 w-44 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={goProfile}
                className="w-full px-4 py-2 text-sm flex items-center gap-2 hover:bg-surface-container-high"
              >
                <User size={16} />
                Hồ sơ
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-sm flex items-center gap-2 text-rose-600 hover:bg-surface-container-high"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
