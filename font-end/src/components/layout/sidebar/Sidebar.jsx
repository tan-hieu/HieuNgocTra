import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  MapPin,
  Leaf,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Sản phẩm", path: "/admin/products" },
  { icon: ShoppingCart, label: "Đơn hàng", path: "/admin/orders" },
  { icon: Users, label: "Khách hàng", path: "/admin/customers" },
  { icon: FolderTree, label: "Danh mục", path: "/admin/categories" },
  { icon: MapPin, label: "Xuất xứ", path: "/admin/origins" },
];

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

export default function Sidebar() {
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    function syncUserFromStorage() {
      setUser(getStoredUser());
    }
    window.addEventListener("storage", syncUserFromStorage);
    return () => window.removeEventListener("storage", syncUserFromStorage);
  }, []);

  const profile = useMemo(() => {
    const fullName = user?.fullName || user?.username || "Admin";
    return {
      fullName,
      role: user?.roleName || "ADMIN",
      avatarUrl: user?.avatarUrl || "",
      initials: getInitials(fullName),
    };
  }, [user]);

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#fbf8f1] flex flex-col py-6 z-50 border-r border-[#ddd6c7]">
      <div className="px-8 mb-10 flex items-center gap-3">
        <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white shadow-md">
          <Leaf size={22} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-primary leading-none">
            Artisanal Ledger
          </h1>
          <p className="text-[10px] font-semibold text-[#617066] mt-1.5">
            Hệ thống quản trị
          </p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              "px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 group " +
              (isActive
                ? "bg-primary text-white shadow-sm"
                : "text-[#244334] hover:bg-[#edf3ef] hover:text-primary")
            }
          >
            <item.icon size={20} className="transition-colors shrink-0" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto">
        <div className="p-4 bg-[#eef4ef] rounded-2xl flex items-center gap-3 border border-[#d6e4d8]">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-11 h-11 rounded-full object-cover border border-[#d1e1d7]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {profile.initials}
            </div>
          )}

          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate text-primary">
              {profile.fullName}
            </p>
            <p className="text-[11px] font-semibold text-[#617066]">
              {profile.role === "ADMIN" ? "Quản trị viên" : profile.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
